<?php

/**
 * ZohoCreator Record Api
 */

namespace BitCode\FI\Actions\ZohoCreator;

use BitCode\FI\Core\Util\ApiResponse as UtilApiResponse;
use BitCode\FI\Core\Util\DateTimeHelper;
use BitCode\FI\Core\Util\HttpHelper;
use BitCode\FI\Log\LogHandler;
use WP_Error;

/**
 * Provide functionality for Record insert,upsert
 */
class RecordApiHelper
{
    private $_defaultHeader;

    private $_apiDomain;

    private $_tokenDetails;

    public function __construct($tokenDetails, $integId)
    {
        $this->_defaultHeader['Authorization'] = "Zoho-oauthtoken {$tokenDetails->access_token}";
        $this->_defaultHeader['Content-Type'] = 'application/json';
        $this->_apiDomain = urldecode($tokenDetails->api_domain);
        $this->_tokenDetails = $tokenDetails;
        $this->_integrationID = $integId;
        $this->_logResponse = new UtilApiResponse();
    }

    public function insertRecord($dataCenter, $accountOwner, $applicationId, $formId, $data)
    {
        $insertRecordEndpoint = "https://creator.zoho.{$dataCenter}/api/v2/{$accountOwner}/{$applicationId}/form/{$formId}";

        return HttpHelper::post($insertRecordEndpoint, $data, $this->_defaultHeader);
    }

    public function updateRecord($dataCenter, $accountOwner, $applicationId, $reportId, $data)
    {
        $insertRecordEndpoint = "https://creator.zoho.{$dataCenter}/api/v2/{$accountOwner}/{$applicationId}/report/{$reportId}";

        return HttpHelper::request($insertRecordEndpoint, 'PATCH', $data, $this->_defaultHeader);
    }

