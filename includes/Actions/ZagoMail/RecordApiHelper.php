<?php

/**
 * ZagoMail Record Api
 */

namespace BitCode\FI\Actions\ZagoMail;

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
    private $_apiPublicKey;


    public function __construct($api_public_key, $integId)
    {
        $this->_apiPublicKey = $api_public_key;
        $this->_defaultHeader["Content-Type"] = "application/json";
        $this->_apiEndpoint = 'https://api.zagomail.com/';
        $this->_integrationID = $integId;
    }

    // for adding a subscriber
    public function storeOrModifyRecord($listId, $data)
    {
        $requestParams['publicKey']    =  $this->_apiPublicKey;

        foreach ($data as $key => $value) {
            $requestParams[$key] = $value;
        }

        $insertRecordEndpoint = "{$this->_apiEndpoint}lists/subscriber-create?list_uid={$listId}";

        $res = HttpHelper::post($insertRecordEndpoint, json_encode($requestParams), $this->_defaultHeader);

        return $res;
    }

    //for updating subscribers data through email id.
    public function updateRecord($subscriberId, $listId, $data)
    {
        $requestParams['publicKey']    =  $this->_apiPublicKey;

        foreach ($data as $key => $value) {
            $requestParams[$key] = $value;
        }

        $insertRecordEndpoint = "{$this->_apiEndpoint}lists/subscriber-update?list_uid={$listId}&subscriber_uid={$subscriberId}";

        $res = HttpHelper::post($insertRecordEndpoint, json_encode($requestParams), $this->_defaultHeader);

        return $res;
    }

    //add tag to a subscriber
    public function addTagToSubscriber($subscriberId, $listId, $tags)
    {
        $requestParams['publicKey']    =  $this->_apiPublicKey;

        foreach ($tags as $tagId) {
            $tagEndPoint = "{$this->_apiEndpoint}lists/add-tag?ztag_id={$tagId}&subscriber_uid={$subscriberId}&list_uid={$listId}";

            $res = HttpHelper::post($tagEndPoint, json_encode($requestParams), $this->_defaultHeader);
        }
    }

    //Check if a subscriber exists through email.
    private function existSubscriber($email, $listId)
    {

        $body = [
            'publicKey' => $this->_apiPublicKey,
            'email' => $email,
        ];

        $searchEndPoint = "{$this->_apiEndpoint}lists/search-by-email?list_uid={$listId}";

        return $res = HttpHelper::post($searchEndPoint, json_encode($body), $this->_defaultHeader);
    }

    public function generateReqDataFromFieldMap($data, $fieldMap)
    {
        $dataFinal = [];

        foreach ($fieldMap as $key => $value) {
            $triggerValue = $value->formField;
            $actionValue = $value->zagoMailField;
            if ($triggerValue === 'custom') {
                $dataFinal[$actionValue] = $value->customValue;
            } elseif (!is_null($data[$triggerValue])) {
                $dataFinal[$actionValue] = $data[$triggerValue];
            }
        }
        return $dataFinal;
    }


    public function execute($fieldValues, $fieldMap, $actions, $listId, $tags)
    {
        $finalData = $this->generateReqDataFromFieldMap($fieldValues, $fieldMap);

        $zagoMail = (object) $finalData;

        $existSubscriber = $this->existSubscriber($zagoMail->EMAIL, $listId);

        if ($existSubscriber->status !== 'error' && $actions->update) {
            if ($actions->update == 'true') {
                $recordApiResponse = $this->updateRecord($existSubscriber->data->subscriber_uid, $listId, $zagoMail);
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
        } else {
            $recordApiResponse = $this->storeOrModifyRecord($listId, $zagoMail);
            if (isset($tags) && (count($tags)) > 0 && $recordApiResponse->status !== 'error') {
                $this->addTagToSubscriber($recordApiResponse->data->record->subscriber_uid, $listId, $tags);
            }
            $type = 'insert';

        }
        if ($recordApiResponse->status !== 'success') {
            LogHandler::save($this->_integrationID, ['type' => 'record', 'type_name' => $type], 'error', $recordApiResponse->errors);
        } else {
            LogHandler::save($this->_integrationID, ['type' => 'record', 'type_name' => $type], 'success', $recordApiResponse);
        }
        return $recordApiResponse;
    }
}
