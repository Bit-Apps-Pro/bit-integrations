<?php

namespace BitCode\FI\Actions\Dropbox;

use BitCode\FI\Actions\Dropbox\RecordApiHelper as DropboxRecordApiHelper;
use BitCode\FI\Core\Util\HttpHelper;
use BitCode\FI\Flow\FlowController;
use BitCode\FI\Log\LogHandler;
use WP_Error;

class DropboxController
{
    protected static $apiBaseUri = 'https://api.dropboxapi.com';

    private $integrationID;

    public function __construct($integrationID)
    {
        $this->integrationID = $integrationID;
    }

    public static function checkAuthorization($tokenRequestParams)
    {
        if (empty($tokenRequestParams->accessCode) || empty($tokenRequestParams->clientId) || empty($tokenRequestParams->clientSecret)) {
            wp_send_json_error(__('Requested parameter is empty', 'bit-integrations'), 400);
        }

        $body = [
            'code'          => $tokenRequestParams->accessCode,
            'grant_type'    => 'authorization_code',
            'client_id'     => $tokenRequestParams->clientId,
            'client_secret' => $tokenRequestParams->clientSecret,
        ];

        $apiEndpoint = self::$apiBaseUri . '/oauth2/token';
        $apiResponse = HttpHelper::post($apiEndpoint, $body);

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

        $folders = self::getDropboxFoldersList($token->access_token);
        $data = [];
        if ($folders->entries) {
            foreach ($folders->entries as $folder) {
                $folder = (array) $folder;
                if ($folder['.tag'] == 'folder') {
                    $data[] = (object) [
                        'name'       => $folder['name'],
                        'lower_path' => $folder['path_lower'],
                    ];
                }
            }
        }

        $response['dropboxFoldersList'] = $data;
        $response['tokenDetails'] = $token;
        wp_send_json_success($response, 200);
    }

    public static function getDropboxFoldersList($token)
    {
        $headers = [
            'Content-Type'  => 'application/json; charset=utf-8',
            'Authorization' => 'Bearer ' . $token,
        ];
        $options = [
            'path'                           => '',
            'recursive'                      => true,
            'include_deleted'                => false,
            'include_mounted_folders'        => true,
            'include_non_downloadable_files' => true
        ];
        $options = wp_json_encode($options);

        $apiEndpoint = self::$apiBaseUri . '/2/files/list_folder';
        $apiResponse = HttpHelper::post($apiEndpoint, $options, $headers);
        if (is_wp_error($apiResponse) || !empty($apiResponse->error)) {
            return false;
        }

        return $apiResponse;
    }

    public function execute($integrationData, $fieldValues)
    {
        if (empty($integrationData->flow_details->tokenDetails->access_token)) {
            LogHandler::save($this->integrationID, wp_json_encode(['type' => 'dropbox', 'type_name' => 'file_upload']), 'error', wp_sprintf(__('Not Authorization By %s', 'bit-integrations'), 'Dropbox'));

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
            LogHandler::save($this->_integrationID, 'record', 'validation', $error);

            return $error;
        }

        return (new DropboxRecordApiHelper($tokenDetails->access_token))->executeRecordApi($this->integrationID, $fieldValues, $fieldMap, $actions);
    }

    private static function tokenExpiryCheck($token, $clientId, $clientSecret)
    {
        if (!$token) {
            return false;
        }

        if (($token->generates_on + $token->expires_in - 30) < time()) {
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

        $apiEndpoint = self::$apiBaseUri . '/oauth2/token';
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
        $dropboxDetails = $flow->get(['id' => $integrationID]);
        if (is_wp_error($dropboxDetails)) {
            return;
        }

        $newDetails = json_decode($dropboxDetails[0]->flow_details);
        $newDetails->tokenDetails = $tokenDetails;
        $flow->update($integrationID, ['flow_details' => wp_json_encode($newDetails)]);
    }
}
