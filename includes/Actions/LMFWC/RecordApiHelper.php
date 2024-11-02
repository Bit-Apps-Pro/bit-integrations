<?php

/**
 * LMFWC Record Api
 */

namespace BitCode\FI\Actions\LMFWC;

use BitCode\FI\Log\LogHandler;
use BitCode\FI\Core\Util\Common;
use BitCode\FI\Core\Util\HttpHelper;

/**
 * Provide functionality for Record insert, upsert
 */
class RecordApiHelper
{
    private $integrationDetails;

    private $integrationId;

    private $apiUrl;

    private $defaultHeader;

    private $type;

    private $typeName;

    public function __construct($integrationDetails, $integId, $apiSecret, $apiKey, $baseUrl)
    {
        $this->integrationDetails = $integrationDetails;
        $this->integrationId = $integId;
        $this->apiUrl = "{$baseUrl}/wp-json/lmfwc/v2";
        $this->defaultHeader = [
            'Authorization' => 'Basic ' . base64_encode("{$apiKey}:{$apiSecret}"),
            'Content-Type'  => 'application/json',
        ];
    }

    public function createLicense($finalData)
    {
        $this->type = 'Create license';
        $this->typeName = 'Create license';

        if (empty($finalData['license_key'])) {
            return ['success' => false, 'message' => __('Required field license key is empty', 'bit-integrations'), 'code' => 400];
        }

        // if (isset($this->integrationDetails->selectedEvent) || !empty($this->integrationDetails->selectedEvent)) {
        //     $finalData['id'] = $this->integrationDetails->selectedEvent;
        // }
        // if (isset($this->integrationDetails->selectedSession) && !empty($this->integrationDetails->selectedSession)) {
        //     $finalData['date_id'] = $this->integrationDetails->selectedSession;
        // }

        $finalData['status'] = 'inactive';

        $apiEndpoint = $this->apiUrl . '/licenses';
        error_log(print_r([$apiEndpoint, $finalData, $this->defaultHeader], true));

        return HttpHelper::post($apiEndpoint, wp_json_encode($finalData), $this->defaultHeader, ['sslverify' => false]);
    }

    public function generateReqDataFromFieldMap($data, $fieldMap)
    {
        $dataFinal = [];
        foreach ($fieldMap as $value) {
            $triggerValue = $value->formField;
            $actionValue = $value->lmfwcFormField;
            $dataFinal[$actionValue] = ($triggerValue === 'custom') ? Common::replaceFieldWithValue($value->customValue, $data) : $data[$triggerValue];
        }

        return $dataFinal;
    }

    public function execute($fieldValues, $fieldMap, $module)
    {
        $finalData = $this->generateReqDataFromFieldMap($fieldValues, $fieldMap);

        if ($module === 'create_license') {
            $apiResponse = $this->createLicense($finalData);
        }

        if (isset($apiResponse->success) && $apiResponse->success) {
            $res = [$this->typeName . '  successfully'];
            LogHandler::save($this->integrationId, wp_json_encode(['type' => $this->type, 'type_name' => $this->typeName]), 'success', wp_json_encode($res));
        } else {
            if (is_wp_error($apiResponse)) {
                $res = $apiResponse->get_error_message();
            } else {
                $res = !empty($apiResponse->message) ? $apiResponse->message : wp_json_encode($apiResponse);
            }

            LogHandler::save($this->integrationId, wp_json_encode(['type' => $this->type, 'type_name' => $this->type . ' creating']), 'error', $res);
        }

        return $apiResponse;
    }
}
