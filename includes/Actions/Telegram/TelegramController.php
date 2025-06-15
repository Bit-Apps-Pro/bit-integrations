<?php

/**
 * Telegrom Integration
 */

namespace BitCode\FI\Actions\Telegram;

use WP_Error;
use BitCode\FI\Core\Util\IpTool;
use BitCode\FI\Core\Util\HttpHelper;

use BitCode\FI\Actions\Telegram\RecordApiHelper;

/**
 * Provide functionality for Telegram integration
 */
class TelegramController
{
    private $_integrationID;
    public const APIENDPOINT = 'https://api.telegram.org/bot';

    // public function __construct($integrationID=0)
    // {
    //     $this->_integrationID = $integrationID;
    // }

    /**
     * Process ajax request for generate_token
     *
     * @param Object $requestsParams Params to authorize
     *
     * @return JSON zoho crm api response and status
     */
    public static function telegramAuthorize($requestsParams)
    {
        if (empty($requestsParams->bot_api_key)) {
            wp_send_json_error(
                __(
                    'Requested parameter is empty',
                    'bit-integrations'
                ),
                400
            );
        }

        $apiEndpoint = self::APIENDPOINT . $requestsParams->bot_api_key . '/getMe';
        $authorizationHeader["Accept"] = 'application/x-www-form-urlencoded';
        $apiResponse = HttpHelper::get($apiEndpoint, null, $authorizationHeader);

        if (is_wp_error($apiResponse) || !$apiResponse->ok) {
            wp_send_json_error(
                empty($apiResponse->error_code) ? 'Unknown' : $apiResponse,
                400
            );
        }
        $apiEndpoint = self::APIENDPOINT . $requestsParams->bot_api_key . '/getUpdates';
        $authorizationHeader["Accept"] = 'application/x-www-form-urlencoded';
        $apiResponse = HttpHelper::get($apiEndpoint, null, $authorizationHeader);


        if (is_wp_error($apiResponse) || !$apiResponse->ok) {
            wp_send_json_error(
                empty($apiResponse->error_code) ? 'Unknown' : $apiResponse,
                400
            );
        }

        wp_send_json_success(true);
    }
    /**
     * Process ajax request for refresh telegram get Updates
     *
     * @param Object $requestsParams Params to get update
     *
     * @return JSON telegram get Updates data
     */

    public static function refreshGetUpdates($requestsParams)
    {
        if (empty($requestsParams->bot_api_key)) {
            wp_send_json_error(
                __(
                    'Requested parameter is empty',
                    'bit-integrations'
                ),
                400
            );
        }
        $apiEndpoint = self::APIENDPOINT . $requestsParams->bot_api_key . '/getUpdates';
        $authorizationHeader["Accept"] = 'application/json';
        $telegramResponse = HttpHelper::get($apiEndpoint, null, $authorizationHeader);

        $allList = [];
        if (!is_wp_error($telegramResponse) && $telegramResponse->ok) {
            $telegramChatLists = $telegramResponse->result;

            foreach ($telegramChatLists as $list) {
                $allList[$list->my_chat_member->chat->title] = (object) [
                    'id' => $list->my_chat_member->chat->id,
                    'name' => $list->my_chat_member->chat->title,
                ];
            }
            uksort($allList, 'strnatcasecmp');

            $response['telegramChatLists'] = $allList;
        } else {
            wp_send_json_error(
                $telegramResponse->description,
                400
            );
        }
        wp_send_json_success($response, 200);
    }

    public function execute($integrationData, $fieldValues)
    {
        $integrationDetails = $integrationData->flow_details;
        $integrationId = $integrationData->id;

        $bot_api_key = $integrationDetails->bot_api_key;
        $parse_mode = $integrationDetails->parse_mode;
        $chat_id = $integrationDetails->chat_id;
        $body = $integrationDetails->body;

        if (
            empty($bot_api_key)
            || empty($parse_mode)
            || empty($chat_id)
            || empty($body)
        ) {
            return new WP_Error('REQ_FIELD_EMPTY', __('module, fields are required for Telegram api', 'bit-integrations'));
        }
        $recordApiHelper = new RecordApiHelper(self::APIENDPOINT . $bot_api_key, $integrationId);
        $telegramApiResponse = $recordApiHelper->execute(
            $integrationDetails,
            $fieldValues
        );

        if (is_wp_error($telegramApiResponse)) {
            return $telegramApiResponse;
        }
        return $telegramApiResponse;
    }
}
