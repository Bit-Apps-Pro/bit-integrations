<?php

namespace BitCode\FI\Actions\Notion;

use BitCode\FI\Core\Util\HttpHelper;
use WP_Error;

class NotionController
{
    private $baseurl = 'https://api.notion.com/v1/';

    public function authorization($requestParams)
    {
        if (empty($requestParams->clientId) || empty($requestParams->clientSecret) || empty($requestParams->code) || empty($requestParams->redirectURI)) {
            wp_send_json_error(__('Requested parameter is empty', 'bit-integrations'), 400);
        }

        $body = [
            'redirect_uri' => urldecode($requestParams->redirectURI),
            'grant_type'   => 'authorization_code',
            'code'         => $requestParams->code
        ];
        $apiEndpoint = "{$this->baseurl}oauth/token";

        $clientId = $requestParams->clientId;
        $clientSecret = $requestParams->clientSecret;

        $header['Content-Type'] = 'application/json';
        $header['Authorization'] = 'Basic ' . base64_encode("{$clientId}:{$clientSecret}");

        $apiResponse = HttpHelper::post($apiEndpoint, wp_json_encode($body), $header);
        if (is_wp_error($apiResponse) || !empty($apiResponse->error)) {
            wp_send_json_error(empty($apiResponse->error_description) ? 'Unknown' : $apiResponse->error_description, 400);
        }
        $apiResponse->generates_on = time();

        wp_send_json_success($apiResponse, 200);
    }

    public function getAllDatabaseLists($requestParams)
    {
        if (empty($requestParams->accessToken)) {
            wp_send_json_error(
                __(
                    'Requested parameter is empty',
                    'bit-integrations'
                ),
                400
            );
        }
        $apiEndpoints = "{$this->baseurl}search";
        $headers = [
            'Authorization'  => 'Bearer ' . $requestParams->accessToken,
            'Notion-Version' => '2021-08-16'
        ];
        $response = HttpHelper::post($apiEndpoints, null, $headers);
        if ($response->Error !== null) {
            wp_send_json_error(
                __(
                    'Invalid token',
                    'bit-integrations'
                ),
                400
            );
        }
        wp_send_json_success($response, 200);
    }

    public function getFieldsProperties($requestParams)
    {
        if (empty($requestParams->accessToken)) {
            wp_send_json_error(
                __(
                    'Requested parameter is empty',
                    'bit-integrations'
                ),
                400
            );
        }
        $apiEndpoints = "{$this->baseurl}databases/{$requestParams->databaseId}";
        $headers = [
            'Authorization'  => 'Bearer ' . $requestParams->accessToken,
            'Notion-Version' => '2021-08-16'
        ];
        $response = HttpHelper::get($apiEndpoints, null, $headers);
        if ($response->Error !== null) {
            wp_send_json_error(
                __(
                    'Invalid token',
                    'bit-integrations'
                ),
                400
            );
        }
        wp_send_json_success($response, 200);
    }

    public function execute($integrationData, $fieldValues)
    {
        $integrationDetails = $integrationData->flow_details;
        $integId = $integrationData->id;
        $databaseId = $integrationDetails->databaseId;
        $notionFields = $integrationDetails->notionFields;
        $tokenDetails = $integrationDetails->tokenDetails;
        $accessToken = $tokenDetails->access_token;
        $tokenType = $tokenDetails->token_type;
        $field_map = $integrationDetails->field_map;

        if (
            empty($field_map) || empty($accessToken)
        ) {
            return new WP_Error('REQ_FIELD_EMPTY', wp_sprintf(__('module, fields are required for %s api', 'bit-integrations'), 'notion'));
        }

        $recordApiHelper = new RecordApiHelper($integrationDetails, $integId);

        $notionApiResponse = $recordApiHelper->execute(
            $databaseId,
            $accessToken,
            $tokenType,
            $notionFields,
            $fieldValues,
            $field_map,
        );

        if (is_wp_error($notionApiResponse)) {
            return $notionApiResponse;
        }

        return $notionApiResponse;
    }
}
