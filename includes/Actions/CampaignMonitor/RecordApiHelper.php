<?php

namespace BitCode\FI\Actions\CampaignMonitor;

use BitCode\FI\Core\Util\HttpHelper;
use BitCode\FI\Log\LogHandler;

class RecordApiHelper
{
    private $_integrationID;
    private $_integrationDetails;
    private $_defaultHeader;
    private $baseUrl;

    public function __construct($integrationDetails, $integId, $apiKey)
    {
        $this->_integrationDetails = $integrationDetails;
        $this->_integrationID      = $integId;
        $this->baseUrl             = "https://api.createsend.com/api/v3.3";
        $this->_defaultHeader      = [
            'Authorization' => 'Basic ' . base64_encode("{$apiKey}:"),
            'Content-Type'  => 'application/json'
        ];
    }

    private function setSubscriberData($finalData)
    {
        $customParams  = [];
        $requestPerams = ["ConsentToTrack" => "Yes"];

        foreach ($finalData as $key => $value) {

            if (stripos($key, '[') > -1) {
                array_push(
                    $customParams,
                    (object)[
                        'Key'   => $key,
                        'Value' => $value
                    ]
                );
            } else {
                $requestPerams[$key] = $value;
            }
        }

        $requestPerams["CustomFields"] = $customParams;
        return json_encode($requestPerams);
    }

    public function updateSubscriber($email, $finalData, $selectedList)
    {
        $apiEndpoints = $this->baseUrl . "/subscribers/{$selectedList}.json?email={$email}";
        return  HttpHelper::request($apiEndpoints, 'PUT', $this->setSubscriberData($finalData), $this->_defaultHeader);
    }

    public function addSubscriber($selectedList, $finalData)
    {
        $apiEndpoints = $this->baseUrl . "/subscribers/{$selectedList}.json";
        return HttpHelper::post($apiEndpoints, $this->setSubscriberData($finalData), $this->_defaultHeader);
    }

    public function generateReqDataFromFieldMap($data, $fieldMap)
    {
        $dataFinal = [];
        foreach ($fieldMap as $value) {
            $triggerValue = $value->formField;
            $actionValue  = $value->campaignMonitorField;
            $dataFinal[$actionValue] = ($triggerValue === 'custom') ? $value->customValue : $data[$triggerValue];
        }
        return $dataFinal;
    }

    private function existSubscriber($selectedList, $email)
    {
        $apiEndpoints = $this->baseUrl . "/subscribers/{$selectedList}.json?email={$email}&includetrackingpreference=true";
        return HttpHelper::get($apiEndpoints, null, $this->_defaultHeader);
    }

    public function execute($selectedList, $fieldValues, $fieldMap, $actions)
    {
        $finalData   = (object) $this->generateReqDataFromFieldMap($fieldValues, $fieldMap);
        $existSubscriber = $this->existSubscriber($selectedList, $finalData->EmailAddress);

        if (!isset($existSubscriber->EmailAddress)) {
            $apiResponse = $this->addSubscriber($selectedList, $finalData);

            if (filter_var($apiResponse, FILTER_VALIDATE_EMAIL)) {
                $res = ['message' => 'Subscriber added successfully'];
                LogHandler::save($this->_integrationID, json_encode(['type' => 'Subscriber', 'type_name' => 'Subscriber added']), 'success', json_encode($res));
            } else {
                LogHandler::save($this->_integrationID, json_encode(['type' => 'Subscriber', 'type_name' => 'Adding Subscriber']), 'error', json_encode($apiResponse));
            }
        } else {
            if ($actions->update) {
                $apiResponse = $this->updateSubscriber($existSubscriber->EmailAddress, $finalData, $selectedList);

                if (empty($apiResponse)) {
                    $res = ['message' => 'Subscriber updated successfully'];
                    LogHandler::save($this->_integrationID, json_encode(['type' => 'Subscriber', 'type_name' => 'Subscriber updated']), 'success', json_encode($res));
                } else {
                    LogHandler::save($this->_integrationID, json_encode(['type' => 'Subscriber', 'type_name' => 'updating Subscriber']), 'error', json_encode($apiResponse));
                }
            } else {
                LogHandler::save($this->_integrationID, ['type' => 'Subscriber', 'type_name' => 'Adding Subscriber'], 'error', 'Email address already exists in the system');
                wp_send_json_error('Email address already exists in the system', 400);
            }
        }

        return $apiResponse;
    }
}
