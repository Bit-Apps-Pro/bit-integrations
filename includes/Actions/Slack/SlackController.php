<?php

/**
 * slack Integration
 */

namespace BitCode\FI\Actions\Slack;

use BitCode\FI\Core\Util\HttpHelper;
use WP_Error;

/**
 * Provide functionality for slack integration
 */
class SlackController
{
    public const APIENDPOINT = 'https://slack.com/api';

    /**
     * Process ajax request for generate_token
     *
     * @param object $requestsParams     Params to authorize
     * @param mixed  $tokenRequestParams
     *
     * @return JSON slack api response and status
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
        $header = [
            'Authorization' => 'Bearer ' . $tokenRequestParams->accessToken,
            'Accept'        => '*/*',
            'verify'        => false
        ];
        $apiEndpoint = self::APIENDPOINT . '/conversations.list';

        $apiResponse = HttpHelper::post($apiEndpoint, null, $header);

        if (is_wp_error($apiResponse) || !empty($apiResponse->error)) {
            wp_send_json_error(
                empty($apiResponse->error) ? 'Unknown' : $apiResponse->error,
                400
            );
        }
        $apiResponse->generates_on = time();
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
            return new WP_Error('REQ_FIELD_EMPTY', wp_sprintf(__('module, fields are required for %s api', 'bit-integrations'), 'Slack'));
        }
        $recordApiHelper = new RecordApiHelper(self::APIENDPOINT, $access_token, $integrationId);
        $slackApiResponse = $recordApiHelper->execute(
            $integrationDetails,
            $fieldValues
        );

        if (is_wp_error($slackApiResponse)) {
            return $slackApiResponse;
        }

        return $slackApiResponse;
    }
}
