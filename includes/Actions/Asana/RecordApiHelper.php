<?php

/**
 * Asana Record Api
 */

namespace BitCode\FI\Actions\Asana;

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

    public function __construct($integrationDetails, $integId)
    {
        $this->integrationDetails = $integrationDetails;
        $this->integrationId      = $integId;
        $this->apiUrl             = "https://app.asana.com/api/1.0/";
        $this->defaultHeader      = [
            "Authorization" => 'Bearer ' . $integrationDetails->api_key,
            'content-type' => 'application/json'
        ];
    }

    public function addTask($finalData)
    {
        if (!isset($finalData['name'])) {
            return ['success' => false, 'message' => 'Required field task name is empty', 'code' => 400];
        }
        $staticFieldsKeys = ['name', 'due_at', "due_on", 'notes'];
        $customFields = [];
        foreach ($finalData as $key => $value) {
            if (in_array($key, $staticFieldsKeys)) {
                $requestParams[$key] = $value;
            } else {
                $customFields[$key] = $value;
            }
        }

        if (!empty($this->integrationDetails->selectedProject)) {
            $requestParams['projects'][] = ($this->integrationDetails->selectedProject);
        }
        if (count($customFields)) {
            $requestParams['custom_fields'] = $customFields;
        }

        $this->type     = 'Task';
        $this->typeName = 'Task created';

        $apiEndpoint = $this->apiUrl . "tasks";

        $response = HttpHelper::post($apiEndpoint, json_encode(['data' => $requestParams]), $this->defaultHeader);
        if (!isset($this->integrationDetails->selectedSections)) {
            return $response;
        } else {
            if (isset($response->data)) {
                return $this->addTaskToSection($response->data->gid, $this->integrationDetails->selectedSections);
            }
        }
    }

    public function addTaskToSection($taskId, $sectionId)
    {
        $apiEndpoint = $this->apiUrl . "sections/" . $sectionId . "/addTask";
        $requestParams['task'] = $taskId;
        $response = HttpHelper::post($apiEndpoint, json_encode(['data' => $requestParams]), $this->defaultHeader);
        return $response;
    }
    public function generateReqDataFromFieldMap($data, $fieldMap)
    {
        $dataFinal = [];
        foreach ($fieldMap as $value) {
            $triggerValue = $value->formField;
            $actionValue  = $value->asanaFormField;
            if ($triggerValue === 'custom') {
                if ($actionValue === 'fields') {
                    $dataFinal[$value->customFieldKey] = $value->customValue;
                } else {
                    $dataFinal[$actionValue] = $value->customValue;
                }
            } elseif (!is_null($data[$triggerValue])) {
                if ($actionValue === 'fields') {
                    $dataFinal[$value->customFieldKey] = $data[$triggerValue];
                } else {
                    $dataFinal[$actionValue] = $data[$triggerValue];
                }
            }
        }
        return $dataFinal;
    }

    public function execute($fieldValues, $fieldMap, $actionName)
    {
        $finalData   = $this->generateReqDataFromFieldMap($fieldValues, $fieldMap);
        if ($actionName === 'task') {
            $apiResponse = $this->addTask($finalData);
        }

        if ($apiResponse->data || $apiResponse->status === 'success') {
            $res = [$this->typeName . ' successfully'];
            LogHandler::save($this->integrationId, json_encode(['type' => $this->type, 'type_name' => $this->typeName]), 'success', json_encode($res));
        } else {
            LogHandler::save($this->integrationId, json_encode(['type' => $this->type, 'type_name' => $this->type . ' creating']), 'error', json_encode($apiResponse));
        }
        return $apiResponse;
    }
}
