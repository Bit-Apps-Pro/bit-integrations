<?php
namespace BitCode\FI\Actions\Sendy;

use BitCode\FI\Core\Util\Common;
use BitCode\FI\Core\Util\HttpHelper;
use BitCode\FI\Log\LogHandler;

/**
 * Provide functionality for Record insert,upsert
 */
class RecordApiHelper
{
    private $_defaultHeader;
    private $_tokenDetails;
    private $_integrationID;

    public function __construct($integId)
    {
        $this->_integrationID = $integId;
    }

    public function insertRecord($data, $sendyUrl)
    {
        $header['Content-Type'] = 'application/x-www-form-urlencoded';
        $insertRecordEndpoint = "$sendyUrl/subscribe";
        $data['boolean'] = 'true';
        return HttpHelper::post($insertRecordEndpoint, $data, $header);
    }

    public function generateReqDataFromFieldMap($data, $fieldMap)
    {
        $dataFinal = [];

        foreach ($fieldMap as $key => $value) {
            $triggerValue = $value->formField;
            $actionValue = $value->sendyField;
            if ($triggerValue === 'custom') {
                $dataFinal[$actionValue] = Common::replaceFieldWithValue($value->customValue, $data);
            } elseif (!is_null($data[$triggerValue])) {
                $dataFinal[$actionValue] = $data[$triggerValue];
            }
        }
        return $dataFinal;
    }

    public function execute($integId, $integrationDetails, $fieldValues, $fieldMap, $apiKey)
    {
        $fieldData = [];
        $finalData = $this->generateReqDataFromFieldMap($fieldValues, $fieldMap);

        $listId = $integrationDetails->list_id;
        $sendyUrl = $integrationDetails->sendy_url;
        $apiKey = $integrationDetails->api_key;
        $finalData['list'] = $listId;
        $finalData['boolean'] = true;
        $finalData['api_key'] = $apiKey;

        $apiResponse = $this->insertRecord($finalData, $sendyUrl);

        if ($apiResponse) {
            LogHandler::save($this->_integrationID, ['type' => 'record', 'type_name' => 'add-subscriber'], 'success', json_encode('Subscriber added successfully'));
        } else {
            LogHandler::save($this->_integrationID, ['type' => 'subscriber', 'type_name' => 'add-subscriber'], 'error', json_encode('Failed to add subscriber'));
        }
        return $apiResponse;
    }
}
