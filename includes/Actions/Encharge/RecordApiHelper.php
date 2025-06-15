<?php

/**
 * Encharge Record Api
 */

namespace BitCode\FI\Actions\Encharge;

use BitCode\FI\Core\Util\HttpHelper;
use BitCode\FI\Log\LogHandler;

/**
 * Provide functionality for Record insert
 */
class RecordApiHelper
{
    private $_defaultHeader;

    private $_integrationID;

    public function __construct($api_key, $integId)
    {
        $this->_defaultHeader['Content-Type'] = 'application/json';
        $this->_defaultHeader['X-Encharge-Token'] = $api_key;
        $this->_integrationID = $integId;
    }

    /**
     * serd data to api
     *
     * @param mixed $data
     *
     * @return json response
     */
    public function insertRecord($data)
    {
        $insertRecordEndpoint = 'https://api.encharge.io/v1/people';

        return HttpHelper::post($insertRecordEndpoint, $data, $this->_defaultHeader);
    }

    public function execute($fieldValues, $fieldMap, $tags)
    {
        $fieldData = [];

        foreach ($fieldMap as $fieldKey => $fieldPair) {
            if (!empty($fieldPair->enChargeFields)) {
                // echo $fieldPair->enChargeFields . ' ' . $fieldPair->formField;
                if ($fieldPair->formField === 'custom' && isset($fieldPair->customValue)) {
                    $fieldData[$fieldPair->enChargeFields] = $fieldPair->customValue;
                } elseif (!\is_null($fieldValues[$fieldPair->formField])) {
                    $fieldData[$fieldPair->enChargeFields] = $fieldValues[$fieldPair->formField];
                }
            }
        }
        if ($tags !== null) {
            $fieldData['tags'] = $tags;
        }
        $recordApiResponse = $this->insertRecord(wp_json_encode($fieldData));
        $type = 'insert';

        if ($recordApiResponse && isset($recordApiResponse->user)) {
            $recordApiResponse = [
                'status' => 'success',
                'email'  => $recordApiResponse->user->email
            ];
            LogHandler::save($this->_integrationID, ['type' => 'record', 'type_name' => $type], 'success', $recordApiResponse);
        } else {
            LogHandler::save($this->_integrationID, ['type' => 'record', 'type_name' => $type], 'error', $recordApiResponse);
        }

        return $recordApiResponse;
    }
}
