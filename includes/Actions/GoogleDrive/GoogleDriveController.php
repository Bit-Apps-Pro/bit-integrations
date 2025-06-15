<?php

namespace BitCode\FI\Actions\GoogleDrive;

use BitCode\FI\Actions\GoogleDrive\RecordApiHelper as GoogleDriveRecordApiHelper;
use BitCode\FI\Core\Util\HttpHelper;
use BitCode\FI\Flow\FlowController;
use BitCode\FI\Log\LogHandler;
use WP_Error;

class GoogleDriveController
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

    public static function getAllFolders($queryParams)
    {
        if (empty($queryParams->tokenDetails) || empty($queryParams->clientId) || empty($queryParams->clientSecret)) {
            wp_send_json_error(__('Requested parameter is empty', 'bit-integrations'), 400);
        }

        $token = self::tokenExpiryCheck($queryParams->tokenDetails, $queryParams->clientId, $queryParams->clientSecret);
        if ($token->access_token !== $queryParams->tokenDetails->access_token) {
            self::saveRefreshedToken($queryParams->flowID, $token);
        }

        $folders = self::getGoogleDriveFoldersList($token->access_token);
        $folders = self::getPathFromParentId($folders->files);

        $data = [];
        if (\is_array($folders)) {
            foreach ($folders as $folder) {
                $data[] = (object) [
                    'id'   => $folder->id,
                    'name' => $folder->name,
                ];
            }
        }

        $response['googleDriveFoldersList'] = $data;
        $response['tokenDetails'] = $token;
        wp_send_json_success($response, 200);
    }

    public static function getGoogleDriveFoldersList($token)
    {
        $headers = [
            'Accept'        => 'application/json',
            'Content-Type'  => 'application/json;',
            'Authorization' => 'Bearer ' . $token,
        ];
        // for only root folder: and 'root' in parents
        $apiEndpoint = "https://www.googleapis.com/drive/v3/files?q=mimeType='application/vnd.google-apps.folder' and trashed=false&fields=files(id,name,parents)";
        $apiResponse = HttpHelper::get($apiEndpoint, [], $headers);
        if (is_wp_error($apiResponse) || !empty($apiResponse->error)) {
            return false;
        }

        return $apiResponse;
    }

    public function execute($integrationData, $fieldValues)
    {
        if (empty($integrationData->flow_details->tokenDetails->access_token)) {
            LogHandler::save($this->integrationID, wp_json_encode(['type' => 'googleDrive', 'type_name' => 'file_upload']), 'error', wp_sprintf(__('Not Authorization By %s', 'bit-integrations'), 'GoogleDrive'));

            return false;
        }

        $integrationDetails = $integrationData->flow_details;
        $actions = $integrationDetails->actions;
        $fieldMap = $integrationDetails->field_map;
        $tokenDetails = self::tokenExpiryCheck($integrationDetails->tokenDetails, $integrationDetails->clientId, $integrationDetails->clientSecret);
        if ($tokenDetails->access_token !== $integrationDetails->tokenDetails->access_token) {
            self::saveRefreshedToken($this->integrationID, $tokenDetails);
        }

        if (empty($fieldMap)) {
            $error = new WP_Error('REQ_FIELD_EMPTY', __('Required fields not mapped', 'bit-integrations'));
            LogHandler::save($this->integrationID, 'record', 'validation', $error);

            return $error;
        }

        (new GoogleDriveRecordApiHelper($tokenDetails->access_token))->executeRecordApi($this->integrationID, $fieldValues, $fieldMap, $actions);

        return true;
    }

    protected static function getPathFromParentId($folders)
    {
        $newFolders = [];
        foreach ($folders as $folder) {
            $parentName = self::getParentName($folders, $folder->parents[0]);
            if (!empty($parentName)) {
                $folder->name = $parentName . ' > ' . $folder->name;
            }
            $newFolders[] = $folder;
        }

        return $newFolders;
    }

    protected static function getParentName($folders, $parentId)
    {
        $parentName = '';
        foreach ($folders as $folder) {
            if ($folder->id == $parentId) {
                $parentName = $folder->name;
                $tempName = self::getParentName($folders, $folder->parents[0]);
                if (!empty($tempName)) {
                    $parentName = $tempName . ' > ' . $parentName;
                }

                break;
            }
        }

        return $parentName;
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
