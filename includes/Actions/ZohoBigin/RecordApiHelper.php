<?php

/**
 * ZohoBigin Record Api
 */

namespace BitCode\FI\Actions\ZohoBigin;

use WP_Error;
use BitCode\FI\Log\LogHandler;
use BitCode\FI\Core\Util\Common;
use BitCode\FI\Core\Util\HttpHelper;
use BitCode\FI\Core\Util\DateTimeHelper;
use BitCode\FI\Core\Util\FieldValueHandler;
use BitCode\FI\Actions\ZohoBigin\FilesApiHelper;
use BitCode\FI\Core\Util\ApiResponse as UtilApiResponse;

/**
 * Provide functionality for Record insert,upsert
 */
class RecordApiHelper
{
    private $_defaultHeader;
    private $_apiDomain;
    private $_tokenDetails;

    public function __construct($tokenDetails, $integID)
    {
        $this->_defaultHeader['Authorization'] = "Zoho-oauthtoken {$tokenDetails->access_token}";
        $this->_apiDomain = \urldecode($tokenDetails->api_domain);
        $this->_tokenDetails = $tokenDetails;
        $this->_integID = $integID;
    }

    public function insertRecord($module, $data)
    {
        $insertRecordEndpoint = "{$this->_apiDomain}/bigin/v1/{$module}";
        return HttpHelper::post($insertRecordEndpoint, $data, $this->_defaultHeader);
    }

    private function insertNote($module, $recordId, $data)
    {
        $insertRecordEndpoint = "{$this->_apiDomain}/bigin/v1/{$module}/{$recordId}/Notes";
        return HttpHelper::post($insertRecordEndpoint, $data, $this->_defaultHeader);
    }

    public function execute($defaultConf, $module, $fieldValues, $fieldMap, $actions, $required, $integrationDetails)
    {
        $fieldData = [];
        foreach ($fieldMap as $fieldKey => $fieldPair) {
            if (!empty($fieldPair->zohoFormField)) {
                if ($fieldPair->formField === 'custom' && isset($fieldPair->customValue)) {
                    $fieldData[$fieldPair->zohoFormField] = $this->formatFieldValue($fieldPair->customValue, $defaultConf->moduleData->{$module}->fields->{$fieldPair->zohoFormField});
                } else {
                    $fieldData[$fieldPair->zohoFormField] = $this->formatFieldValue($fieldValues[$fieldPair->formField], $defaultConf->moduleData->{$module}->fields->{$fieldPair->zohoFormField});
                }

                if (empty($fieldData[$fieldPair->zohoFormField]) && \in_array($fieldPair->zohoFormField, $required)) {
                    $error = new WP_Error('REQ_FIELD_EMPTY', wp_sprintf(__('%s is required for zoho bigin, %s module', 'bit-integrations'), $fieldPair->zohoFormField, $module));
                    LogHandler::save($this->_integID, ['type' => 'record', 'type_name' => 'field'], 'validation', $error);
                    return $error;
                }
            }
        }
        if ($module === 'Deals') {
            $fieldData['Pipeline'] = $integrationDetails->pLayout;
        }

        $requestParams['trigger'] = [];
        if (!empty($actions->approval)) {
            $fieldData['$approved'] = false;
            $requestParams['trigger'][] = 'approval';
        }
        $requestParams['data'][] =  (object) $fieldData;

        if (!empty($actions->workflow)) {
            $requestParams['trigger'][] = 'workflow';
        }

        $recordApiResponse = $this->insertRecord($module, wp_json_encode($requestParams));
        if ((isset($recordApiResponse->status) &&  $recordApiResponse->status === 'error') || $recordApiResponse->data[0]->status === 'error') {
            return LogHandler::save($this->_integID, ['type' => 'record', 'type_name' => $module], 'error', $recordApiResponse);
        } else {
            LogHandler::save($this->_integID, ['type' => 'record', 'type_name' => $module], 'success', $recordApiResponse);
        }
        $recordID = 0;
        if (!empty($recordApiResponse->data[0]->details->id)) {
            $recordID = $recordApiResponse->data[0]->details->id;
            if (isset($actions->note)) {
                $note_title = $actions->note->title ? $actions->note->title : '';
                $note_content = $actions->note->content ? Common::replaceFieldWithValue($actions->note->content, $fieldValues) : '';
                $note = (object) array(
                    'Note_Title' => $note_title,
                    'Note_Content' => $note_content,
                    'Parent_Id' => $recordID,
                    'se_module' => $module
                );
                $requestParams['data'][] = $note;

                $noteApiResponse = $this->insertNote($module, $recordID, wp_json_encode($requestParams));
                if (isset($noteApiResponse->status) &&  $noteApiResponse->status === 'error') {
                    LogHandler::save($this->_integID, ['type' => 'note', 'type_name' => $module], 'error', $noteApiResponse);
                } else {
                    LogHandler::save($this->_integID, ['type' => 'note', 'type_name' => $module], 'success', $noteApiResponse);
                }
            }
        }

        // Attachments
        if (isset($actions->attachments)) {
            $filesApiHelper = new FilesApiHelper($this->_tokenDetails);
            $attachments = explode(",", $actions->attachments);
            $fileFound = 0;
            $responseType = 'success';
            $attachmentApiResponses = [];
            foreach ($attachments as $fileField) {
                if (isset($fieldValues[$fileField]) && !empty($fieldValues[$fileField])) {
                    $fileFound = 1;
                    $response   = static::letsUploadFiles($fieldValues[$fileField], $filesApiHelper, $module, $recordID);

                    $responseType           = $response['responseType'];
                    $attachmentApiResponses = $response['attachmentApiResponse'];
                }
            }
            if ($fileFound) {
                LogHandler::save($this->_integID, ['type' => 'file', 'type_name' => $module], $responseType, $attachmentApiResponses);
            }
        }

        if (isset($actions->photo)) {
            $filesApiHelper = new FilesApiHelper($this->_tokenDetails);
            if (isset($fieldValues[$actions->photo])) {
                $response = static::letsUploadFiles($fieldValues[$actions->photo], $filesApiHelper, $module, $recordID, true);
                $attachmentApiResponse = $response['attachmentApiResponse'];

                if (is_object($attachmentApiResponse) &&  isset($attachmentApiResponse->status) &&  $attachmentApiResponse->status === 'error') {
                    LogHandler::save($this->_integID, ['type' => 'photo', 'type_name' => $module], 'error', $attachmentApiResponse);
                } else {
                    LogHandler::save($this->_integID, ['type' => 'photo', 'type_name' => $module], 'success', $attachmentApiResponse);
                }
            }
        }

        return $recordApiResponse;
    }

