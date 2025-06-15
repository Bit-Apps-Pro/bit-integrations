<?php

namespace BitCode\FI\Actions\SendPulse;

use BitCode\FI\Core\Util\HttpHelper;
use BitCode\FI\Log\LogHandler;

class RecordApiHelper
{
    private $_integrationID;
    private $_integrationDetails;
    private $_defaultHeader;

    public function __construct($integrationDetails, $integId, $access_token)
    {
        $this->_integrationDetails = $integrationDetails;
        $this->_integrationID      = $integId;
        $this->_defaultHeader      = [
            'Authorization' => 'Bearer ' . $access_token,
            'Content-Type'  => 'application/json'
        ];
    }

    public function addContact($selectedList, $finalData)
    {
        $apiEndpoints = "https://api.sendpulse.com/addressbooks/{$selectedList}/emails";

        $body = '{
                    "emails":[{
                        "email":"' . $finalData['email'] . '",
                        "variables":{
                            "name":"' . $finalData['name'] . '",
                            "Phone":"' . $finalData['phone'] . '"
                        }
                    }]
                }';

        $res =  HttpHelper::post($apiEndpoints, $body, $this->_defaultHeader);
        return $res;
    }

    public function generateReqDataFromFieldMap($data, $fieldMap)
    {
        $dataFinal = [];
        foreach ($fieldMap as $value) {
            $triggerValue = $value->formField;
            $actionValue  = $value->sendPulseField;

            if ($triggerValue === 'custom') {
                $dataFinal[$actionValue] = $value->customValue;
            } elseif (!is_null($data[$triggerValue])) {
                $dataFinal[$actionValue] = $data[$triggerValue];
            }
        }

        return $dataFinal;
    }

    public function execute($selectedList, $fieldValues, $fieldMap)
    {
        $finalData   = $this->generateReqDataFromFieldMap($fieldValues, $fieldMap);

        $apiResponse = $this->addContact($selectedList, $finalData);

        if ($apiResponse->result == true) {
            $res = ['message' => 'Contact added successfully'];
            LogHandler::save($this->_integrationID, json_encode(['type' => 'contact', 'type_name' => 'Contact added']), 'success', json_encode($res));
        } else {
            LogHandler::save($this->_integrationID, json_encode(['type' => 'contact', 'type_name' => 'Adding Contact']), 'error', json_encode($apiResponse));
        }
        return $apiResponse;
    }
}
