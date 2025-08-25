<?php

/**
 * ACPT Record Api
 */

namespace BitCode\FI\Actions\ACPT;

use BitCode\FI\Core\Util\Common;
use BitCode\FI\Core\Util\HttpHelper;
use BitCode\FI\Log\LogHandler;

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

    public function __construct($integrationDetails, $integId, $apiKey, $baseUrl)
    {
        $this->integrationDetails = $integrationDetails;
        $this->integrationId = $integId;
        $this->apiUrl = "{$baseUrl}/wp-json/acpt/v1";
        $this->defaultHeader = [
            'acpt-api-key' => $apiKey,
            'Content-Type' => 'application/json',
            'accept'       => 'application/json',
        ];
    }

    public function createCPT($finalData, $fieldValues)
    {
        $this->type = 'CPT';
        $this->typeName = 'Create CPT';

        if (empty($finalData['post_name'])) {
            return ['success' => false, 'message' => __('Required field Post Name is empty', 'bit-integrations'), 'code' => 422];
        }

        if (empty($finalData['singular_label'])) {
            return ['success' => false, 'message' => __('Required field Singular Label is empty', 'bit-integrations'), 'code' => 422];
        }

        if (empty($finalData['plural_label'])) {
            return ['success' => false, 'message' => __('Required field Plural Label is empty', 'bit-integrations'), 'code' => 422];
        }

        error_log(print_r($this->integrationDetails, true));
        $labels = $this->generateReqDataFromFieldMap($fieldValues, $this->integrationDetails->label_field_map);

        // $apiEndpoint = $this->apiUrl . '/licenses';

        // return HttpHelper::post($apiEndpoint, wp_json_encode($finalData), $this->defaultHeader, ['sslverify' => false]);
    }

    public function generateReqDataFromFieldMap($data, $fieldMap)
    {
        $dataFinal = [];
        foreach ($fieldMap as $value) {
            $triggerValue = $value->formField;
            $actionValue = $value->acptFormField;

            $dataFinal[$actionValue] = ($triggerValue === 'custom' && !empty($value->customValue)) ? Common::replaceFieldWithValue($value->customValue, $data) : $data[$triggerValue];
        }

        return $dataFinal;
    }

    public function execute($fieldValues, $fieldMap, $module)
    {
        $finalData = $this->generateReqDataFromFieldMap($fieldValues, $fieldMap);

        switch ($module) {
            case 'create_cpt':
                $apiResponse = $this->createCPT($finalData, $fieldValues);

                break;
        }

        if (isset($apiResponse->success) && $apiResponse->success && !isset($apiResponse->data->errors)) {
            $res = [$this->typeName . '  successfully'];

            LogHandler::save($this->integrationId, wp_json_encode(['type' => $this->type, 'type_name' => $this->typeName]), 'success', wp_json_encode($res));
        } else {
            if (is_wp_error($apiResponse)) {
                $res = $apiResponse->get_error_message();
            } elseif (isset($apiResponse->data->errors)) {
                $res = $apiResponse->data->errors->acpt_rest_data_error[0] ?? wp_json_encode($apiResponse);
            } else {
                $res = !empty($apiResponse->message) ? $apiResponse->message : wp_json_encode($apiResponse);
            }

            LogHandler::save($this->integrationId, wp_json_encode(['type' => $this->type, 'type_name' => $this->type . ' creating']), 'error', $res);
        }

        return $apiResponse;
    }
}
