<?php

/**
 * line Integration
 */

namespace BitCode\FI\Actions\Line;

use BitCode\FI\Core\Util\HttpHelper;
use WP_Error;

/**
 * Provide functionality for line integration
 */
class LineController
{
    public const APIENDPOINT = 'https://api.line.me/v2/bot';

    /**
     * Process ajax request for generate_token
     *
     * @param object $requestsParams     Params to authorize
     * @param mixed  $tokenRequestParams
     *
     * @return JSON line api response and status
     */
    public static function checkAuthorizationAndFetchChannels($tokenRequestParams)
    {
        if (
            empty($tokenRequestParams->accessToken)
        ) {
            wp_send_json_error(
                __(
                    'Requested parameter is empty',
                    'bit-integrations'
                ),
                400
            );
        }

        $header = ['Authorization' => 'Bearer ' . $tokenRequestParams->accessToken];

        $apiEndpoint = self::APIENDPOINT . '/info';

        $apiResponse = HttpHelper::get($apiEndpoint, null, $header);

        if (is_wp_error($apiResponse) || empty($apiResponse->userId)) {
            wp_send_json_error(
                empty($apiResponse->message) ? 'Unknown' : $apiResponse->message,
                400
            );
        }

        wp_send_json_success($apiResponse, 200);
    }

    public function execute($integrationData, $fieldValues)
    {
        $integrationDetails = $integrationData->flow_details;
        $integrationId = $integrationData->id;

        $access_token = $integrationDetails->accessToken;
        $parse_mode = $integrationDetails->parse_mode;
        $channel_id = $integrationDetails->channel_id;
        $body = $integrationDetails->body;

        if (
            empty($access_token)
            || empty($parse_mode)
            || empty($channel_id)
            || empty($body)
        ) {
            return new WP_Error('REQ_FIELD_EMPTY', wp_sprintf(__('module, fields are required for %s api', 'bit-integrations'), 'Line'));
        }
        $recordApiHelper = new RecordApiHelper(self::APIENDPOINT, $access_token, $integrationId);
        $lineApiResponse = $recordApiHelper->execute(
            $integrationDetails,
            $fieldValues
        );

        if (is_wp_error($lineApiResponse)) {
            return $lineApiResponse;
        }

        return $lineApiResponse;
    }
}
