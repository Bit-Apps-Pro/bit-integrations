<?php

/**
 * OmniSend Integration
 */

namespace BitCode\FI\Actions\OmniSend;

use WP_Error;
use BitCode\FI\Core\Util\HttpHelper;

/**
 * Provide functionality for OmniSend integration
 */
class OmniSendController
{
    protected $_defaultHeader;

    private $baseUrl = 'https://api.omnisend.com/v3/';

    public function authorization($requestParams)
    {
        if (empty($requestParams->api_key)) {
            wp_send_json_error(
                __(
                    'Requested parameter is empty',
                    'bit-integrations'
                ),
                400
            );
        }

        $apiEndpoints = $this->baseUrl . 'contacts';

        $header = [
            'X-API-KEY' => $requestParams->api_key,
        ];

        $response = HttpHelper::get($apiEndpoints, null, $header);
        if (isset($response->contacts)) {
            wp_send_json_success('', 200);
        } else {
            wp_send_json_error(
                'The token is invalid',
                400
            );
        }
    }

    public function execute($integrationData, $fieldValues)
    {
        $integrationDetails = $integrationData->flow_details;
        $integId = $integrationData->id;
        $api_key = $integrationDetails->api_key;
        $channels = $integrationDetails->channels;
        $fieldMap = $integrationDetails->field_map;
        $customFieldMap = $integrationDetails->custom_field_map ?? [];
        $emailStatus = $integrationDetails->email_status;
        $smsStatus = $integrationDetails->sms_status;

        if (
            empty($fieldMap)
             || empty($api_key)
        ) {
            return new WP_Error('REQ_FIELD_EMPTY', wp_sprintf(__('module, fields are required for %s api', 'bit-integrations'), 'OmniSend'));
        }
        $recordApiHelper = new RecordApiHelper($integrationDetails, $integId);

        $omniSendApiResponse = $recordApiHelper->execute(
            $channels,
            $emailStatus,
            $smsStatus,
            $fieldValues,
            $fieldMap,
            $customFieldMap
        );

        if (is_wp_error($omniSendApiResponse)) {
            return $omniSendApiResponse;
        }

        return $omniSendApiResponse;
    }
}
