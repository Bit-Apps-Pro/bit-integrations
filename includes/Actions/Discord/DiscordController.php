<?php

/**
 * discord Integration
 */

namespace BitCode\FI\Actions\Discord;

use BitCode\FI\Core\Util\HttpHelper;
use WP_Error;

/**
 * Provide functionality for discord integration
 */
class DiscordController
{
    public const APIENDPOINT = 'https://discord.com/api/v10';

    /**
     * Process ajax request for generate_token
     *
     * @param object $requestsParams     Params to authorize
     * @param mixed  $tokenRequestParams
     *
     * @return JSON discord api response and status
     */
    public static function handleAuthorize($tokenRequestParams)
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
            'Authorization' => 'Bot ' . $tokenRequestParams->accessToken,
        ];
        $apiEndpoint = self::APIENDPOINT . '/users/@me';

        $apiResponse = HttpHelper::get($apiEndpoint, null, $header);

        if (!isset($apiResponse->id)) {
            wp_send_json_error(
                empty($apiResponse->error) ? 'Unknown' : $apiResponse->error,
                400
            );
        }
        wp_send_json_success($apiResponse, 200);
    }

    public static function fetchServers($tokenRequestParams)
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
            'Authorization' => 'Bot ' . $tokenRequestParams->accessToken,
        ];
        $apiEndpoint = self::APIENDPOINT . '/users/@me/guilds';

        $apiResponse = HttpHelper::get($apiEndpoint, null, $header);

        if (\count($apiResponse) > 0) {
            foreach ($apiResponse as $server) {
                $servers[] = [
                    'id'   => (string) $server->id,
                    'name' => $server->name
                ];
            }
            wp_send_json_success($servers, 200);
        } else {
            wp_send_json_error(__('Servers fetching failed', 'bit-integrations'), 400);
        }
    }

    public static function fetchChannels($tokenRequestParams)
    {
        if (
            empty($tokenRequestParams->accessToken) || empty($tokenRequestParams->serverId)
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
            'Authorization' => 'Bot ' . $tokenRequestParams->accessToken,
        ];
        $apiEndpoint = self::APIENDPOINT . '/guilds/' . $tokenRequestParams->serverId . '/channels';

        $apiResponse = HttpHelper::get($apiEndpoint, null, $header);

        if (\count($apiResponse) > 0) {
            foreach ($apiResponse as $channel) {
                $channels[] = [
                    'id'   => (string) $channel->id,
                    'name' => $channel->name
                ];
            }
            wp_send_json_success($channels, 200);
        } else {
            wp_send_json_error(__('Channels fetching failed', 'bit-integrations'), 400);
        }
    }

    public function execute($integrationData, $fieldValues)
    {
        $integrationDetails = $integrationData->flow_details;

        $integrationId = $integrationData->id;

        $access_token = $integrationDetails->accessToken;
        $parse_mode = $integrationDetails->parse_mode;
        $server_id = $integrationDetails->selectedServer;
        $channel_id = $integrationDetails->selectedChannel;
        $body = $integrationDetails->body;

        if (
            empty($access_token)
            || empty($parse_mode)
            || empty($server_id)
            || empty($channel_id)
            || empty($body)
        ) {
            return new WP_Error('REQ_FIELD_EMPTY', wp_sprintf(__('module, fields are required for %s api', 'bit-integrations'), 'Discord'));
        }
        $recordApiHelper = new RecordApiHelper(self::APIENDPOINT, $access_token, $integrationId);
        $discordApiResponse = $recordApiHelper->execute(
            $integrationDetails,
            $fieldValues
        );

        if (is_wp_error($discordApiResponse)) {
            return $discordApiResponse;
        }

        return $discordApiResponse;
    }
}
