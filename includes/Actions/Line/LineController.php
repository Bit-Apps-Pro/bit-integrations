<?php

namespace BitCode\FI\Actions\Line;

use BitCode\FI\Core\Util\HttpHelper;

class LineController
{
    public const APIENDPOINT = 'https://api.line.me/v2/bot';

    public static function checkAuthorization($tokenRequestParams)
    {
        if (empty($tokenRequestParams->accessToken)) {
            wp_send_json_error(__('Requested parameter is empty', 'bit-integrations'), 400);
        }

        $header = ['Authorization' => 'Bearer ' . $tokenRequestParams->accessToken];
        $apiEndpoint = self::APIENDPOINT . '/info';

        $apiResponse = HttpHelper::get($apiEndpoint, null, $header);

        if (is_wp_error($apiResponse) || empty($apiResponse->userId)) {
            wp_send_json_error(empty($apiResponse->message) ? 'Unknown' : $apiResponse->message, 400);
        }

        wp_send_json_success($apiResponse, 200);
    }

    public function execute($integrationData, $fieldValues)
    {
        $integrationDetails = $integrationData->flow_details;
        $integrationId = $integrationData->id;
        $access_token = $integrationDetails->accessToken;

        $recordApiHelper = new RecordApiHelper(self::APIENDPOINT, $access_token, $integrationId);

        return $recordApiHelper->execute($integrationDetails, $fieldValues);
    }
}
