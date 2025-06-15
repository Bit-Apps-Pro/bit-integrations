<?php

/**
 * Convert Kit Record Api
 */

namespace BitCode\FI\Actions\ConvertKit;

use BitCode\FI\Core\Util\HttpHelper;
use BitCode\FI\Log\LogHandler;

/**
 * Provide functionality for Record insert,update, exist
 */
class RecordApiHelper
{
    private $_defaultHeader;
    private $_integrationID;
    private $_apiEndpoint;

    
    public function __construct($api_secret, $integId)
    {
        // wp_send_json_success($tokenDetails);
        $this->_defaultHeader = $api_secret;
        $this->_apiEndpoint = 'https://api.convertkit.com/v3';
        $this->_integrationID = $integId;
    }

    // for adding a subscriber
    public function storeOrModifyRecord($method, $formId, $data)
    {
        $query = [
            'api_secret' => $this->_defaultHeader,
            'email' => $data->email,
            'first_name' => $data->firstName,
        ];

        foreach ($data as $key=>$value) {
            $key = strtolower(preg_replace('/(?<!^)[A-Z]/', '_$0', $key));
            $array_keys = array_keys($query);
            if (!(in_array($key, $array_keys))) {
                $query['fields'] = [
                     $key => $value,
                ];
            }
        }

        $queries= http_build_query($query);

        $insertRecordEndpoint = "{$this->_apiEndpoint}/forms/{$formId}/{$method}?{$queries}";

        $res = HttpHelper::post($insertRecordEndpoint, null);
        return $res;
    }

    //for updating subscribers data through email id.
    public function updateRecord($id, $data, $existSubscriber)
    {
        $subscriberData = $data;

        foreach ($subscriberData as $key => $value) {
            if ($value === '') {
                $subscriberData->$key = $existSubscriber->subscribers[0]->$key;
            }
        }

        $query = [
            'api_secret' => $this->_defaultHeader,
            'email_address' => $data->email,
            'first_name' => $data->firstName,
        ];

        foreach ($data as $key=>$value) {
            $key = strtolower(preg_replace('/(?<!^)[A-Z]/', '_$0', $key));
            $array_keys = array_keys($query);
            if (!(in_array($key, $array_keys))) {
                $query['fields'] = [
                     $key => $value,
                ];
            }
        }

        $queries= http_build_query($query);

        $updateRecordEndpoint = "{$this->_apiEndpoint}/subscribers/{$id}?".$queries;

        return  HttpHelper::request($updateRecordEndpoint, 'PUT', null);
    }

    //add tag to a subscriber
    public function addTagToSubscriber($email, $tags)
    {
        $queries = http_build_query([
            'api_secret' => $this->_defaultHeader,
            'email' => $email,
        ]);
        foreach ($tags as $tagId) {
            $searchEndPoint = "{$this->_apiEndpoint}/tags/{$tagId}/subscribe?{$queries}";

            HttpHelper::post($searchEndPoint, null);
        }
    }

    //Check if a subscriber exists through email.
    private function existSubscriber($email)
    {
        $queries = http_build_query([
            'api_secret' => $this->_defaultHeader,
            'email_address' => $email,
        ]);
        $searchEndPoint = "{$this->_apiEndpoint}/subscribers?{$queries}";

        return HttpHelper::get($searchEndPoint, null);
    }


    public function execute($fieldValues, $fieldMap, $actions, $formId, $tags)
    {
        $fieldData = [];
        $customFields = [];

        foreach ($fieldMap as $fieldKey => $fieldPair) {
            if (!empty($fieldPair->convertKitField)) {
                if ($fieldPair->formField === 'custom' && isset($fieldPair->customValue) && !is_numeric($fieldPair->convertKitField)) {
                    $fieldData[$fieldPair->convertKitField] = $fieldPair->customValue;
                } elseif (is_numeric($fieldPair->convertKitField) && $fieldPair->formField === 'custom' && isset($fieldPair->customValue)) {
                    array_push($customFields, ['field' => (int) $fieldPair->convertKitField, 'value' => $fieldPair->customValue]);
                } elseif (is_numeric($fieldPair->convertKitField)) {
                    array_push($customFields, ['field' => (int) $fieldPair->convertKitField, 'value' => $fieldValues[$fieldPair->formField]]);
                } else {
                    $fieldData[$fieldPair->convertKitField] = $fieldValues[$fieldPair->formField];
                }
            }
        }

        if (!empty($customFields)) {
            $fieldData['fieldValues'] = $customFields;
        }
        $convertKit = (object) $fieldData;

        $existSubscriber = $this->existSubscriber($convertKit->email);

        if ((count($existSubscriber->subscribers)) !== 1) {
            $recordApiResponse = $this->storeOrModifyRecord('subscribe', $formId, $convertKit);
            if (isset($tags) && (count($tags)) > 0 && $recordApiResponse) {
                $this->addTagToSubscriber($convertKit->email, $tags);
            }
            $type = 'insert';
        } else {
            if ($actions->update == 'true') {
                $this->updateRecord($existSubscriber->subscribers[0]->id, $convertKit, $existSubscriber);
                $type = 'update';
            } else {
                LogHandler::save($this->_integrationID, ['type' => 'record', 'type_name' => 'insert'], 'error', 'Email address already exists in the system');

                wp_send_json_error(
                    __(
                        $this->_errorMessage,
                        'bit-integrations'
                    ),
                    400
                );
            }
        }

        if (($recordApiResponse && isset($recordApiResponse->errors)) || isset($this->_errorMessage)) {
            LogHandler::save($this->_integrationID, ['type' => 'record', 'type_name' => $type], 'error', $recordApiResponse->errors);
        } else {
            LogHandler::save($this->_integrationID, ['type' => 'record', 'type_name' => $type], 'success', $recordApiResponse);
        }
        return $recordApiResponse;
    }
}
