<?php

/**
 * SmartSuite Record Api
 */

namespace BitCode\FI\Actions\SmartSuite;

use BitCode\FI\Core\Util\HttpHelper;
use BitCode\FI\Log\LogHandler;

class RecordApiHelper
{
    private $integrationDetails;

    private $integrationId;

    private $apiUrl;

    private $defaultHeader;

    private $type;

    private $typeName;

    public function __construct($integrationDetails, $integId, $apiKey, $apiSecret)
    {
        $this->integrationDetails = $integrationDetails;
        $this->integrationId = $integId;
        $this->apiUrl = 'https://app.smartsuite.com/api/v1/';
        $this->defaultHeader = [
            'ACCOUNT-ID'    => $apiKey,
            'Authorization' => 'Token ' . $apiSecret,
            'Content-Type'  => 'application/json'
        ];
    }

    public function addSolutions($finalData)
    {
        if (isset($this->integrationDetails->selectedTag) && $this->integrationDetails->selectedTag != '') {
            $finalData['logo_color'] = $this->integrationDetails->selectedTag;
        }

        $apiEndpoint = $this->apiUrl . 'solutions/';

        return HttpHelper::post($apiEndpoint, wp_json_encode($finalData), $this->defaultHeader);
    }

    public function addTable($finalData)
    {
        $requestParams = [];
        foreach ($finalData as $key => $value) {
            $requestParams['name'] = $value;
        }
        $requestParams['solution'] = $this->integrationDetails->selectedSolution;

        $apiEndpoint = $this->apiUrl . 'applications/';
        $extraData = [['slug' => 'name',
            'label'           => 'Name',
            'field_type'      => 'textfield']];
        $requestParams['structure'] = $extraData;

        return HttpHelper::post($apiEndpoint, wp_json_encode($requestParams), $this->defaultHeader);
    }

    public function addRecord($finalData)
    {
        $apiEndpoint = $this->apiUrl . 'applications/'
        . $this->integrationDetails->selectedTable . '/records/';

        if (isset($this->integrationDetails->assigned_to) && $this->integrationDetails->assigned_to != '') {
            $finalData['assigned_to'] = $this->integrationDetails->assigned_to;
        }
        if (isset($this->integrationDetails->status) && $this->integrationDetails->status != '') {
            $finalData['status'] = $this->integrationDetails->status;
        }
        if (isset($this->integrationDetails->priority) && $this->integrationDetails->priority != '') {
            $finalData['priority'] = $this->integrationDetails->priority;
        }
        $requestParams = [];
        foreach ($finalData as $key => $value) {
            if (empty($value)) {
                continue;
            }
            $requestParams[$key] = $value;
        }

        return HttpHelper::post($apiEndpoint, wp_json_encode($requestParams), $this->defaultHeader);
    }

    public function generateReqDataFromFieldMap($data, $fieldMap)
    {
        $dataFinal = [];
        foreach ($fieldMap as $value) {
            $triggerValue = $value->formField;
            $actionValue = $value->smartSuiteFormField;
            $dataFinal[$actionValue] = ($triggerValue === 'custom') ? $value->customValue : $data[$triggerValue];
        }

        return $dataFinal;
    }

    public function execute($fieldValues, $fieldMap, $actionName)
    {
        $finalData = $this->generateReqDataFromFieldMap($fieldValues, $fieldMap);
        $this->typeName = 'create';
        if ($actionName === 'solution') {
            $this->type = 'solution';
            $apiResponse = $this->addSolutions($finalData);
        } elseif ($actionName === 'table') {
            $this->type = 'table';
            $apiResponse = $this->addTable($finalData);
        } else {
            $this->type = 'record';
            $apiResponse = $this->addRecord($finalData);
        }
        if (isset($apiResponse->id) || isset($apiResponse->title)) {
            LogHandler::save($this->integrationId, wp_json_encode(['type' => $this->type, 'type_name' => $this->typeName]), 'success', $this->typeName . ' ' . $this->type . ' successfully');
        } else {
            LogHandler::save($this->integrationId, wp_json_encode(['type' => $this->type, 'type_name' => $this->typeName . ' ' . $this->type]), 'error', wp_json_encode($apiResponse));
        }

        return $apiResponse;
    }
}
function checkIsAValidDate($myDateString)
{
    return (bool) strtotime($myDateString);
}
