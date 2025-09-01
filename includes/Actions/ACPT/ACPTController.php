<?php

/**
 * ACPT Integration
 */

namespace BitCode\FI\Actions\ACPT;

use BitCode\FI\Core\Util\HttpHelper;
use WP_Error;

/**
 * Provide functionality for ACPT integration
 */
class ACPTController
{
    protected $_defaultHeader;

    public function authentication($fieldsRequestParams)
    {
        $this->checkValidation($fieldsRequestParams);
        $this->setHeaders($fieldsRequestParams->api_key);

        $apiEndpoint = $fieldsRequestParams->base_url . '/wp-json/acpt/v1/taxonomy';
        $response = HttpHelper::get($apiEndpoint, null, $this->_defaultHeader);

        if (is_wp_error($response) || HttpHelper::$responseCode != 200) {
            wp_send_json_error(
                !empty($response->message)
                    ? $response->message
                    : __('Please enter valid Api key-secret', 'bit-integrations'),
                HttpHelper::$responseCode
            );
        }

        wp_send_json_success(__('Authentication successful', 'bit-integrations'), 200);
    }

    public function execute($integrationData, $fieldValues)
    {
        $integrationDetails = $integrationData->flow_details;
        $integId = $integrationData->id;
        $apiKey = $integrationDetails->api_key;
        $baseUrl = $integrationDetails->base_url;
        $fieldMap = $integrationDetails->field_map;
        $module = $integrationDetails->module;

        if (empty($fieldMap) || empty($module) || empty($apiKey) || empty($baseUrl)) {
            return new WP_Error('REQ_FIELD_EMPTY', wp_sprintf(__('module, fields are required for %s api', 'bit-integrations'), 'ACPT'));
        }

        $recordApiHelper = new RecordApiHelper($integrationDetails, $integId, $apiKey, $baseUrl);
        $acptApiResponse = $recordApiHelper->execute($fieldValues, $fieldMap, $module);

        if (is_wp_error($acptApiResponse)) {
            return $acptApiResponse;
        }

        return $acptApiResponse;
    }

    private function checkValidation($fieldsRequestParams, $customParam = '**')
    {
        if (empty($fieldsRequestParams->base_url) || empty($fieldsRequestParams->api_key) || empty($customParam)) {
            wp_send_json_error(__('Requested parameter is empty', 'bit-integrations'), 400);
        }
    }

    private function setHeaders($apiKey)
    {
        $this->_defaultHeader = [
            'acpt-api-key' => $apiKey,
            'Content-Type' => 'application/json',
            'accept'       => 'application/json',
        ];
    }
}
