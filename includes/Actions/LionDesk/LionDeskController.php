<?php

/**
 * LionDesk Integration
 */

namespace BitCode\FI\Actions\LionDesk;

use BitCode\FI\Core\Util\HttpHelper;
use WP_Error;

/**
 * Provide functionality for LionDesk integration
 */
class LionDeskController
{
    protected $_defaultHeader;

    protected $apiEndpoint;

    public function __construct()
    {
        $this->apiEndpoint = 'https://api-v2.liondesk.com/';
    }

    /**
     * Process ajax request for generate_token
     *
     * @param $requestsParams Mandatory params for generate tokens
     *
     * @return JSON LionDesk api response and status
     */
    public function generateTokens($requestsParams)
    {
        if (
            empty($requestsParams->clientId)
            || empty($requestsParams->clientSecret)
            || empty($requestsParams->redirectURI)
            || empty($requestsParams->code)
        ) {
            wp_send_json_error(
                __(
                    'Requested parameter is empty',
                    'bit-integrations'
                ),
                400
            );
        }
        $apiEndpoint = $this->apiEndpoint . '/oauth2/token';
        $requestParams = [
            'grant_type'    => 'authorization_code',
            'client_id'     => $requestsParams->clientId,
            'client_secret' => $requestsParams->clientSecret,
            'redirect_uri'  => urldecode($requestsParams->redirectURI),
            'code'          => $requestsParams->code
        ];
        $apiResponse = HttpHelper::post($apiEndpoint, $requestParams);
        if (is_wp_error($apiResponse) || !empty($apiResponse->error)) {
            wp_send_json_error(
                empty($apiResponse->error) ? 'Unknown' : $apiResponse->error,
                400
            );
        }
        $apiResponse->generates_on = time();
        wp_send_json_success($apiResponse, 200);
    }

    public function getCustomFields($fieldsRequestParams)
    {
        $response = [];
        if (strtotime($fieldsRequestParams->token_details->expires) < time()) {
            $response['tokenDetails'] = $this->_refreshAccessToken($fieldsRequestParams);
            $fieldsRequestParams->token_details = $response['tokenDetails'];
        }

        $this->checkValidation($fieldsRequestParams);
        $access_token = $fieldsRequestParams->token_details->access_token;
        $apiEndpoint = $this->apiEndpoint . '/custom-fields';
        $headers = $this->setHeaders($access_token);
        $response = HttpHelper::get($apiEndpoint, null, $headers);
        if (isset($response)) {
            if (isset($response->data)) {
                foreach ($response->data as $customField) {
                    $customFields[] = [
                        'key'   => $customField->id,
                        'label' => $customField->name,
                    ];
                }
                wp_send_json_success($customFields, 200);
            } else {
                wp_send_json_error($response->message, 400);
            }
        } else {
            wp_send_json_error(__('Custom field fetching failed', 'bit-integrations'), 400);
        }
    }

    public function getAllTags($fieldsRequestParams)
    {
        $response = [];
        if (strtotime($fieldsRequestParams->token_details->expires) < time()) {
            $response['tokenDetails'] = $this->_refreshAccessToken($fieldsRequestParams);
            $fieldsRequestParams->token_details = $response['tokenDetails'];
        }

        $this->checkValidation($fieldsRequestParams);
        $access_token = $fieldsRequestParams->token_details->access_token;
        $apiEndpoint = $this->apiEndpoint . '/tags';
        $headers = $this->setHeaders($access_token);
        $response = HttpHelper::get($apiEndpoint, null, $headers);

        if (isset($response)) {
            if (isset($response->data)) {
                foreach ($response->data as $tag) {
                    $tags[] = [
                        'tag' => $tag->content
                    ];
                }
                wp_send_json_success($tags, 200);
            } else {
                wp_send_json_error($response->message, 400);
            }
        } else {
            wp_send_json_error(__('Tags fetching failed', 'bit-integrations'), 400);
        }
    }

    public function execute($integrationData, $fieldValues)
    {
        $integrationDetails = $integrationData->flow_details;
        $integId = $integrationData->id;
        $tokenDetails = $integrationDetails->tokenDetails;
        $fieldMap = $integrationDetails->field_map;
        $actionName = $integrationDetails->actionName;

        if (empty($fieldMap) || empty($tokenDetails) || empty($actionName)) {
            return new WP_Error('REQ_FIELD_EMPTY', wp_sprintf(__('module, fields are required for %s api', 'bit-integrations'), 'LionDesk'));
        }

        $response = [];
        if (strtotime($tokenDetails->expires) < time()) {
            $response['tokenDetails'] = $this->_refreshAccessToken($tokenDetails);
            $tokenDetails = $response['tokenDetails'];
        }

        $recordApiHelper = new RecordApiHelper($integrationDetails, $integId, $tokenDetails);
        $lionDeskApiResponse = $recordApiHelper->execute($fieldValues, $fieldMap, $actionName);

        if (is_wp_error($lionDeskApiResponse)) {
            return $lionDeskApiResponse;
        }

        return $lionDeskApiResponse;
    }

    /**
     * Helps to refresh LionDesk access_token
     *
     * @param object $apiData Contains required data for refresh access token
     *
     * @return JSON $tokenDetails API token details
     */
    protected function _refreshAccessToken($apiData)
    {
        if (
            empty($apiData->client_id)
            || empty($apiData->client_secret)
            || empty($apiData->token_details)
            || empty($apiData->redirect_uri)
        ) {
            return false;
        }

        $apiEndpoint = $this->apiEndpoint . '/oauth2/token';
        $requestParams = [
            'refresh_token' => $apiData->token_details->refresh_token,
            'client_id'     => $apiData->client_id,
            'client_secret' => $apiData->client_secret,
            'redirect_uri'  => $apiData->redirect_uri,
            'grant_type'    => 'refresh_token',
        ];

        $apiResponse = HttpHelper::post($apiEndpoint, $requestParams);
        if (is_wp_error($apiResponse) || !empty($apiResponse->error)) {
            wp_send_json_error(
                empty($apiResponse->error) ? 'Unknown' : $apiResponse->error,
                400
            );
        }

        $apiResponse->generates_on = time();

        return $apiResponse;
    }

    private function checkValidation($fieldsRequestParams, $customParam = '**')
    {
        if (empty($fieldsRequestParams->token_details->access_token) || empty($customParam)) {
            wp_send_json_error(__('Requested parameter is empty', 'bit-integrations'), 400);
        }
    }

    private function setHeaders($access_token)
    {
        return [
            'Authorization' => "Bearer {$access_token}",
            'Content-Type'  => 'application/json'
        ];
    }
}
