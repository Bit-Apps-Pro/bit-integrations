<?php

namespace BitCode\FI\Actions\Mailup;

use BitCode\FI\Core\Util\HttpHelper;
use BitCode\FI\Flow\FlowController;
use WP_Error;

class MailupController
{
    private $integrationID;

    public function __construct($integrationID)
    {
        $this->integrationID = $integrationID;
    }

    public static function authorization($requestParams)
    {
        if (empty($requestParams->clientId) || empty($requestParams->clientSecret) || empty($requestParams->code)) {
            wp_send_json_error(__('Requested parameter is empty', 'bit-integrations'), 400);
        }

        $authCode = explode('-', $requestParams->code)[0];

        $body = [
            'grant_type'    => 'authorization_code',
            'client_id'     => $requestParams->clientId,
            'client_secret' => $requestParams->clientSecret,
            'code'          => $authCode
        ];

        $apiEndpoint = 'https://services.mailup.com/Authorization/OAuth/Token';
        $header['Content-Type'] = 'application/x-www-form-urlencoded';
        $header['Authorization'] = 'Basic ' . base64_encode("{$requestParams->clientId}:{$requestParams->clientSecret}");
        $apiResponse = HttpHelper::post($apiEndpoint, $body, $header);

        if (is_wp_error($apiResponse) || !empty($apiResponse->error)) {
            wp_send_json_error(empty($apiResponse->error_description) ? 'Unknown' : $apiResponse->error_description, 400);
        }
        $apiResponse->generates_on = time();
        wp_send_json_success($apiResponse, 200);
    }

    public static function getAllField($requestParams)
    {
        if (empty($requestParams->tokenDetails) || empty($requestParams->clientId) || empty($requestParams->clientSecret)) {
            wp_send_json_error(__('Requested parameter is empty', 'bit-integrations'), 400);
        }

        $token = self::tokenExpiryCheck($requestParams->tokenDetails, $requestParams->clientId, $requestParams->clientSecret);
        $headers = [
            'Authorization' => 'Bearer ' . $token->access_token,
        ];
        $apiEndpoint = 'https://services.mailup.com/API/v1.1/Rest/ConsoleService.svc/Console/Recipient/DynamicFields?PageNumber=0&PageSize=1000';
        $apiResponse = HttpHelper::get($apiEndpoint, null, $headers);
        $excludedFields = ['allorderedproductids', 'totalorderedlast30d', 'totalorderedlast12m', 'totalordered', 'latestabandonedcartid', 'latestabandonedcarttotal', 'latestabandonedcartdate', 'latestshippedorderid', 'latestshippedorderdate', 'latestordercategoryids', 'latestorderproductids', 'latestorderamount', 'latestorderdate', 'latestorderid', 'customerid'];
        $fields = [
            (object) [
                'key'      => 'Email',
                'label'    => 'Email',
                'required' => true
            ]
        ];
        error_log(print_r($apiResponse, true));

        if (!property_exists($apiResponse, 'Items')) {
            wp_send_json_error('List fetching failed', 400);

            return;
        }

        foreach ($apiResponse->Items as $item) {
            if (!\in_array($item->Description, $excludedFields)) {
                $fields[] = (object) [
                    'key'      => $item->Id,
                    'label'    => $item->Description,
                    'required' => false
                ];
            }
        }

        wp_send_json_success($fields, 200);
    }

    public static function getAllList($requestParams)
    {
        if (empty($requestParams->tokenDetails) || empty($requestParams->clientId) || empty($requestParams->clientSecret)) {
            wp_send_json_error(__('Requested parameter is empty', 'bit-integrations'), 400);
        }

        $token = self::tokenExpiryCheck($requestParams->tokenDetails, $requestParams->clientId, $requestParams->clientSecret);
        $headers = [
            'Authorization' => 'Bearer ' . $token->access_token,
        ];
        $apiEndpoint = 'https://services.mailup.com/API/v1.1/Rest/ConsoleService.svc/Console/List?PageNumber=0&PageSize=1000';
        $apiResponse = HttpHelper::get($apiEndpoint, null, $headers);
        $lists = [];

        foreach ($apiResponse->Items as $item) {
            $lists[] = [
                'idList' => $item->IdList,
                'name'   => $item->Name
            ];
        }

        if (property_exists($apiResponse, 'Items')) {
            wp_send_json_success($lists, 200);
        } else {
            wp_send_json_error('List fetching failed', 400);
        }
    }

