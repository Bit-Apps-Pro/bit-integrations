<?php

namespace BitCode\FI\Actions\PCloud;

use BitCode\FI\Actions\PCloud\RecordApiHelper as PCloudRecordApiHelper;
use BitCode\FI\Core\Util\HttpHelper;
use BitCode\FI\Log\LogHandler;
use WP_Error;

class PCloudController
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

        $body = [
            'client_id'     => $requestParams->clientId,
            'client_secret' => $requestParams->clientSecret,
            'code'          => $requestParams->code
        ];

        $apiEndpoint = 'https://api.pcloud.com/oauth2_token';
        $header['Content-Type'] = 'application/x-www-form-urlencoded';
        $apiResponse = HttpHelper::post($apiEndpoint, $body, $header);

        if (is_wp_error($apiResponse) || !empty($apiResponse->error)) {
            wp_send_json_error(empty($apiResponse->error) ? 'Unknown' : $apiResponse->error, 400);
        }
        $apiResponse->generates_on = time();
        wp_send_json_success($apiResponse, 200);
    }

    public static function getAllFolders($queryParams)
    {
        if (empty($queryParams->tokenDetails)) {
            wp_send_json_error(__('Requested parameter is empty', 'bit-integrations'), 400);
        }

        $apiEndpoint = 'https://api.pcloud.com/listfolder?folderid=0';
        $header['Authorization'] = 'Bearer ' . $queryParams->tokenDetails->access_token;

        $apiResponse = HttpHelper::get($apiEndpoint, null, $header);

        if (!empty($apiResponse) && !isset($apiResponse->error)) {
            foreach ($apiResponse->metadata->contents as $folder) {
                if ($folder->isfolder === true) {
                    $folders[] = [
                        'id'   => $folder->folderid,
                        'name' => $folder->name
                    ];
                }
            }
            wp_send_json_success($folders, 200);
        } else {
            wp_send_json_error(__('Folders fetching failed', 'bit-integrations'), 400);
        }
    }

    public function execute($integrationData, $fieldValues)
    {
        if (empty($integrationData->flow_details->tokenDetails->access_token)) {
            LogHandler::save($this->integrationID, wp_json_encode(['type' => 'pCloud', 'type_name' => 'file_upload']), 'error', wp_sprintf(__('Not Authorization By %s', 'bit-integrations'), 'PCloud'));

            return false;
        }

        $integrationDetails = $integrationData->flow_details;
        $actions = $integrationDetails->actions;
        $fieldMap = $integrationDetails->field_map;
        $accessToken = $integrationDetails->tokenDetails->access_token;

        if (empty($fieldMap)) {
            $error = new WP_Error('REQ_FIELD_EMPTY', __('Required fields not mapped', 'bit-integrations'));
            LogHandler::save($this->integrationID, 'record', 'validation', $error);

            return $error;
        }

        (new PCloudRecordApiHelper($accessToken))->executeRecordApi($this->integrationID, $fieldValues, $fieldMap, $actions);

        return true;
    }
}