    public function execute($formID, $entryID, $fieldValues, $integrationDetails)
    {
        $dataCenter = $integrationDetails->dataCenter;
        $accountOwner = $integrationDetails->accountOwner;
        $applicationId = $integrationDetails->applicationId;
        $formId = $integrationDetails->formId;
        $fieldMap = $integrationDetails->field_map;
        $uploadFieldMap = $integrationDetails->upload_field_map;
        $actions = $integrationDetails->actions;
        $defaultFields = $integrationDetails->default->fields->{$applicationId}->{$formId}->fields;
        $required = $integrationDetails->default->fields->{$applicationId}->{$formId}->required;
        $dateFormat = '';
        foreach ($integrationDetails->default->applications as $defaultApplication) {
            if ($defaultApplication->applicationId === $applicationId) {
                $dateFormat = $defaultApplication->date_format;

                break;
            }
        }

        $fieldData = [];
        $dateTimeHelper = new DateTimeHelper();
        $convertedDateFormat = $dateTimeHelper->getUnicodeToPhpFormat('date', $dateFormat);

        foreach ($defaultFields as $defaultField) {
            foreach ($fieldMap as $fieldPair) {
                if (!empty($fieldPair->zohoFormField) && $fieldPair->zohoFormField === $defaultField->apiName) {
                    if (isset($defaultField->parent)) {
                        if ($fieldPair->formField === 'custom' && isset($fieldPair->customValue)) {
                            $fieldData['data'][$defaultField->parent][$fieldPair->zohoFormField] = $this->testDate($fieldPair->customValue) ? date_format(date_create($fieldPair->customValue), $convertedDateFormat) : $fieldPair->customValue;
                        } else {
                            $fieldData['data'][$defaultField->parent][$fieldPair->zohoFormField] = $this->testDate($fieldValues[$fieldPair->formField]) ? date_format(date_create($fieldValues[$fieldPair->formField]), $convertedDateFormat) : $fieldValues[$fieldPair->formField];
                        }
                    } elseif ($fieldPair->formField === 'custom' && isset($fieldPair->customValue)) {
                        if ($defaultField->apiName === 'Url') {
                            $fieldData['data']['Url']['url'] = $fieldPair->customValue;
                        } elseif (isset($defaultField->type)) {
                            $fieldData['data'][$fieldPair->zohoFormField] = \gettype($fieldPair->customValue) === 'string' ? explode(',', $fieldPair->customValue) : $fieldPair->customValue;
                        } else {
                            $fieldData['data'][$fieldPair->zohoFormField] = $this->testDate($fieldPair->customValue) ? date_format(date_create($fieldPair->customValue), $convertedDateFormat) : $fieldPair->customValue;
                        }
                    } else {
                        if ($defaultField->apiName === 'Url') {
                            $fieldData['data']['Url']['url'] = $fieldValues[$fieldPair->formField];
                        } elseif (isset($defaultField->type)) {
                            $fieldData['data'][$fieldPair->zohoFormField] = \gettype($fieldValues[$fieldPair->formField]) === 'string' ? explode(',', $fieldValues[$fieldPair->formField]) : $fieldValues[$fieldPair->formField];
                        } else {
                            $fieldData['data'][$fieldPair->zohoFormField] = $this->testDate($fieldValues[$fieldPair->formField]) ? date_format(date_create($fieldValues[$fieldPair->formField]), $convertedDateFormat) : $fieldValues[$fieldPair->formField];
                        }
                    }

                    break;
                }
            }
            if (empty($fieldData['data'][$fieldPair->zohoFormField]) && \in_array($fieldPair->zohoFormField, $required)) {
                $error = new WP_Error('REQ_FIELD_EMPTY', wp_sprintf(__('%s is required for zoho creator', 'bit-integrations'), $fieldPair->zohoFormField));
                // $this->_logResponse->apiResponse($this->_logID, $this->_integrationID, ['type' => 'record', 'type_name' => 'field'], 'validation', $error);

                LogHandler::save($this->_integrationID, wp_json_encode(['type' => 'record', 'type_name' => 'field']), 'error', wp_json_encode($error));

                return $error;
            }
        }

        $recordApiResponse = '';

        $allReports = $this->getAllReports($dataCenter, $accountOwner, $applicationId);

        $reportId = $allReports->reports[0]->link_name;

        if (isset($actions->update->criteria)) {
            $fieldData['criteria'] = $actions->update->criteria;
            $recordApiResponse = $this->updateRecord($dataCenter, $accountOwner, $applicationId, $reportId, wp_json_encode($fieldData));
            // if (isset($recordApiResponse->code) && $recordApiResponse->code === 3000) {
            //     $this->_logResponse->apiResponse($this->_logID, $this->_integrationID, ['type' => 'record', 'type_name' => 'update'], 'success', $recordApiResponse);
            // } else {
            //     $this->_logResponse->apiResponse($this->_logID, $this->_integrationID, ['type' => 'record', 'type_name' => 'update'], 'error', $recordApiResponse);
            // }

            if (isset($recordApiResponse->code) && $recordApiResponse->code === 3000) {
                LogHandler::save($this->_integrationID, wp_json_encode(['type' => 'record', 'type_name' => 'update']), 'success', wp_json_encode($recordApiResponse));
            } else {
                LogHandler::save($this->_integrationID, wp_json_encode(['type' => 'record', 'type_name' => 'update']), 'error', wp_json_encode($recordApiResponse));
            }

            unset($fieldData['criteria']);

            if ($actions->update->insert && isset($recordApiResponse->message) && $recordApiResponse->message === 'No Data Available') {
                $recordApiResponse = $this->insertRecord($dataCenter, $accountOwner, $applicationId, $formId, wp_json_encode($fieldData));
                // if (isset($recordApiResponse->code) && $recordApiResponse->code === 3000) {
                //     $this->_logResponse->apiResponse($this->_logID, $this->_integrationID, ['type' => 'record', 'type_name' => 'insert'], 'success', $recordApiResponse);
                // } else {
                //     $this->_logResponse->apiResponse($this->_logID, $this->_integrationID, ['type' => 'record', 'type_name' => 'insert'], 'error', $recordApiResponse);
                // }

                if (isset($recordApiResponse->code) && $recordApiResponse->code === 3000) {
                    LogHandler::save($this->_integrationID, wp_json_encode(['type' => 'record', 'type_name' => 'insert']), 'success', wp_json_encode($recordApiResponse));
                } else {
                    LogHandler::save($this->_integrationID, wp_json_encode(['type' => 'record', 'type_name' => 'insert']), 'error', wp_json_encode($recordApiResponse));
                }
            }
        } else {
            $recordApiResponse = $this->insertRecord($dataCenter, $accountOwner, $applicationId, $formId, wp_json_encode($fieldData));
            // if (isset($recordApiResponse->code) && $recordApiResponse->code === 3000) {
            //     $this->_logResponse->apiResponse($this->_logID, $this->_integrationID, ['type' => 'record', 'type_name' => 'insert'], 'success', $recordApiResponse);
            // } else {
            //     $this->_logResponse->apiResponse($this->_logID, $this->_integrationID, ['type' => 'record', 'type_name' => 'insert'], 'error', $recordApiResponse);
            // }

            if (isset($recordApiResponse->code) && $recordApiResponse->code === 3000) {
                LogHandler::save($this->_integrationID, wp_json_encode(['type' => 'record', 'type_name' => 'insert']), 'success', wp_json_encode($recordApiResponse));
            } else {
                LogHandler::save($this->_integrationID, wp_json_encode(['type' => 'record', 'type_name' => 'insert']), 'error', wp_json_encode($recordApiResponse));
            }
        }

        if (isset($recordApiResponse->result)) {
            foreach ($recordApiResponse->result as $record) {
                $recordId = $record->data->ID;
                $this->uploadFileToRecord($uploadFieldMap, $fieldValues, $dataCenter, $formID, $entryID, $accountOwner, $applicationId, $reportId, $recordId);
            }
        } else {
            $recordId = $recordApiResponse->data->ID;

            $this->uploadFileToRecord($uploadFieldMap, $fieldValues, $dataCenter, $formID, $entryID, $accountOwner, $applicationId, $reportId, $recordId);
        }

        return $recordApiResponse;
    }

