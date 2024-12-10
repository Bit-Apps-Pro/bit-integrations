<?php

/**
 * SmartSuite Record Api
 */

namespace BitCode\FI\Actions\SmartSuite;

use BitCode\FI\Core\Util\HttpHelper;
use BitCode\FI\Log\LogHandler;

/**
 * Provide functionality for Record insert, upsert
 */
class RecordApiHelper
{
    private $integrationDetails;

    private $integrationId;

    private $tokenDetails;

    private $apiUrl;

    private $defaultHeader;

    private $type;

    private $typeName;

    public function __construct($integrationDetails, $integId, $tokenDetails, $apiKey, $apiSecret)
    {
        $this->integrationDetails = $integrationDetails;
        $this->integrationId = $integId;
        $this->tokenDetails = $tokenDetails;
        $this->apiUrl = 'https://app.smartsuite.com/api/v1/';
        $this->defaultHeader = [
            'ACCOUNT-ID'    => $apiKey,
            'Authorization' => 'Token ' . $apiSecret,
            'Content-Type'  => 'application/json'
        ];
    }

    public function addSolutions($finalData)
    {
        $requestParams = [];
        foreach ($finalData as $key => $value) {
            $requestParams['name'] = $value;
        }
        $requestParams['logo_icon'] = 'overline';
        $requestParams['logo_color'] = '#3A86FF';

        $apiEndpoint = $this->apiUrl . 'solutions/';

        return HttpHelper::post($apiEndpoint, wp_json_encode($requestParams), $this->defaultHeader);
    }

    public function addTable($finalData)
    {
        $requestParams = [];
        foreach ($finalData as $key => $value) {
            $requestParams['name'] = $value;
        }
        $requestParams['solution'] = $this->integrationDetails->selectedEvent;

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
        . $this->integrationDetails->selectedSession . '/records/';

        $currentDate = date('Y-m-d');
        $addTenDays = date('Y-m-d', strtotime($currentDate . ' + 10 days'));

        if (isset($finalData['due_date']) && !checkIsAValidDate($finalData['due_date'])) {
            $finalData['due_date'] = $currentDate;
        }
        if (isset($finalData['to_date']) && !checkIsAValidDate($finalData['to_date'])) {
            $finalData['to_date'] = $addTenDays;
        }
        $finalData['status'] = 'in_progress';

        return HttpHelper::post($apiEndpoint, wp_json_encode($finalData), $this->defaultHeader);
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

        if ($actionName === 'solution') {
            $apiResponse = $this->addSolutions($finalData);
        } elseif ($actionName === 'table') {
            $apiResponse = $this->addTable($finalData);
        } else {
            $apiResponse = $this->addRecord($finalData);
        }

        if (isset($apiResponse->id)) {
            $res = [$this->typeName . ' successfully'];
            LogHandler::save($this->integrationId, wp_json_encode(['type' => $this->type, 'type_name' => $this->typeName]), 'success', wp_json_encode($res));
        } else {
            LogHandler::save($this->integrationId, wp_json_encode(['type' => $this->type, 'type_name' => $this->type . ' creating']), 'error', wp_json_encode($apiResponse));
        }

        return $apiResponse;
    }
}
function checkIsAValidDate($myDateString)
{
    return (bool) strtotime($myDateString);
}
