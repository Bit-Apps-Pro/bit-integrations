<?php

namespace BitCode\FI\Actions\OneDrive;

use BitCode\FI\Actions\OneDrive\RecordApiHelper as OneDriveRecordApiHelper;
use BitCode\FI\Core\Util\HttpHelper;
use BitCode\FI\Flow\FlowController;
use BitCode\FI\Log\LogHandler;

class OneDriveController
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
            'client_id'     => $requestParams->clientId,
            'redirect_uri'  => urldecode($requestParams->redirectURI),
            'client_secret' => $requestParams->clientSecret,
            'grant_type'    => 'authorization_code',
            'code'          => urldecode($requestParams->code)
        ];

        $apiEndpoint = 'https://login.live.com/oauth20_token.srf';
        $header['Content-Type'] = 'application/x-www-form-urlencoded';
        $apiResponse = HttpHelper::post($apiEndpoint, $body, $header);
        if (is_wp_error($apiResponse) || !empty($apiResponse->error) || HttpHelper::$responseCode !== 200) {
            wp_send_json_error(empty($apiResponse->error_description) ? 'Unknown' : $apiResponse->error_description, 400);
        }
        $apiResponse->generates_on = time();
        wp_send_json_success($apiResponse, 200);
    }

    public static function getAllFolders($queryParams)
    {
        if (empty($queryParams->tokenDetails) || empty($queryParams->clientId) || empty($queryParams->clientSecret)) {
            wp_send_json_error(__('Requested parameter is empty', 'bit-integrations'), 400);
        }

        $token = self::tokenExpiryCheck($queryParams->tokenDetails, $queryParams->clientId, $queryParams->clientSecret);
        if ($token->access_token !== $queryParams->tokenDetails->access_token) {
            self::saveRefreshedToken($queryParams->flowID, $token);
        }

        $folders = self::getOneDriveFoldersList($token->access_token);
        $foldersOnly = $folders->value;

        $data = [];
        if (\is_array($foldersOnly)) {
            foreach ($foldersOnly as $folder) {
                if (property_exists($folder, 'folder')) {
                    $data[] = $folder;
                }
            }
        }
        $response['oneDriveFoldersList'] = $data;
        $response['tokenDetails'] = $token;
        wp_send_json_success($response, 200);
    }

    public static function getOneDriveFoldersList($token)
    {
        $headers = [
            'Accept'        => 'application/json',
            'Content-Type'  => 'application/json;',
            'Authorization' => 'bearer ' . $token,
        ];
        $apiEndpoint = 'https://api.onedrive.com/v1.0/drive/root/children';
        $apiResponse = HttpHelper::get($apiEndpoint, [], $headers);
        if (is_wp_error($apiResponse) || !empty($apiResponse->error)) {
            return false;
        }

        return $apiResponse;
    }

    public static function singleOneDriveFolderList($queryParams)
    {
        if (empty($queryParams->tokenDetails) || empty($queryParams->clientId) || empty($queryParams->clientSecret)) {
            wp_send_json_error(__('Requested parameter is empty', 'bit-integrations'), 400);
        }

        $ids = explode('!', $queryParams->folder);
        $token = self::tokenExpiryCheck($queryParams->tokenDetails, $queryParams->clientId, $queryParams->clientSecret);
        if ($token->access_token !== $queryParams->tokenDetails->access_token) {
            self::saveRefreshedToken($queryParams->flowID, $token);
        }

        $headers = [
            'Accept'        => 'application/json',
            'Content-Type'  => 'application/json;',
            'Authorization' => 'bearer ' . $queryParams->tokenDetails->access_token,
        ];
        $apiEndpoint = 'https://api.onedrive.com/v1.0/drives/' . $ids[0] . '/items/' . $queryParams->folder . '/children';
        $apiResponse = HttpHelper::get($apiEndpoint, [], $headers);
        $foldersOnly = $apiResponse->value;
        $data = [];
        if (\is_array($foldersOnly)) {
            foreach ($foldersOnly as $folder) {
                if (property_exists($folder, 'folder')) {
                    $data[] = $folder;
                }
            }
        }
        $response['folders'] = $data;
        $response['tokenDetails'] = $token;
        wp_send_json_success($response, 200);
    }

    public function execute($integrationData, $fieldValues)
    {
        if (empty($integrationData->flow_details->tokenDetails->access_token)) {
            LogHandler::save($this->integrationID, wp_json_encode(['type' => 'oneDrive', 'type_name' => 'file_upload']), 'error', wp_sprintf(__('Not Authorization By %s', 'bit-integrations'), 'OneDrive'));

            return false;
        }

        $integrationDetails = $integrationData->flow_details;
        $actions = $integrationDetails->actions;
        $folderId = $integrationDetails->folder;
        // $fieldMap = $integrationDetails->field_map;
        $tokenDetails = self::tokenExpiryCheck($integrationDetails->tokenDetails, $integrationDetails->clientId, $integrationDetails->clientSecret);
        // folderMap need check
        $parentId = $integrationData->flow_details->folderMap[1];
        $fieldMap = null;
        if ($tokenDetails->access_token !== $integrationDetails->tokenDetails->access_token) {
            self::saveRefreshedToken($this->integrationID, $tokenDetails);
        }

        (new OneDriveRecordApiHelper($tokenDetails->access_token))->executeRecordApi($this->integrationID, $fieldValues, $fieldMap, $actions, $folderId, $parentId);

        return true;
    }

    private static function tokenExpiryCheck($token, $clientId, $clientSecret)
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

    private static function refreshToken($refresh_token, $clientId, $clientSecret)
    {
        $body = [
            'client_id'     => $clientId,
            'client_secret' => $clientSecret,
            'grant_type'    => 'refresh_token',
            'refresh_token' => $refresh_token,
        ];

        $apiEndpoint = 'https://login.live.com/oauth20_token.srf';
        $apiResponse = HttpHelper::post($apiEndpoint, $body);
        if (is_wp_error($apiResponse) || !empty($apiResponse->error)) {
            return false;
        }
        $token = $apiResponse;
        $token->generates_on = time();

        return $token;
    }

    private static function saveRefreshedToken($integrationID, $tokenDetails)
    {
        if (empty($integrationID)) {
            return;
        }

        $flow = new FlowController();
        $googleDriveDetails = $flow->get(['id' => $integrationID]);
        if (is_wp_error($googleDriveDetails)) {
            return;
        }

        $newDetails = json_decode($googleDriveDetails[0]->flow_details);
        $newDetails->tokenDetails = $tokenDetails;
        $flow->update($integrationID, ['flow_details' => wp_json_encode($newDetails)]);
    }
}
