<?php

/**
 * Airtable Record Api
 */

namespace BitCode\FI\Actions\Airtable;

use BitCode\FI\Core\Util\Common;
use BitCode\FI\Core\Util\HttpHelper;
use BitCode\FI\Log\LogHandler;

/**
 * Provide functionality for Record insert, upsert
 */
class RecordApiHelper
{
    private $integrationID;
    private $integrationDetails;
    private $defaultHeader;

    public function __construct($integrationDetails, $integId)
    {
        $this->integrationDetails = $integrationDetails;
        $this->integrationID      = $integId;
        $this->defaultHeader      = [
            'Authorization' => 'Bearer ' . $integrationDetails->auth_token,
            'Content-Type'  => 'application/json'
        ];
    }

    public function createRecord($finalData)
    {
        $baseId      = $this->integrationDetails->selectedBase;
        $tableId     = $this->integrationDetails->selectedTable;
        $apiEndpoint = "https://api.airtable.com/v0/{$baseId}/{$tableId}";

        $floatTypeFields = ['currency', 'number', 'percent'];
        $intTypefields   = ['duration', 'rating'];

        foreach ($finalData as $key => $value) {
            $keyTypes  = explode('{btcbi}', $key);
            $fieldId   = $keyTypes[0];
            $fieldType = $keyTypes[1];

            if (in_array($fieldType, $floatTypeFields)) {
                $fields[$fieldId] = (float) $value;
            } elseif (in_array($fieldType, $intTypefields)) {
                $fields[$fieldId] = (int) $value;
            } elseif ($fieldType === 'barcode') {
                $fields[$fieldId] = (object) ["text" => $value];
            } else {
                $fields[$fieldId] = $value;
            }
        }

        $data['records'][] = (object) [
            'fields' => (object) $fields
        ];

        return HttpHelper::post($apiEndpoint,  json_encode($data), $this->defaultHeader);
    }

    public function generateReqDataFromFieldMap($data, $fieldMap)
    {
        $dataFinal = [];
        foreach ($fieldMap as $value) {
            $triggerValue = $value->formField;
            $actionValue  = $value->airtableFormField;
            if ($triggerValue === 'custom') {
                $dataFinal[$actionValue] = Common::replaceFieldWithValue($value->customValue, $data);
            } elseif (!is_null($data[$triggerValue])) {
                $dataFinal[$actionValue] = $data[$triggerValue];
            }
        }
        return $dataFinal;
    }

    public function execute($fieldValues, $fieldMap)
    {
        $finalData   = $this->generateReqDataFromFieldMap($fieldValues, $fieldMap);
        $apiResponse = $this->createRecord($finalData);

        if (isset($apiResponse->records)) {
            $successMessage = ['message' => 'Record created successfully'];
            LogHandler::save($this->integrationID, json_encode(['type' => 'record', 'type_name' => 'Record created']), 'success', json_encode($successMessage));
        } else {
            LogHandler::save($this->integrationID, json_encode(['type' => 'record', 'type_name' => 'Creating record']), 'error', json_encode($apiResponse));
        }
        return $apiResponse;
    }
}
