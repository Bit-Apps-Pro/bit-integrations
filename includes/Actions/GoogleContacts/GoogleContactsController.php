<?php

namespace BitCode\FI\Actions\GoogleContacts;

use BitCode\FI\Actions\GoogleContacts\RecordApiHelper as GoogleContactsRecordApiHelper;
use BitCode\FI\Core\Util\HttpHelper;
use BitCode\FI\Flow\FlowController;
use BitCode\FI\Log\LogHandler;
use WP_Error;

class GoogleContactsController
{
    private $integrationID;

    public function __construct($integrationID)
    {
        $this->integrationID = $integrationID;
    }

    public static function authorization($requestParams)
    {
        if (empty($requestParams->clientId) || empty($requestParams->clientSecret) || empty($requestParams->code) || empty($requestParams->redirectURI)) {
            wp_send_json_error(__('Requested parameter is empty', 'bit-integrations'), 400);
        }

        $body = [
            'grant_type'    => 'authorization_code',
            'client_id'     => $requestParams->clientId,
            'client_secret' => $requestParams->clientSecret,
            'redirect_uri'  => urldecode($requestParams->redirectURI),
            'code'          => urldecode($requestParams->code)
        ];

        $apiEndpoint = 'https://oauth2.googleapis.com/token';
        $header['Content-Type'] = 'application/x-www-form-urlencoded';
        $apiResponse = HttpHelper::post($apiEndpoint, $body, $header);

        if (is_wp_error($apiResponse) || !empty($apiResponse->error)) {
            wp_send_json_error(empty($apiResponse->error_description) ? 'Unknown' : $apiResponse->error_description, 400);
        }
        $apiResponse->generates_on = time();
        wp_send_json_success($apiResponse, 200);
    }

    public static function getAllCalendarLists($queryParams)
    {
        if (empty($queryParams->tokenDetails) || empty($queryParams->clientId) || empty($queryParams->clientSecret)) {
            wp_send_json_error(__('Requested parameter is empty', 'bit-integrations'), 400);
        }

        $token = self::tokenExpiryCheck($queryParams->tokenDetails, $queryParams->clientId, $queryParams->clientSecret);
        $lists = self::getGoogleCalendarList($token->access_token);

        $data = [];
        if (\is_array($lists->items)) {
            foreach ($lists->items as $list) {
                $data[] = (object) [
                    'id'         => $list->id,
                    'name'       => isset($list->summary) ? $list->summary : $list->id,
                    'accessRole' => isset($list->accessRole) ? $list->accessRole : '',
                ];
            }
        }

        $response['googleCalendarLists'] = $data;
        $response['tokenDetails'] = $token;
        wp_send_json_success($response, 200);
    }

    public function execute($integrationData, $fieldValues)
    {
        if (empty($integrationData->flow_details->tokenDetails->access_token)) {
            LogHandler::save($this->integrationID, wp_json_encode(['type' => 'record', 'type_name' => 'insert']), 'error', wp_sprintf(__('Not Authorization By %s', 'bit-integrations'), 'GoogleContact'));

            return false;
        }

        $integrationDetails = $integrationData->flow_details;
        $actions = $integrationDetails->actions;
        $fieldMap = $integrationDetails->field_map;
        $mainAction = $integrationDetails->mainAction;
        $tokenDetails = self::tokenExpiryCheck($integrationDetails->tokenDetails, $integrationDetails->clientId, $integrationDetails->clientSecret);
        if ($tokenDetails->access_token !== $integrationDetails->tokenDetails->access_token) {
            $this->saveRefreshedToken($this->integrationID, $tokenDetails);
        }

        if (empty($fieldMap)) {
            $error = new WP_Error('REQ_FIELD_EMPTY', __('Required fields not mapped', 'bit-integrations'));
            LogHandler::save($this->integrationID, 'record', 'validation', $error);

            return $error;
        }

        (new GoogleContactsRecordApiHelper($tokenDetails->access_token))->executeRecordApi($this->integrationID, $fieldValues, $fieldMap, $actions, $mainAction);

        return true;
    }

    protected static function getGoogleCalendarList($token)
    {
        $headers = [
            'Accept'        => 'application/json',
            'Content-Type'  => 'application/json;',
            'Authorization' => 'Bearer ' . $token,
        ];
        $apiEndpoint = 'https://www.googleapis.com/calendar/v3/users/me/calendarList';
        $body = [
            'minAccessRole' => 'writer',
        ];
        $apiResponse = HttpHelper::get($apiEndpoint, $body, $headers);
        if (is_wp_error($apiResponse) || !empty($apiResponse->error)) {
            return false;
        }

        return $apiResponse;
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

        $apiEndpoint = 'https://oauth2.googleapis.com/token';
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
        $googleCalendarDetails = $flow->get(['id' => $integrationID]);
        if (is_wp_error($googleCalendarDetails)) {
            return;
        }

        $newDetails = json_decode($googleCalendarDetails[0]->flow_details);
        $newDetails->tokenDetails = $tokenDetails;
        $flow->update($integrationID, ['flow_details' => wp_json_encode($newDetails)]);
    }
}
