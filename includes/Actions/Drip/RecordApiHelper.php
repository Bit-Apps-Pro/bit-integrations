<?php

/**
 * Drip Record Api
 */

namespace BitCode\FI\Actions\Drip;

use BitCode\FI\Core\Util\HttpHelper;
use BitCode\FI\Log\LogHandler;

/**
 * Provide functionality for Record insert,update, exist
 */
class RecordApiHelper
{
    private $_defaultHeader;
    private $_integrationID;
    private $_apiEndpoint;

    public function __construct($api_token, $integId)
    {
        $this->_defaultHeader['Authorization'] = 'Basic ' . base64_encode("$api_token:");
        ;
        $this->_integrationID = $integId;
        $this->_apiEndpoint = "https://api.getdrip.com/v2";
    }

    // for adding a contact to a campaign.
    public function storeOrModifyRecord($method, $campaignId, $data, $account_id)
    {
        $insertRecordEndpoint = "{$this->_apiEndpoint}/{$account_id}/{$method}";

        $res = HttpHelper::post($insertRecordEndpoint, $data, $this->_defaultHeader);
        return $res;
    }

    public function generateReqDataFromFieldMap($data, $fieldMap)
    {
        $dataFinal = [];

        foreach ($fieldMap as $key => $value) {
            $triggerValue = $value->formField;
            $actionValue = $value->dripField;
            if ($triggerValue === 'custom') {
                $dataFinal[$actionValue] = $value->customValue;
            } elseif (!is_null($data[$triggerValue])) {
                $dataFinal[$actionValue] = $data[$triggerValue];
            }
        }
        return $dataFinal;
    }

    public function execute($fieldValues, $fieldMap, $actions, $campaignId, $account_id)
    {
        $fieldData = [];
        $customFields = [];

        $finalData = $this->generateReqDataFromFieldMap($fieldValues, $fieldMap);

        $drip = (object) $finalData;

        $recordApiResponse = $this->storeOrModifyRecord('subscribers', $campaignId, $drip, $account_id);

        $type = 'insert';

        if ($recordApiResponse !== 200) {
            LogHandler::save($this->_integrationID, ['type' => 'record', 'type_name' => $type], 'error', "There is an error while inserting record");
        } else {
            LogHandler::save($this->_integrationID, ['type' => 'record', 'type_name' => $type], 'success', "Record inserted successfully");
        }

        return $recordApiResponse;
    }
}
