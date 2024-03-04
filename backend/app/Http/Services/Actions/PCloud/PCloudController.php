<?php

namespace BitApps\BTCBI\Http\Services\Actions\PCloud;

use BitApps\BTCBI\Http\Services\Actions\PCloud\RecordApiHelper as PCloudRecordApiHelper;
use BTCBI\Deps\BitApps\WPKit\Http\Client\Http;
use BitApps\BTCBI\Http\Services\Log\LogHandler;
use BTCBI\Deps\BitApps\WPKit\Http\Response;
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
            return Response::error(__('Requested parameter is empty', 'bit-integrations'), 400);
        }

        $body = [
            'client_id'     => $requestParams->clientId,
            'client_secret' => $requestParams->clientSecret,
            'code'          => $requestParams->code
        ];

        $apiEndpoint            = 'https://api.pcloud.com/oauth2_token';
        $header['Content-Type'] = 'application/x-www-form-urlencoded';
        $apiResponse            = Http::request($apiEndpoint, 'Post', $body, $header);

        if (is_wp_error($apiResponse) || !empty($apiResponse->error)) {
            return Response::error(empty($apiResponse->error) ? 'Unknown' : $apiResponse->error, 400);
        }
        $apiResponse->generates_on = \time();
        return Response::success($apiResponse);
    }

    public static function getAllFolders($queryParams)
    {
        if (empty($queryParams->tokenDetails)) {
            return Response::error(__('Requested parameter is empty', 'bit-integrations'), 400);
        }

        $apiEndpoint             = 'https://api.pcloud.com/listfolder?folderid=0';
        $header['Authorization'] = 'Bearer ' . $queryParams->tokenDetails->access_token;

        $apiResponse = Http::request($apiEndpoint, 'Get', null, $header);

        if (!empty($apiResponse) && !isset($apiResponse->error)) {
            foreach ($apiResponse->metadata->contents as $folder) {
                if ($folder->isfolder === true) {
                    $folders[] = [
                        'id'   => $folder->folderid,
                        'name' => $folder->name
                    ];
                }
            }
            return Response::success($folders);
        } else {
            return Response::error('Folders fetching failed', 400);
        }
    }

    public function execute($integrationData, $fieldValues)
    {
        if (empty($integrationData->flow_details->tokenDetails->access_token)) {
            LogHandler::save($this->integrationID, wp_json_encode(['type' => 'pCloud', 'type_name' => 'file_upload']), 'error', 'Not Authorization By PCloud.');
            return false;
        }

        $integrationDetails = $integrationData->flow_details;
        $actions            = $integrationDetails->actions;
        $fieldMap           = $integrationDetails->field_map;
        $accessToken        = $integrationDetails->tokenDetails->access_token;

        if (empty($fieldMap)) {
            $error = new WP_Error('REQ_FIELD_EMPTY', __('Required fields not mapped', 'bit-integrations'));
            LogHandler::save($this->integrationID, 'record', 'validation', $error);
            return $error;
        }

        (new PCloudRecordApiHelper($accessToken))->executeRecordApi($this->integrationID, $fieldValues, $fieldMap, $actions);
        return true;
    }
}