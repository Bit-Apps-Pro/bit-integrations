<?php

namespace BitCode\FI\Actions\Getgist;

use BitCode\FI\Core\Util\HttpHelper;
use WP_Error;

class GetgistController
{
    public const APIENDPOINT = 'https://api.getgist.com';

    public static function getgistAuthorize($requestsParams)
    {
        if (empty($requestsParams->api_key)) {
            wp_send_json_error(
                __(
                    'Requested parameter is empty',
                    'bit-integrations'
                ),
                400
            );
        }

        $apiEndpoint = self::APIENDPOINT . '/contacts';
        $authorizationHeader['Authorization'] = "Bearer {$requestsParams->api_key}";
        $apiResponse = HttpHelper::get($apiEndpoint, null, $authorizationHeader);

        if (is_wp_error($apiResponse) || $apiResponse->code === 'authentication_failed') {
            wp_send_json_error(
                empty($apiResponse->code) ? 'Unknown' : $apiResponse->message,
                400
            );
        }

        wp_send_json_success(true);
    }

    public function execute($integrationData, $fieldValues)
    {
        $integrationDetails = $integrationData->flow_details;
        $integId = $integrationData->id;

        $api_key = $integrationDetails->api_key;
        $fieldMap = $integrationDetails->field_map;
        $actions = $integrationDetails->actions;
        if (empty($api_key)
            || empty($fieldMap)
        ) {
            return new WP_Error('REQ_FIELD_EMPTY', wp_sprintf(__('module, fields are required for %s api', 'bit-integrations'), 'GetGist'));
        }
        $recordApiHelper = new RecordApiHelper($api_key, $integId);
        $getgistApiResponse = $recordApiHelper->execute(
            $integId,
            $fieldValues,
            $fieldMap,
            $integrationDetails
        );

        if (is_wp_error($getgistApiResponse)) {
            return $getgistApiResponse;
        }

        return $getgistApiResponse;
    }
}