    private function getAllReports($dataCenter, $accountOwner, $applicationId)
    {
        $getReportsEndpoint = "https://creator.zoho.{$dataCenter}/api/v2/{$accountOwner}/{$applicationId}/reports";

        return HttpHelper::get($getReportsEndpoint, null, $this->_defaultHeader);
    }

    private function testDate($date)
    {
        return (bool) ($date && date('Y-m-d', strtotime($date)) == $date)

        ;
    }

    private function uploadFileToRecord($uploadFieldMap, $fieldValues, $dataCenter, $formID, $entryID, $accountOwner, $applicationId, $reportId, $recordId)
    {
        $fileFound = 0;
        $fileApiResponses = [];
        $responseType = 'success';
        foreach ($uploadFieldMap as $uploadField) {
            if (!empty($uploadField->formField) && !empty($uploadField->zohoFormField)) {
                $filesApiHelper = new FilesApiHelper($this->_tokenDetails, $formID, $entryID);
                if (isset($fieldValues[$uploadField->formField]) && !empty($fieldValues[$uploadField->formField])) {
                    $fileFound = 1;
                    if (\is_array($fieldValues[$uploadField->formField])) {
                        foreach ($fieldValues[$uploadField->formField] as $singleFile) {
                            $fileApiResponse = $filesApiHelper->uploadFiles($dataCenter, $singleFile, $accountOwner, $applicationId, $reportId, $recordId, $uploadField->zohoFormField);
                            if (isset($fileApiResponse->code) && $fileApiResponse->code !== 3000) {
                                $responseType = 'error';
                            }
                            $fileApiResponses[] = $fileApiResponse;
                        }
                    } else {
                        $fileApiResponse = $filesApiHelper->uploadFiles($dataCenter, $fieldValues[$uploadField->formField], $accountOwner, $applicationId, $reportId, $recordId, $uploadField->zohoFormField);
                        if (isset($fileApiResponse->code) && $fileApiResponse->code !== 3000) {
                            $responseType = 'error';
                        }
                        $fileApiResponses[] = $fileApiResponse;
                    }
                }
            }
        }

        if ($fileFound) {
            // $this->_logResponse->apiResponse($this->_logID, $this->_integrationID, ['type' => 'file', 'type_name' => 'form'], $responseType, $fileApiResponses);

            LogHandler::save($this->_integrationID, wp_json_encode(['type' => 'file', 'type_name' => 'form']), $responseType, wp_json_encode($fileApiResponses));
        }

        return $fileApiResponses;
    }
}