    private static function letsUploadFiles($attachments, $filesApiHelper, $module, $recordID, $isPhoto = null)
    {
        if (is_array($attachments)) {
            $response = '';
            foreach ($attachments as $attachment) {
                $response = static::letsUploadFiles($attachment, $filesApiHelper, $module, $recordID, $isPhoto);
            }
            return $response;
        }

        $attachmentApiResponse = $filesApiHelper->uploadFiles($attachments, $module, $recordID, $isPhoto);
        if (is_object($attachmentApiResponse) &&  isset($attachmentApiResponse->status) &&  $attachmentApiResponse->status === 'error') {
            $responseType = 'error';
        }

        return ['attachmentApiResponse' => $attachmentApiResponse, 'responseType' => $responseType ?? 'success'];
    }

    public function formatFieldValue($value, $formatSpecs)
    {
        if (empty($value)) {
            return '';
        }

        switch ($formatSpecs->data_type) {
            case 'AutoNumber':
                $apiFormat = 'integer';
                break;

            case 'Text':
            case 'Pick list':
            case 'Lookup':
            case 'Email':
            case 'Website':
            case 'Currency':
            case 'TextArea':
                $apiFormat = 'string';
                break;

            case 'Date':
                $apiFormat = 'date';
                break;

            case 'DateTime':
                $apiFormat = 'datetime';
                break;

            case 'Double':
                $apiFormat = 'double';
                break;

            case 'Boolean':
                $apiFormat = 'boolean';
                break;

            default:
                $apiFormat = $formatSpecs->data_type;
                break;
        }

        $formatedValue = '';
        $fieldFormat = gettype($value);
        if ($fieldFormat === $apiFormat && $formatSpecs->data_type !== 'datetime') {
            $formatedValue = $value;
        } else {
            if ($apiFormat === 'string' && $formatSpecs->data_type !== 'datetime') {
                $formatedValue = !is_string($value) ? json_encode($value) : $value;
            } elseif ($apiFormat === 'datetime') {
                $dateTimeHelper = new DateTimeHelper();
                $formatedValue = $dateTimeHelper->getFormated($value, 'Y-m-d\TH:i', DateTimeHelper::wp_timezone(), 'Y-m-d H:i:s', null);
            } elseif ($apiFormat === 'date') {
                $dateTimeHelper = new DateTimeHelper();
                $formatedValue = $dateTimeHelper->getFormated($value, 'Y-m-d', DateTimeHelper::wp_timezone(), 'm/d/Y', null);
            } else {
                $stringyfiedValue = !is_string($value) ? json_encode($value) : $value;

                switch ($apiFormat) {
                    case 'double':
                        $formatedValue = (float) $stringyfiedValue;
                        break;

                    case 'boolean':
                        $formatedValue = (bool) $stringyfiedValue;
                        break;

                    case 'integer':
                        $formatedValue = (int) $stringyfiedValue;
                        break;

                    default:
                        $formatedValue = $stringyfiedValue;
                        break;
                }
            }
        }
        $formatedValueLenght = $apiFormat === 'array' || $apiFormat === 'object' ? (is_countable($formatedValue) ? \count($formatedValue) : @count($formatedValue)) : \strlen($formatedValue);
        if ($formatedValueLenght > $formatSpecs->length) {
            $formatedValue = $apiFormat === 'array' || $apiFormat === 'object' ? array_slice($formatedValue, 0, $formatSpecs->length) : substr($formatedValue, 0, $formatSpecs->length);
        }

        return $formatedValue;
    }
}
