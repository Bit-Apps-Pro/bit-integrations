<?php

/**
 * SendFox Record Api
 */

namespace BitCode\FI\Actions\SendFox;

use BitCode\FI\Core\Util\Common;
use BitCode\FI\Core\Util\HttpHelper;
use BitCode\FI\Log\LogHandler;

/**
 * Provide functionality for Record insert, upsert
 */
class RecordApiHelper
{
    private $_integrationID;

    public function __construct($integrationDetails, $integId)
    {
        $this->_integrationDetails = $integrationDetails;
        $this->_integrationID = $integId;
    }

    public function addContact($access_token, $listId, $finalData)
    {
        $apiEndpoints = 'https://api.sendfox.com/contacts';
        $listId = explode(',', $listId);
        $header = [
            'Authorization' => "Bearer {$access_token}",
            'Accept'        => 'application/json',
        ];

        $data = [
            'email'      => $finalData['email'],
            'first_name' => $finalData['first_name'],
            'last_name'  => $finalData['last_name'],
            'lists'      => $listId,
        ];

        return HttpHelper::post($apiEndpoints, $data, $header);
    }

    public function createContactList($access_token, $finalData)
    {
        $apiEndpoints = 'https://api.sendfox.com/lists';

        $header = [
            'Authorization' => "Bearer {$access_token}",
            'Accept'        => 'application/json',
        ];

        $data = [
            'name' => $finalData['name'],
        ];

        return HttpHelper::post($apiEndpoints, $data, $header);
    }

    public function generateReqDataFromFieldMap($data, $fieldMap)
    {
        $dataFinal = [];

        foreach ($fieldMap as $key => $value) {
            $triggerValue = $value->formField;
            $actionValue = $value->sendFoxFormField;
            if ($triggerValue === 'custom') {
                $dataFinal[$actionValue] = Common::replaceFieldWithValue($value->customValue, $data);
            } elseif (!\is_null($data[$triggerValue])) {
                $dataFinal[$actionValue] = $data[$triggerValue];
            }
        }

        return $dataFinal;
    }

    public function generateListReqDataFromFieldMap($data, $fieldMap)
    {
        $dataFinal = [];

        foreach ($fieldMap as $key => $value) {
            $triggerValue = $value->formField;
            $actionValue = $value->sendFoxListFormField;
            if ($triggerValue === 'custom') {
                $dataFinal[$actionValue] = Common::replaceFieldWithValue($value->customValue, $data);
            } elseif (!\is_null($data[$triggerValue])) {
                $dataFinal[$actionValue] = $data[$triggerValue];
            }
        }

        return $dataFinal;
    }

    public function generateReqUnsubscribeDataFromFieldMap($data, $fieldMap)
    {
        $dataFinal = [];

        foreach ($fieldMap as $key => $value) {
            $triggerValue = $value->formField;
            $actionValue = $value->sendFoxUnsubscribeFormField;
            if ($triggerValue === 'custom') {
                $dataFinal[$actionValue] = Common::replaceFieldWithValue($value->customValue, $data);
            } elseif (!\is_null($data[$triggerValue])) {
                $dataFinal[$actionValue] = $data[$triggerValue];
            }
        }

        return $dataFinal;
    }

    public function unsubscribeContact($access_token, $finalData)
    {
        $apiEndpoints = 'https://api.sendfox.com/unsubscribe';

        $header = [
            'Authorization' => "Bearer {$access_token}",
            'Accept'        => 'application/json',
        ];

        $data = [
            'email' => $finalData['email'],
        ];

        return HttpHelper::request($apiEndpoints, 'PATCH', $data, $header);
    }

    public function execute(
        $listId,
        $fieldValues,
        $fieldMap,
        $access_token,
        $integrationDetails
    ) {
        $fieldData = [];
        if ($integrationDetails->mainAction === '1') {
            $type_name = 'Create List';
            $finalData = $this->generateListReqDataFromFieldMap($fieldValues, $integrationDetails->field_map_list);
            $apiResponseList = $this->createContactList($access_token, $finalData);

            if (property_exists($apiResponseList, 'id')) {
                LogHandler::save($this->_integrationID, wp_json_encode(['type' => 'record', 'type_name' => $type_name]), 'success', wp_json_encode($apiResponseList));
            } else {
                LogHandler::save($this->_integrationID, wp_json_encode(['type' => 'record', 'type_name' => $type_name]), 'error', wp_json_encode($apiResponseList));
            }
        }
        if ($integrationDetails->mainAction === '2') {
            $type_name = 'Create Contact';
            $finalData = $this->generateReqDataFromFieldMap($fieldValues, $fieldMap);
            $apiResponse = $this->addContact($access_token, $listId, $finalData);
            if (property_exists($apiResponse, 'errors')) {
                LogHandler::save($this->_integrationID, wp_json_encode(['type' => 'contact', 'type_name' => $type_name]), 'error', wp_json_encode($apiResponse));
            } else {
                LogHandler::save($this->_integrationID, wp_json_encode(['type' => 'record', 'type_name' => $type_name]), 'success', wp_json_encode($apiResponse));
            }
        }

        if ($integrationDetails->mainAction === '3') {
            $type_name = 'Unsubscribe';
            $finalData = $this->generateReqUnsubscribeDataFromFieldMap($fieldValues, $integrationDetails->field_map_unsubscribe);
            $apiResponse = $this->unsubscribeContact($access_token, $finalData);
            if (property_exists($apiResponse, 'id')) {
                LogHandler::save($this->_integrationID, wp_json_encode(['type' => 'contact', 'type_name' => $type_name]), 'success', wp_json_encode($apiResponse));
            } else {
                LogHandler::save($this->_integrationID, wp_json_encode(['type' => 'record', 'type_name' => $type_name]), 'error', wp_json_encode($apiResponse));
            }
        }

        return $apiResponse;
    }
}
