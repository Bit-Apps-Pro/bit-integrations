<?php

namespace BitCode\FI\Actions\Mautic;

use BitCode\FI\Core\Util\Common;
use BitCode\FI\Core\Util\HttpHelper;
use BitCode\FI\Log\LogHandler;


class RecordApiHelper
{
    private $_defaultHeader;
    private $_tokenDetails;
    private $_integrationID;

    public function __construct($tokenDetails, $integId, $baseUrl)
    {
        $this->_defaultHeader['Authorization'] = "Bearer {$tokenDetails->access_token}";
        $this->_defaultHeader['Content-Type'] = "application/json";
        $this->_tokenDetails = $tokenDetails;
        $this->_integrationID = $integId;
        $this->_baseUrl = $baseUrl;
    }

    public function insertRecord($data)
    {
        $data = \is_string($data) ? $data : \json_encode((object)$data);
        $insertRecordEndpoint = "$this->_baseUrl/api/contacts/new";;
        return HttpHelper::post($insertRecordEndpoint, $data, $this->_defaultHeader);
    }

    public function generateReqDataFromFieldMap($data, $fieldMap)
    {
        $dataFinal = [];

        foreach ($fieldMap as $key => $value) {
            $triggerValue = $value->formField;
            $actionValue = $value->mauticField;
            if ($triggerValue === 'custom') {
                $dataFinal[$actionValue] = Common::replaceFieldWithValue($value->customValue, $data);
            } else if (!is_null($data[$triggerValue])) {
                $dataFinal[$actionValue] = $data[$triggerValue];
            }
        }
        return $dataFinal;
    }

    public function execute($integrationDetails, $defaultConf, $fieldValues, $fieldMap, $actions)
    {
        $tags = [];
        if (property_exists($integrationDetails, "tag")) {
            $tags = $integrationDetails->tag;
        }

        $finalData = $this->generateReqDataFromFieldMap($fieldValues, $fieldMap);
        $finalData['tags'] = $tags;
        $apiResponse = $this->insertRecord($finalData);

        if (isset($apiResponse->errors)) {
            LogHandler::save($this->_integrationID, json_encode(['type' =>  'contact', 'type_name' => 'add-contact']), 'error', json_encode($apiResponse));
        } else {
            LogHandler::save($this->_integrationID, json_encode(['type' =>  'contact', 'type_name' => 'add-contact']), 'success', json_encode("Contact Added Successfully"));
        }
        return $apiResponse;
    }
}
