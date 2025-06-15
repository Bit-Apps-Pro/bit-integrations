<?php

/**
 * trello Record Api
 */

namespace BitCode\FI\Actions\Trello;

use BitCode\FI\Log\LogHandler;
use BitCode\FI\Core\Util\Common;
use BitCode\FI\Core\Util\HttpHelper;

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
                $dataFinal[$actionValue] = Common::replaceFieldWithValue($value->customValue, $data);
            } elseif (!\is_null($data[$triggerValue])) {
                $dataFinal[$actionValue] = $data[$triggerValue];
            }
        }

        return $dataFinal;
    }

    public function execute($fieldValues, $fieldMap, $customFieldMap)
    {
        $finalData = $this->generateReqDataFromFieldMap($fieldValues, $fieldMap);
        $finalData['pos'] = $this->_integrationDetails->pos;
        $apiResponse = $this->insertCard($finalData);

        if (property_exists($apiResponse, 'errors')) {
            LogHandler::save($this->_integrationID, wp_json_encode(['type' => 'Card', 'type_name' => 'add-Card']), 'error', wp_json_encode($apiResponse));
        } else {
            LogHandler::save($this->_integrationID, wp_json_encode(['type' => 'Card', 'type_name' => 'add-Card']), 'success', wp_json_encode($apiResponse));
        }

        if (!empty($apiResponse->id) && !empty($customFieldMap)) {
            do_action('btcbi_trello_store_custom_fields', $apiResponse->id, $customFieldMap, $fieldValues, $this->_integrationID, $this->_integrationDetails);
        }

        return $apiResponse;
    }
}
