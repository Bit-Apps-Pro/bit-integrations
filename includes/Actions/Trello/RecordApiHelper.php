<?php

/**
 * trello Record Api
 */
namespace BitCode\FI\Actions\Trello;

use BitCode\FI\Core\Util\Common;
use BitCode\FI\Core\Util\HttpHelper;
use BitCode\FI\Log\LogHandler;

/**
 * Provide functionality for Record insert, upsert
 */
class RecordApiHelper
{
    private $_integrationID;
    private $_integrationDetails;

    public function __construct($integrationDetails, $integId)
    {
        $this->_integrationDetails = $integrationDetails;
        $this->_integrationID = $integId;
    }

    public function insertCard($data)
    {
        $insertRecordEndpoint = 'https://api.trello.com/1/cards/?idList=' . $this->_integrationDetails->listId . '&key=' . $this->_integrationDetails->clientId . '&token=' . $this->_integrationDetails->accessToken;
        return HttpHelper::post($insertRecordEndpoint, $data);
    }

    public function generateReqDataFromFieldMap($data, $fieldMap)
    {
        $dataFinal = [];

        foreach ($fieldMap as $key => $value) {
            $triggerValue = $value->formField;
            $actionValue = $value->trelloFormField;
            if ($triggerValue === 'custom') {
                $dataFinal[$actionValue] = Common::replaceFieldWithValue(Common::replaceFieldWithValue($value->customValue, $data), $data);
            } elseif (!is_null($data[$triggerValue])) {
                $dataFinal[$actionValue] = $data[$triggerValue];
            }
        }
        return $dataFinal;
    }

    public function execute(
        $listId,
        $tags,
        $defaultDataConf,
        $fieldValues,
        $fieldMap,
        $actions
    ) {
        $fieldData = [];
        $finalData = $this->generateReqDataFromFieldMap($fieldValues, $fieldMap);

        $finalData = $finalData + ['pos' => $this->_integrationDetails->pos];
        $apiResponse = $this->insertCard($finalData);
        if (property_exists($apiResponse, 'errors')) {
            LogHandler::save($this->_integrationID, json_encode(['type' => 'contact', 'type_name' => 'add-contact']), 'error', json_encode($apiResponse));
        } else {
            LogHandler::save($this->_integrationID, json_encode(['type' => 'record', 'type_name' => 'add-contact']), 'success', json_encode($apiResponse));
        }
        return $apiResponse;
    }
}
