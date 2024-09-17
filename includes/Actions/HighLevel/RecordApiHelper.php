<?php

/**
 * HighLevel Record Api
 */

namespace BitCode\FI\Actions\HighLevel;

use BitCode\FI\Core\Util\Common;
use BitCode\FI\Core\Util\Helper;
use BitCode\FI\Core\Util\HttpHelper;
use BitCode\FI\Log\LogHandler;

/**
 * Provide functionality for Record insert,update, exist
 */
class RecordApiHelper
{
    private $defaultHeader;

    private $integrationID;

    private $baseUrl = 'https://rest.gohighlevel.com/v1/';

    public function __construct($apiKey, $integId)
    {
        $this->defaultHeader = [
            'Authorization' => 'Bearer ' . $apiKey,
            'Content-Type'  => 'application/json'
        ];

        $this->integrationID = $integId;
    }

    public function createContact($finalData, $selectedOptions, $actions)
    {
        if (empty($finalData['email'])) {
            return ['success' => false, 'message' => 'Request parameter(s) empty!', 'code' => 400];
        }

        $staticFieldsKey = ['email', 'firstName', 'lastName', 'name', 'phone', 'dateOfBirth', 'address1', 'city', 'state', 'country', 'postalCode', 'companyName', 'website'];
        $apiRequestData = $customFieldsData = [];

        foreach ($finalData as $key => $value) {
            if (\in_array($key, $staticFieldsKey)) {
                $apiRequestData[$key] = $value;
            } else {
                $keyFieldType = explode('_bihl_', $key);
                $fieldKey = $keyFieldType[0];
                $fieldType = $keyFieldType[1];

                if ($fieldType === 'MULTIPLE_OPTIONS' || $fieldType === 'CHECKBOX') {
                    $customFieldsData[$fieldKey] = explode(',', str_replace(' ', '', $value));
                } else {
                    $customFieldsData[$fieldKey] = $value;
                }
            }
        }

        if (!empty($customFieldsData)) {
            $apiRequestData['customField'] = $customFieldsData;
        }

        if ((isset($selectedOptions['selectedTags']) && !empty($selectedOptions['selectedTags'])) || !empty($actions)) {
            if (Helper::proActionFeatExists('HighLevel', 'contactUtilities')) {
                $filterResponse = apply_filters('btcbi_high_level_contact_utilities', 'createContact', $selectedOptions, $actions);

                if ($filterResponse !== 'createContact' && !empty($filterResponse)) {
                    $apiRequestData = array_merge($apiRequestData, $filterResponse);
                }
            }
        }

        $apiEndpoint = $this->baseUrl . 'contacts';

        $response = HttpHelper::post($apiEndpoint, wp_json_encode($apiRequestData), $this->defaultHeader);

        if (isset($response->contact)) {
            return ['success' => true, 'message' => 'Contact created successfully.'];
        }

        return ['success' => false, 'message' => 'Failed to create contact!', 'code' => 400];
    }

    public function generateReqDataFromFieldMap($data, $fieldMap)
    {
        $dataFinal = [];
        foreach ($fieldMap as $value) {
            $triggerValue = $value->formField;
            $actionValue = $value->highLevelField;
            if ($triggerValue === 'custom') {
                $dataFinal[$actionValue] = Common::replaceFieldWithValue($value->customValue, $data);
            } elseif (!\is_null($data[$triggerValue])) {
                $dataFinal[$actionValue] = $data[$triggerValue];
            }
        }

        return $dataFinal;
    }

    public function execute($fieldValues, $fieldMap, $selectedTask, $selectedOptions, $actions)
    {
        $finalData = $this->generateReqDataFromFieldMap($fieldValues, $fieldMap);
        $type = $typeName = '';

        if ($selectedTask === 'createContact') {
            $response = $this->createContact($finalData, $selectedOptions, $actions);
            $type = 'Contact';
            $typeName = 'Create Contact';
        }

        if ($response['success']) {
            $res = ['message' => $response['message']];
            LogHandler::save($this->integrationID, wp_json_encode(['type' => $type, 'type_name' => $typeName]), 'success', wp_json_encode($res));
        } else {
            LogHandler::save($this->integrationID, wp_json_encode(['type' => $type, 'type_name' => $typeName]), 'error', wp_json_encode($response));
        }

        return $response;
    }
}
