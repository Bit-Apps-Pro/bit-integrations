<?php

/**
 * Gravitec Integration
 */

namespace BitCode\FI\Actions\Gravitec;

use BitCode\FI\Core\Util\HttpHelper;
use WP_Error;

/**
 * Provide functionality for Gravitec integration
 */
class GravitecController
{
    public function authentication($fieldsRequestParams)
    {
        if (empty($fieldsRequestParams->site_url) || empty($fieldsRequestParams->app_key) || empty($fieldsRequestParams->app_secret)) {
            wp_send_json_error(__('Requested parameter is empty', 'bit-integrations'), 400);
        }

        $headers = [
            'Content-Type'  => 'application/json',
            'Authorization' => 'Basic ' . base64_encode("{$fieldsRequestParams->app_key}:{$fieldsRequestParams->app_secret}")
        ];

        $data = [
            'payload' => [
                'title'        => 'Authorization',
                'message'      => __('Authorized Successfully', 'bit-integrations'),
                'icon'         => BTCBI_ASSET_URI . '/gravitec.jpg',
                'redirect_url' => $fieldsRequestParams->site_url
            ]
        ];

        $apiEndpoint = 'https://uapi.gravitec.net/api/v3/push';
        $response = HttpHelper::post($apiEndpoint, wp_json_encode($data), $headers);

        if (isset($response->id)) {
            wp_send_json_success(__('Authentication successful', 'bit-integrations'), 200);
        } else {
            wp_send_json_error(__('Please enter valid Site Url, App Key & App Secret', 'bit-integrations'), 400);
        }
    }

    public function execute($integrationData, $fieldValues)
    {
        $integrationDetails = $integrationData->flow_details;
        $integId = $integrationData->id;
        $appKey = $integrationDetails->app_key;
        $appSecret = $integrationDetails->app_secret;
        $fieldMap = $integrationDetails->field_map;
        $actionName = $integrationDetails->actionName;

        if (empty($fieldMap) || empty($appKey) || empty($actionName) || empty($appSecret)) {
            return new WP_Error('REQ_FIELD_EMPTY', wp_sprintf(__('module, fields are required for %s api', 'bit-integrations'), 'Gravitec'));
        }

        $recordApiHelper = new RecordApiHelper($integrationDetails, $integId, $appKey, $appSecret);
        $gravitecApiResponse = $recordApiHelper->execute($fieldValues, $fieldMap, $actionName);

        if (is_wp_error($gravitecApiResponse)) {
            return $gravitecApiResponse;
        }

        return $gravitecApiResponse;
    }
}