    public static function getAllGroup($requestParams)
    {
        if (empty($requestParams->tokenDetails) || empty($requestParams->clientId) || empty($requestParams->clientSecret) || empty($requestParams->listId)) {
            wp_send_json_error(__('Requested parameter is empty', 'bit-integrations'), 400);
        }

        $token = self::tokenExpiryCheck($requestParams->tokenDetails, $requestParams->clientId, $requestParams->clientSecret);
        $headers = [
            'Authorization' => 'Bearer ' . $token->access_token,
        ];
        $apiEndpoint = "https://services.mailup.com/API/v1.1/Rest/ConsoleService.svc/Console/List/{$requestParams->listId}/Groups?PageNumber=0&PageSize=1000";
        $apiResponse = HttpHelper::get($apiEndpoint, null, $headers);
        $lists = [];

        foreach ($apiResponse->Items as $item) {
            $lists[] = [
                'idGroup' => $item->idGroup,
                'name'    => $item->Name
            ];
        }

        if (property_exists($apiResponse, 'Items')) {
            wp_send_json_success($lists, 200);
        } else {
            wp_send_json_error('List fetching failed', 400);
        }
    }

    public function execute($integrationData, $fieldValues)
    {
        $integrationDetails = $integrationData->flow_details;
        $integId = $integrationData->id;
        $selectedList = $integrationDetails->listId;
        $selectedGroup = $integrationDetails->groupId;
        $fieldMap = $integrationDetails->field_map;
        $tokenDetails = self::tokenExpiryCheck($integrationDetails->tokenDetails, $integrationDetails->clientId, $integrationDetails->clientSecret);
        if ($tokenDetails->access_token !== $integrationDetails->tokenDetails->access_token) {
            $this->saveRefreshedToken($this->integrationID, $tokenDetails);
        }

        if (empty($fieldMap) || empty($tokenDetails) || empty($selectedList)) {
            return new WP_Error('REQ_FIELD_EMPTY', wp_sprintf(__('module, fields are required for %s api', 'bit-integrations'), 'Mailup'));
        }

        $recordApiHelper = new RecordApiHelper($integrationDetails, $integId, $tokenDetails->access_token);
        $mailupApiResponse = $recordApiHelper->execute(
            $selectedList,
            $selectedGroup,
            $fieldValues,
            $fieldMap
        );

        if (is_wp_error($mailupApiResponse)) {
            return $mailupApiResponse;
        }

        return $mailupApiResponse;
    }

    protected static function tokenExpiryCheck($token, $clientId, $clientSecret)
    {
        if (!$token) {
            return false;
        }

        if ((\intval($token->generates_on) + (55 * 60)) < time()) {
            $refreshToken = self::refreshToken($token->refresh_token, $clientId, $clientSecret);
            if (is_wp_error($refreshToken) || !empty($refreshToken->error)) {
                return false;
            }

            $token->access_token = $refreshToken->access_token;
            $token->expires_in = $refreshToken->expires_in;
            $token->generates_on = $refreshToken->generates_on;
        }

        return $token;
    }

    protected static function refreshToken($refresh_token, $clientId, $clientSecret)
    {
        $body = [
            'grant_type'    => 'refresh_token',
            'client_id'     => $clientId,
            'client_secret' => $clientSecret,
            'refresh_token' => $refresh_token,
        ];

        $apiEndpoint = 'https://services.mailup.com/Authorization/OAuth/Token';
        $apiResponse = HttpHelper::post($apiEndpoint, $body);
        if (is_wp_error($apiResponse) || !empty($apiResponse->error)) {
            return false;
        }
        $token = $apiResponse;
        $token->generates_on = time();

        return $token;
    }

    protected function saveRefreshedToken($integrationID, $tokenDetails)
    {
        if (empty($integrationID)) {
            return;
        }

        $flow = new FlowController();
        $mailupDetails = $flow->get(['id' => $integrationID]);
        if (is_wp_error($mailupDetails)) {
            return;
        }

        $newDetails = json_decode($mailupDetails[0]->flow_details);
        $newDetails->tokenDetails = $tokenDetails;
        $flow->update($integrationID, ['flow_details' => wp_json_encode($newDetails)]);
    }
}
