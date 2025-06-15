<?php

/**
 * DirectIQ Record Api
 */

namespace BitCode\FI\Actions\DirectIq;

use BitCode\FI\Core\Util\HttpHelper;
use BitCode\FI\Log\LogHandler;

/**
 * Provide functionality for Record insert,update, exist
 */
class RecordApiHelper
{
    private $_defaultHeader;
    private $_integrationID;


    public function __construct($client_id, $client_secret, $integId)
    {
        $this->_defaultHeader = 'Basic ' . base64_encode("$client_id:$client_secret");
        $this->_integrationID = $integId;
    }

    // for adding a contact to a list.
    public function storeOrModifyRecord($method, $listId, $data)
    {
        $finalData = "{\"contacts\":[{\"email\":\"{$data->email}\",\"fistName\":\"{$data->first_name}\",\"lastName\":\"{$data->last_name}\"}]}";
        $curl = curl_init();

        curl_setopt_array($curl, [
        CURLOPT_URL => "https://rest.directiq.com/contacts/lists/importcontacts/{$listId}",
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_ENCODING => "",
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 30,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_CUSTOMREQUEST => "POST",
        CURLOPT_POSTFIELDS => $finalData,
        CURLOPT_HTTPHEADER => [
            "accept: application/json",
            "authorization: {$this->_defaultHeader}",
            "content-type: application/*+json"
        ],
        ]);

        $response = curl_exec($curl);
        $statusCode = curl_getinfo($curl, CURLINFO_HTTP_CODE);
        $err = curl_error($curl);

        curl_close($curl);
        return $statusCode;
    }

    public function generateReqDataFromFieldMap($data, $fieldMap)
    {
        $dataFinal = [];

        foreach ($fieldMap as $key => $value) {
            $triggerValue = $value->formField;
            $actionValue = $value->directIqField;
            if ($triggerValue === 'custom') {
                $dataFinal[$actionValue] = $value->customValue;
            } elseif (!is_null($data[$triggerValue])) {
                $dataFinal[$actionValue] = $data[$triggerValue];
            }
        }
        return $dataFinal;
    }

    public function execute($fieldValues, $fieldMap, $actions, $listId)
    {
        $fieldData = [];
        $customFields = [];

        $finalData = $this->generateReqDataFromFieldMap($fieldValues, $fieldMap);

        $directIq = (object) $finalData;

        $recordApiResponse = $this->storeOrModifyRecord('contact', $listId, $directIq);

        $type = 'insert';

        if ($recordApiResponse !== 200) {
            LogHandler::save($this->_integrationID, ['type' => 'record', 'type_name' => $type], 'error', "There is an error while inserting record");
        } else {
            LogHandler::save($this->_integrationID, ['type' => 'record', 'type_name' => $type], 'success', "Record inserted successfully");
        }

        return $recordApiResponse;
    }
}
