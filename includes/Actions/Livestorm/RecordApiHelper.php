<?php

/**
 * Livestorm Record Api
 */

namespace BitCode\FI\Actions\Livestorm;

use BitCode\FI\Core\Util\HttpHelper;
use BitCode\FI\Log\LogHandler;

/**
 * Provide functionality for Record insert, upsert
 */
class RecordApiHelper
{
    private $integrationDetails;
    private $integrationId;
    private $apiUrl;
    private $defaultHeader;
    private $type;
    private $typeName;

    public function __construct($integrationDetails, $integId, $apiKey)
    {
        $this->integrationDetails = $integrationDetails;
        $this->integrationId      = $integId;
        $this->apiUrl             = "https://api.livestorm.co/v1";
        $this->defaultHeader      = [
            "Authorization" => $apiKey,
            "Accept"        => "application/json",
            "Content-Type"  => 'application/json'
        ];
    }

    public function registration($finalData)
    {
        $this->type     = 'Add People to Event Session';
        $this->typeName = 'Add People to Event Session';

        if (!isset($this->integrationDetails->selectedEvent) || empty($this->integrationDetails->selectedEvent)) {
            return ['success' => false, 'message' => 'Required field Event is empty', 'code' => 400];
        }
        if (!isset($this->integrationDetails->selectedSession) || empty($this->integrationDetails->selectedSession)) {
            return ['success' => false, 'message' => 'Required field Session is empty', 'code' => 400];
        }

        $apiEndpoint = $this->apiUrl . "/sessions/{$this->integrationDetails->selectedSession}/people";
        return HttpHelper::post($apiEndpoint, json_encode($finalData), $this->defaultHeader);
    }

    public function generateReqDataFromFieldMap($data, $fieldMap)
    {
        $fieldData = [];
        foreach ($fieldMap as $value) {
            $triggerValue = $value->formField;
            $actionValue  = $value->livestormFormField;

            array_push(
                $fieldData,
                (object) [
                    'id'    => $actionValue,
                    'value' => $triggerValue === 'custom' ? $value->customValue : $data[$triggerValue]
                ]
            );
        }

        $dataFinal = [
            "data" => [
                "type" => "people",
                "attributes" => [
                    "fields" => $fieldData
                ]
            ]
        ];
        return $dataFinal;
    }

    public function execute($fieldValues, $fieldMap)
    {
        $finalData   = $this->generateReqDataFromFieldMap($fieldValues, $fieldMap);
        $apiResponse = $this->registration($finalData);

        if (isset($apiResponse->data)) {
            $res = [$this->typeName . '  successfully'];
            LogHandler::save($this->integrationId, json_encode(['type' => $this->type, 'type_name' => $this->typeName]), 'success', json_encode($res));
        } else {
            LogHandler::save($this->integrationId, json_encode(['type' => $this->type, 'type_name' => $this->type . ' creating']), 'error', json_encode($apiResponse));
        }
        return $apiResponse;
    }
}
