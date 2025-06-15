<?php

/**
 * KirimEmail Integration
 */

namespace BitCode\FI\Actions\KirimEmail;

use BitCode\FI\Core\Util\HttpHelper;
use WP_Error;

/**
 * Provide functionality for KirimEmail integration
 */
class KirimEmailController
{
    // $time = time();
    // $generated_token = hash_hmac("sha256","YOUR USERNAME"."::"."YOUR API TOKEN"."::".$time,"YOUR API TOKEN")

    public function checkAuthorization($tokenRequestParams)
    {
        if (
            empty($tokenRequestParams->username)
            || empty($tokenRequestParams->api_key)
        ) {
            wp_send_json_error(
                __(
                    'Requested parameter is empty',
                    'bit-integrations'
                ),
                400
            );
        }
        $userName = $tokenRequestParams->username;
        $apiKey = $tokenRequestParams->api_key;
        $time = time();
        $generated_token = hash_hmac('sha256', "{$userName}" . '::' . "{$apiKey}" . '::' . $time, "{$apiKey}");
        $header = [
            'Auth-Id'    => $userName,
            'Auth-Token' => $generated_token,
            'Timestamp'  => $time,
        ];

        $apiEndpoint = 'https://api.kirim.email/v3/list';

        $apiResponse = HttpHelper::get($apiEndpoint, null, $header);

        if (is_wp_error($apiResponse) || $apiResponse->code !== 200) {
            wp_send_json_error(
                empty($apiResponse->error) ? 'Unknown' : $apiResponse->error,
                400
            );
        }

        wp_send_json_success($apiResponse->data, 200);
    }

    public function getAllList($tokenRequestParams)
    {
        if (
            empty($tokenRequestParams->username)
            || empty($tokenRequestParams->api_key)
        ) {
            wp_send_json_error(
                __(
                    'Requested parameter is empty',
                    'bit-integrations'
                ),
                400
            );
        }
        $userName = $tokenRequestParams->username;
        $apiKey = $tokenRequestParams->api_key;
        $time = time();
        $generated_token = hash_hmac('sha256', "{$userName}" . '::' . "{$apiKey}" . '::' . $time, "{$apiKey}");
        $header = [
            'Auth-Id'    => $userName,
            'Auth-Token' => $generated_token,
            'Timestamp'  => $time,
        ];

        $apiEndpoint = 'https://api.kirim.email/v3/list';

        $apiResponse = HttpHelper::get($apiEndpoint, null, $header);

        if (is_wp_error($apiResponse) || $apiResponse->code !== 200) {
            wp_send_json_error(
                empty($apiResponse->error) ? 'Unknown' : $apiResponse->error,
                400
            );
        }

        wp_send_json_success($apiResponse->data, 200);
    }

    public function execute($integrationData, $fieldValues)
    {
        $integrationDetails = $integrationData->flow_details;
        $integrationId = $integrationData->id;
        $api_key = $integrationDetails->api_key;
        $userName = $integrationDetails->userName;
        $fieldMap = $integrationDetails->field_map;
        $mainAction = $integrationDetails->mainAction;

        if (
            empty($api_key)
            || empty($integrationDetails)
            || empty($userName)
            || empty($fieldMap)

        ) {
            return new WP_Error('REQ_FIELD_EMPTY', wp_sprintf(__('module, fields are required for %s api', 'bit-integrations'), 'Freshdesk'));
        }
        $recordApiHelper = new RecordApiHelper($integrationId);
        $kirinEmailApiResponse = $recordApiHelper->execute(
            $api_key,
            $userName,
            $fieldValues,
            $fieldMap,
            $integrationDetails,
            $mainAction
        );

        if (is_wp_error($kirinEmailApiResponse)) {
            return $kirinEmailApiResponse;
        }

        return $kirinEmailApiResponse;
    }
}
