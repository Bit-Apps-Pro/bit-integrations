<?php

namespace BitApps\BTCBI\Http\Services\Actions\Lemlist;

use WP_Error;
use BitApps\BTCBI\Http\Controllers\FlowController;
use BitApps\BTCBI\Http\Services\Actions\Lemlist\RecordApiHelper;
use BTCBI\Deps\BitApps\WPKit\Http\Client\Http;
use BTCBI\Deps\BitApps\WPKit\Http\Response;

class LemlistController
{
    private $integrationID;

    public function __construct($integrationID)
    {
        $this->integrationID = $integrationID;
    }

    public static function authorization($requestParams)
    {
        if (empty($requestParams->api_key)) {
            return Response::error(__('Requested parameter is empty', 'bit-integrations'), 400);
        }

        $apiEndpoint = "https://api.lemlist.com/api/team";
        $header["Authorization"] = 'Basic ' . base64_encode(":$requestParams->api_key");
        $response = Http::request($apiEndpoint, 'Get', null, $header);

        if (!isset($response->_id)) {
            return Response::error(
                empty($response) ? 'Unknown' : $response,
                400
            );
        }
        return Response::success(true);
    }

    public static function getAllCampaign($requestParams)
    {
        if (empty($requestParams->api_key)) {
            return Response::error(__('Requested parameter is empty', 'bit-integrations'), 400);
        }

        $header["Authorization"] = 'Basic ' . base64_encode(":$requestParams->api_key");
        $apiEndpoint = 'https://api.lemlist.com/api/campaigns';
        $apiResponse = Http::request($apiEndpoint, 'Get', null, $header);
        $campaigns       = [];

        foreach ($apiResponse as $item) {
            $campaigns[] = [
                'campaignId' => $item->_id,
                'campaignName'   => $item->name
            ];
        }

        if ((count($campaigns)) > 0) {
            return Response::success($campaigns);
        } else {
            return Response::error('Campaign fetching failed', 400);
        }
    }

    public function execute($integrationData, $fieldValues)
    {
        $integrationDetails = $integrationData->flow_details;
        $integId            = $integrationData->id;
        $selectedCampaign       = $integrationDetails->campaignId;
        $actions            = $integrationDetails->actions;
        $fieldMap           = $integrationDetails->field_map;
        $apiKey             = $integrationDetails->api_key;

        if (empty($fieldMap) || empty($apiKey) || empty($selectedCampaign)) {
            return new WP_Error('REQ_FIELD_EMPTY', __('module, fields are required for Lemlist api', 'bit-integrations'));
        }

        $recordApiHelper    = new RecordApiHelper($integrationDetails, $integId, $apiKey);
        $lemlistApiResponse = $recordApiHelper->execute(
            $selectedCampaign,
            $fieldValues,
            $fieldMap,
            $actions
        );
        if (is_wp_error($lemlistApiResponse) || isset($lemlistApiResponse->_id)) {
            return $lemlistApiResponse;
        }

        return $lemlistApiResponse;
    }
}