<?php

/**
 * MailBluster Record Api
 */

namespace BitCode\FI\Actions\MailBluster;

use BitCode\FI\Core\Util\Common;
use BitCode\FI\Core\Util\HttpHelper;
use BitCode\FI\Log\LogHandler;

/**
 * Provide functionality for Record insert, upsert
 */
class RecordApiHelper
{
    private $_integrationID;
    private $baseUrl = 'https://api.mailbluster.com/api/';

    public function __construct($integrationDetails, $integId)
    {
        $this->_integrationDetails = $integrationDetails;
        $this->_integrationID      = $integId;
        $this->_defaultHeader      = [
            'Authorization' => $this->_integrationDetails->auth_token
        ];
    }

    public function addLeadToBrand($selectedTags, $finalData, $subscribed)
    {
        $apiEndpoints = $this->baseUrl . 'leads';
        $tags         = [];

        if (!empty($selectedTags)) {
            $splitSelectedTags = explode(',', $selectedTags);
            foreach ($splitSelectedTags as $tag) {
                $tags[] = $tag;
            }
        }

        if (empty($finalData['email'])) {
            return ['success' => false, 'message' => 'Required field Email is empty', 'code' => 400];
        }

        $requestParams = [
            'subscribed' => $subscribed === 'true' ? true : false
        ];

        if (!empty($this->_integrationDetails->actions->update)) $requestParams['overrideExisting'] = true;
        if (!empty($this->_integrationDetails->actions->doubleOptIn)) $requestParams['doubleOptIn'] = true;

        $staticFieldsKeys = ['email', 'firstName', 'lastName', 'timezone', 'ipAddress'];
        $customFields     = [];

        foreach ($finalData as $key => $value) {
            if (in_array($key, $staticFieldsKeys)) {
                $requestParams[$key] = $value;
            } else {
                $customFields[$key] = $value;
            }
        }

        if (!empty($customFields)) {
            $requestParams['fields'] = (object)$customFields;
        }

        if (!empty($tags)) {
            $requestParams['tags'] = $tags;
        }

        $response = HttpHelper::post($apiEndpoints, $requestParams, $this->_defaultHeader);
        return $response;
    }

    public function generateReqDataFromFieldMap($data, $fieldMap)
    {
        $dataFinal = [];
        foreach ($fieldMap as $value) {
            $triggerValue = $value->formField;
            $actionValue  = $value->mailBlusterFormField;
            if ($triggerValue === 'custom') {
                $dataFinal[$actionValue] = Common::replaceFieldWithValue($value->customValue, $data);
            } elseif (!is_null($data[$triggerValue])) {
                $dataFinal[$actionValue] = $data[$triggerValue];
            }
        }
        return $dataFinal;
    }

    public function execute($selectedTag, $fieldValues, $fieldMap, $subscribed)
    {
        $finalData   = $this->generateReqDataFromFieldMap($fieldValues, $fieldMap);
        $apiResponse = $this->addLeadToBrand($selectedTag,  $finalData, $subscribed);

        if ($apiResponse->lead->id) {
            $res = ['message' => $apiResponse->message.' successfully'];
            LogHandler::save($this->_integrationID, json_encode(['type' => 'lead', 'type_name' => $apiResponse->message]), 'success', json_encode($res));
        } else {
            LogHandler::save($this->_integrationID, json_encode(['type' => 'lead', 'type_name' => 'Update lead']), 'error', json_encode($apiResponse));
        }
        return $apiResponse;
    }
}
