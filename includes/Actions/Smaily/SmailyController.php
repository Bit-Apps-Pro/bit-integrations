<?php

/**
 * Smaily Integration
 */

namespace BitCode\FI\Actions\Smaily;

use WP_Error;
use BitCode\FI\Core\Util\HttpHelper;

/**
 * Provide functionality for Smaily integration
 */
class SmailyController
{
    public function authentication($fieldsRequestParams)
    {
        if (empty($fieldsRequestParams->subdomain) && empty($fieldsRequestParams->api_user_name) && empty($fieldsRequestParams->api_user_password)) {
            wp_send_json_error(__('Requested parameter is empty', 'bit-integrations'), 400);
        }

        $subdomain = $fieldsRequestParams->subdomain;
        $apiEndpoint = "https://{$subdomain}.sendsmaily.net/api/organizations/users.php";
        $apiUserName = $fieldsRequestParams->api_user_name;
        $apiUserPassword = $fieldsRequestParams->api_user_password;
        $header = [
            'Authorization' => 'Basic ' . base64_encode("{$apiUserName}:{$apiUserPassword}")
        ];

        $response = HttpHelper::get($apiEndpoint, null, $header);

        if (isset($response[0]->id) && !empty($response)) {
            wp_send_json_success(__('Authentication successful', 'bit-integrations'), 200);
        } else {
            wp_send_json_error(__('Please enter valid subdomain name and api credentials', 'bit-integrations'), 400);
        }
    }

    public function execute($integrationData, $fieldValues)
    {
        $integrationDetails = $integrationData->flow_details;
        $integId = $integrationData->id;
        $fieldMap = $integrationDetails->field_map;

        if (empty($fieldMap) || empty($integrationDetails->subdomain) || empty($integrationDetails->api_user_name) || empty($integrationDetails->api_user_password)) {
            return new WP_Error('REQ_FIELD_EMPTY', __('fields are required for Smaily api', 'bit-integrations'));
        }

        $recordApiHelper = new RecordApiHelper($integrationDetails, $integId);
        $smailyApiResponse = $recordApiHelper->execute($fieldValues, $fieldMap);

        if (is_wp_error($smailyApiResponse)) {
            return $smailyApiResponse;
        }

        return $smailyApiResponse;
    }
}
