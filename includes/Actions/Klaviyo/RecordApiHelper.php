<?php

/**
 * Klaviyo    Record Api
 */

namespace BitCode\FI\Actions\Klaviyo;

use BitCode\FI\Log\LogHandler;
use BitCode\FI\Core\Util\Common;
use BitCode\FI\Core\Util\Helper;
use BitCode\FI\Core\Util\HttpHelper;

/**
 * Provide functionality for Record Add Member
 */
class RecordApiHelper
{
    private $_integrationID;
    private $baseUrl = 'https://a.klaviyo.com/api/';


    public function __construct($integrationDetails, $integId)
    {
        $this->_integrationDetails = $integrationDetails;
        $this->_integrationID = $integId;
    }

    public function addMember($authKey, $listId, $data)
    {
        $data = [
            "data" => (object)[
                "type" => "profile",
                "attributes" => $data
            ]
        ];

        $headers = [
            'Authorization' => "Klaviyo-API-Key {$authKey}",
            'Content-Type'  => 'application/json',
            'accept'        => 'application/json',
            'revision'      => '2024-02-15'
        ];

        $apiEndpoints   = "{$this->baseUrl}profiles";
        $apiResponse    = HttpHelper::post($apiEndpoints, json_encode($data), $headers);
        if (!isset($apiResponse->data)) {
            return $apiResponse;
        }

        $data = [
            "data" => [(object)[
                "type"  => "profile",
                "id"    => $apiResponse->data->id
            ]]
        ];

        $apiEndpoints = "{$this->baseUrl}lists/{$listId}/relationships/profiles";
        return HttpHelper::post($apiEndpoints, json_encode($data), $headers);
    }

    public function generateReqDataFromFieldMap($data, $field_map)
    {
        $dataFinal = [];
        foreach ($field_map as $key => $value) {
            $triggerValue = $value->formField;
            $actionValue = $value->klaviyoFormField;
            if ($triggerValue === 'custom') {
                $dataFinal[$actionValue] = Common::replaceFieldWithValue($value->customValue, $data);
            } elseif (!is_null($data[$triggerValue])) {
                $dataFinal[$actionValue] = $data[$triggerValue];
            }
        }
        return $dataFinal;
    }

    public function execute(
        $listId,
        $fieldValues,
        $field_map,
        $authKey
    ) {
        $finalData = $this->generateReqDataFromFieldMap($fieldValues, $field_map);
        $apiResponse = $this->addMember($authKey, $listId, (object) $finalData);
        if (isset($apiResponse->errors)) {
            $res = ['success' => false, 'message' => $apiResponse->errors[0]->detail, 'code' => 400];
            LogHandler::save($this->_integrationID, json_encode(['type' => 'members', 'type_name' => 'add-members']), 'error', json_encode($res));
        } else {
            $res = ['success' => true, 'message' => $apiResponse, 'code' => 200];
            LogHandler::save($this->_integrationID, json_encode(['type' => 'members', 'type_name' => 'add-members']), 'success', json_encode($res));
        }
        return $apiResponse;
    }
}
