<?php

/**
 * ZohoRecruit Record Api
 */

namespace BitCode\FI\Actions\SendinBlue;

use BitCode\FI\Core\Util\HttpHelper;
use BitCode\FI\Log\LogHandler;

/**
 * Provide functionality for Record insert,upsert
 */
class RecordApiHelper
{
    private $_defaultHeader;
    private $_integrationID;
    private $_apiEndPoint = 'https://api.sendinblue.com/v3/contacts';

    public function __construct($api_key, $integId)
    {
        $this->_defaultHeader["Content-Type"] = 'application/json';
        $this->_defaultHeader["api-key"] = $api_key;
        $this->_integrationID = $integId;
    }

    /**
     Email template must be activate as double optin, button link = {{ params.DOIur }}
     */

    public function insertRecordDoubleOpt($data, $integrationDetails)
    {
        $templateId = $integrationDetails->templateId;
        $redirectionUrl = $integrationDetails->redirectionUrl;
        $data['templateId'] = (int)$templateId;
        $data['redirectionUrl'] = $redirectionUrl;
        if ($data['listIds']) {
            $data['includeListIds'] = $data['listIds'];
            unset($data['listIds']);
        }

        $data = wp_json_encode($data);
        $insertRecordEndpoint = "{$this->_apiEndPoint}/doubleOptinConfirmation";
        $response = HttpHelper::post($insertRecordEndpoint, $data, $this->_defaultHeader);
        return $response;
    }

    public function insertRecord($data)
    {
        $insertRecordEndpoint = "{$this->_apiEndPoint}";
        return HttpHelper::post($insertRecordEndpoint, $data, $this->_defaultHeader);
    }

    public function updateRecord($id, $data)
    {
        $updateRecordEndpoint = "{$this->_apiEndPoint}/{$id}";
        return HttpHelper::request($updateRecordEndpoint, 'PUT', $data, $this->_defaultHeader);
    }

    public function execute($lists, $defaultDataConf, $fieldValues, $fieldMap, $actions, $integrationDetails)
    {
        $fieldData = [];
        $attributes = [];

        foreach ($fieldMap as $fieldKey => $fieldPair) {
            if (!empty($fieldPair->sendinBlueField)) {
                if ($fieldPair->sendinBlueField === 'email') {
                    $fieldData['email'] = $fieldValues[$fieldPair->formField];
                } elseif ($fieldPair->formField === 'custom' && isset($fieldPair->customValue)) {
                    $attributes[$fieldPair->sendinBlueField] = $fieldPair->customValue;
                } else {
                    $attributes[$fieldPair->sendinBlueField] = $fieldValues[$fieldPair->formField];
                }
            }
        }

        $fieldData['attributes'] = (object) $attributes;

        foreach ($lists as $index => $value) {
            //code to be executed; 
            $lists[$index] = (int)$value;
        }
        $fieldData['listIds'] = $lists;

        if (property_exists($actions, 'double_optin') && $actions->double_optin) {
            $recordApiResponse = $this->insertRecordDoubleOpt(($fieldData),  $integrationDetails);
        } else {
            $recordApiResponse = $this->insertRecord(wp_json_encode($fieldData));
        }


        $type = 'insert';

        if (!empty($actions->update) && !empty($recordApiResponse->message) && $recordApiResponse->message === 'Contact already exist') {
            $contactEmail = $fieldData['email'];
            $recordApiResponse = $this->updateRecord($contactEmail, wp_json_encode($fieldData));
            if (empty($recordApiResponse)) {
                $recordApiResponse = ['success' => true, 'id' => $fieldData['email']];
            }
            $type = 'update';
        }

        if ($recordApiResponse && isset($recordApiResponse->code)) {
            LogHandler::save($this->_integrationID, ['type' =>  'record', 'type_name' => $type], 'error', $recordApiResponse);
        } else {
            LogHandler::save($this->_integrationID, ['type' =>  'record', 'type_name' => $type], 'success', $recordApiResponse);
        }
        return $recordApiResponse;
    }
}
