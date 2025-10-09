<?php

namespace BitCode\FI\Actions\OneDrive;

use BitCode\FI\Actions\OneDrive\RecordApiHelper as OneDriveRecordApiHelper;
use BitCode\FI\Core\Util\HttpHelper;
use BitCode\FI\Flow\FlowController;
use BitCode\FI\Log\LogHandler;
use stdClass;

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
        $parentId = isset($integrationData->flow_details->folderMap[1]) ? $integrationData->flow_details->folderMap[1] : null;
        $fieldMap = null;
        if ($tokenDetails->access_token !== $integrationDetails->tokenDetails->access_token) {
            self::saveRefreshedToken($this->integrationID, $tokenDetails);
        }

        // If create_folder is enabled, resolve name and path, then find or create that folder
        if (isset($actions->create_folder) && $actions->create_folder) {
            $resolvedFolderName = self::resolveCreateFolderName($actions, $fieldValues);
            $resolvedFolderPath = self::resolveCreateFolderPath($actions, $fieldValues);

            if (empty($resolvedFolderName)) {
                LogHandler::save($this->integrationID, wp_json_encode(['type' => 'OneDrive', 'type_name' => 'folder_creation']), 'error', __('Folder name is empty. Cannot create or find folder.', 'bit-integrations'));

                return false;
            }

            // Use path-based approach if path is provided, otherwise use the original method
            if (!empty($resolvedFolderPath)) {
                // Check if folder exists at specific path
                $targetFolderId = self::checkFolderExistsByPath($tokenDetails->access_token, $resolvedFolderPath, $resolvedFolderName);

                if (!$targetFolderId) {
                    // Folder doesn't exist, create it at the specified path
                    $targetFolderId = self::createFolderByPath($tokenDetails->access_token, $resolvedFolderPath, $resolvedFolderName);
                }
            } else {
                // Use original method for name-only approach
                $parentRef = !empty($integrationDetails->folder) ? $integrationDetails->folder : 'root';
                $targetFolderId = self::findOrCreateFolderV1($tokenDetails->access_token, $parentRef, $resolvedFolderName);
            }

            if ($targetFolderId) {
                $folderId = $targetFolderId;
                $parentId = $targetFolderId;
            } else {
                LogHandler::save($this->integrationID, wp_json_encode(['type' => 'OneDrive', 'type_name' => 'folder_creation']), 'error', __('Failed to create or find specified folder.', 'bit-integrations'));

                return false;
            }
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

    private static function resolveCreateFolderName($actions, $fieldValues)
    {
        // Preferred: explicit static name from UI
        if (!empty($actions->create_folder_name)) {
            return trim((string) $actions->create_folder_name);
        }

        // Fallback: field map - look for field with target 'name'
        if (!empty($actions->create_folder_field_map) && \is_array($actions->create_folder_field_map)) {
            foreach ($actions->create_folder_field_map as $row) {
                if (!empty($row->target) && $row->target === 'name') {
                    // custom
                    if (!empty($row->formField) && $row->formField === 'custom') {
                        return trim((string) ($row->customValue ?? ''));
                    }
                    // form field
                    if (!empty($row->formField) && isset($fieldValues->{$row->formField})) {
                        $val = $fieldValues->{$row->formField};
                        if (\is_array($val)) {
                            $val = implode(' ', array_filter(array_map('strval', $val)));
                        }

                        return trim((string) $val);
                    }
                }
            }
        }

        return '';
    }

    private static function resolveCreateFolderPath($actions, $fieldValues)
    {
        // Check if field map has path information
        if (!empty($actions->create_folder_field_map) && \is_array($actions->create_folder_field_map)) {
            foreach ($actions->create_folder_field_map as $row) {
                if (!empty($row->target) && $row->target === 'path') {
                    // custom path
                    if (!empty($row->formField) && $row->formField === 'custom') {
                        return trim((string) ($row->customValue ?? ''));
                    }
                    // form field path
                    if (!empty($row->formField) && isset($fieldValues->{$row->formField})) {
                        $val = $fieldValues->{$row->formField};
                        if (\is_array($val)) {
                            $val = implode(' ', array_filter(array_map('strval', $val)));
                        }

                        return trim((string) $val);
                    }
                }
            }
        }

        return '';
    }

    private static function checkFolderExistsByPath($token, $folderPath, $folderName)
    {
        $headers = [
            'Accept'        => 'application/json',
            'Content-Type'  => 'application/json;',
            'Authorization' => 'bearer ' . $token,
        ];

        // Construct the path-based endpoint
        $fullPath = !empty($folderPath) ? $folderPath . '/' . $folderName : $folderName;
        $apiEndpoint = 'https://api.onedrive.live.com/v1.0/drive/root:/' . $fullPath;

        $apiResponse = HttpHelper::get($apiEndpoint, [], $headers);

        error_log(print_r($apiResponse, true));

        if (!is_wp_error($apiResponse) && empty($apiResponse->error) && !empty($apiResponse->id)) {
            return $apiResponse->id; // Folder exists, return its ID
        }

        return false; // Folder doesn't exist
    }

    private static function createFolderByPath($token, $folderPath, $folderName)
    {
        $headers = [
            'Accept'        => 'application/json',
            'Content-Type'  => 'application/json;',
            'Authorization' => 'bearer ' . $token,
        ];

        // Determine parent folder for creation
        if (!empty($folderPath)) {
            // Create in specific path
            $parentEndpoint = 'https://api.onedrive.live.com/v1.0/drive/root:/' . $folderPath;
            $parentResponse = HttpHelper::get($parentEndpoint, [], $headers);

            if (is_wp_error($parentResponse) || !empty($parentResponse->error)) {
                return false; // Parent path doesn't exist
            }

            $createEndpoint = 'https://api.onedrive.live.com/v1.0/drive/items/' . $parentResponse->id . '/children';
        } else {
            // Create in root
            $createEndpoint = 'https://api.onedrive.live.com/v1.0/drive/root/children';
        }

        $body = [
            'name'   => $folderName,
            'folder' => new stdClass(),
        ];

        $createResponse = HttpHelper::post($createEndpoint, wp_json_encode($body), $headers);
        if (!is_wp_error($createResponse) && empty($createResponse->error) && !empty($createResponse->id)) {
            return $createResponse->id;
        }

        return false;
    }

    private static function findOrCreateFolderV1($token, $parentRef, $folderName)
    {
        $headers = [
            'Accept'        => 'application/json',
            'Content-Type'  => 'application/json;',
            'Authorization' => 'bearer ' . $token,
        ];

        // 1) List children under parent and try to find by exact name
        if ($parentRef === 'root') {
            $listEndpoint = 'https://graph.microsoft.com/v1.0/me/drive/root/children';
        } else {
            // $parentRef looks like "{driveId}!{itemId}" or just itemId
            $ids = explode('!', $parentRef);
            if (!empty($ids[0]) && !empty($ids[1])) {
                $listEndpoint = 'https://graph.microsoft.com/v1.0/me/drive/items/' . $ids[1] . '/children';
            } else {
                // fallback to single itemId format
                $listEndpoint = 'https://graph.microsoft.com/v1.0/me/drive/items/' . $parentRef . '/children';
            }
        }

        $listResponse = HttpHelper::get($listEndpoint, [], $headers);
        if (!is_wp_error($listResponse) && empty($listResponse->error) && !empty($listResponse->value) && \is_array($listResponse->value)) {
            foreach ($listResponse->value as $item) {
                if (!empty($item->folder) && isset($item->name) && $item->name === $folderName) {
                    return $item->id;
                }
            }
        }

        // 2) Not found -> create folder under parent
        $body = [
            'name'   => $folderName,
            'folder' => new stdClass(),
        ];

        if ($parentRef === 'root') {
            $createEndpoint = 'https://graph.microsoft.com/v1.0/me/drive/root/children';
        } else {
            $ids = explode('!', $parentRef);
            if (!empty($ids[0]) && !empty($ids[1])) {
                $createEndpoint = 'https://graph.microsoft.com/v1.0/me/drive/items/' . $ids[1] . '/children';
            } else {
                $createEndpoint = 'https://graph.microsoft.com/v1.0/me/drive/items/' . $parentRef . '/children';
            }
        }

        $createResponse = HttpHelper::post($createEndpoint, wp_json_encode($body), $headers);
        if (!is_wp_error($createResponse) && empty($createResponse->error) && !empty($createResponse->id)) {
            return $createResponse->id;
        }

        return false;
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
