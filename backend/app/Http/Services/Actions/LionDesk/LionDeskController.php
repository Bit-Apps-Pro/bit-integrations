<?php

/**
 * LionDesk Integration
 */

namespace BitApps\BTCBI\Http\Services\Actions\LionDesk;

use WP_Error;
use BTCBI\Deps\BitApps\WPKit\Http\Client\Http;
use BTCBI\Deps\BitApps\WPKit\Http\Response;

/**
 * Provide functionality for LionDesk integration
 */
class LionDeskController
{
    protected $_defaultHeader;
    protected $apiEndpoint;

    public function __construct()
    {
        $this->apiEndpoint = "https://api-v2.liondesk.com/";
    }

    private function checkValidation($fieldsRequestParams, $customParam = '**')
    {
        if (empty($fieldsRequestParams->token_details->access_token) || empty($customParam)) {
            Response::error(__('Requested parameter is empty', 'bit-integrations'), 400);
        }
    }

    private function setHeaders($access_token)
    {
        return [
            "Authorization"     => "Bearer $access_token",
            "Content-Type"      => "application/json"
        ];
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
            Response::error(
                __(
                    'Requested parameter is empty',
                    'bit-integrations'
                ),
                400
            );
        }
        $apiEndpoint = $this->apiEndpoint . '/oauth2/token';
        $requestParams = array(
            "grant_type"    => "authorization_code",
            "client_id"     => $requestsParams->clientId,
            "client_secret" => $requestsParams->clientSecret,
            "redirect_uri"  => \urldecode($requestsParams->redirectURI),
            "code"          => $requestsParams->code
        );
        $apiResponse = Http::request($apiEndpoint, 'Post', $requestParams);
        if (is_wp_error($apiResponse) || !empty($apiResponse->error)) {
            Response::error(
                empty($apiResponse->error) ? 'Unknown' : $apiResponse->error,
                400
            );
        }
        $apiResponse->generates_on = \time();
        Response::success($apiResponse);
    }

    /**
     * Helps to refresh LionDesk access_token
     *
     * @param Object $apiData Contains required data for refresh access token
     *
     * @return JSON  $tokenDetails API token details
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

        $apiEndpoint = $this->apiEndpoint . "/oauth2/token";
        $requestParams = array(
            "refresh_token" => $apiData->token_details->refresh_token,
            "client_id"     => $apiData->client_id,
            "client_secret" => $apiData->client_secret,
            "redirect_uri"  => $apiData->redirect_uri,
            "grant_type"    => "refresh_token",
        );

        $apiResponse = Http::request($apiEndpoint, 'Post', $requestParams);
        if (is_wp_error($apiResponse) || !empty($apiResponse->error)) {
            Response::error(
                empty($apiResponse->error) ? 'Unknown' : $apiResponse->error,
                400
            );
        }

        $apiResponse->generates_on = \time();
        return $apiResponse;
    }

    public function getCustomFields($fieldsRequestParams)
    {
        $response = [];
        if (strtotime($fieldsRequestParams->token_details->expires) < time()) {
            $response['tokenDetails']           = $this->_refreshAccessToken($fieldsRequestParams);
            $fieldsRequestParams->token_details = $response['tokenDetails'];
        }

        $this->checkValidation($fieldsRequestParams);
        $access_token   = $fieldsRequestParams->token_details->access_token;
        $apiEndpoint    = $this->apiEndpoint . "/custom-fields";
        $headers        = $this->setHeaders($access_token);
        $response       = Http::request($apiEndpoint, 'Get', null, $headers);
        if (isset($response)) {
            if (isset($response->data)) {
                foreach ($response->data as $customField) {
                    $customFields[] = [
                        'key' => $customField->id,
                        'label' => $customField->name,
                    ];
                }
                Response::success($customFields);
            } else {
                Response::error($response->message, 400);
            }
        } else {
            Response::error('Custom field fetching failed', 400);
        }
    }

    public function getAllTags($fieldsRequestParams)
    {
        $response = [];
        if (strtotime($fieldsRequestParams->token_details->expires) < time()) {
            $response['tokenDetails']           = $this->_refreshAccessToken($fieldsRequestParams);
            $fieldsRequestParams->token_details = $response['tokenDetails'];
        }

        $this->checkValidation($fieldsRequestParams);
        $access_token      = $fieldsRequestParams->token_details->access_token;
        $apiEndpoint       = $this->apiEndpoint . "/tags";
        $headers           = $this->setHeaders($access_token);
        $response          = Http::request($apiEndpoint, 'Get', null, $headers);

        if (isset($response)) {
            if (isset($response->data)) {
                foreach ($response->data as $tag) {
                    $tags[] = [
                        'tag' => $tag->content
                    ];
                }
                Response::success($tags);
            } else {
                Response::error($response->message, 400);
            }
        } else {
            Response::error('Tags fetching failed', 400);
        }
    }

    public function execute($integrationData, $fieldValues)
    {
        $integrationDetails = $integrationData->flow_details;
        $integId            = $integrationData->id;
        $tokenDetails       = $integrationDetails->tokenDetails;
        $fieldMap           = $integrationDetails->field_map;
        $actionName         = $integrationDetails->actionName;

        if (empty($fieldMap) || empty($tokenDetails) || empty($actionName)) {
            return new WP_Error('REQ_FIELD_EMPTY', __('module, fields are required for LionDesk api', 'bit-integrations'));
        }

        $response = [];
        if (strtotime($tokenDetails->expires) < time()) {
            $response['tokenDetails'] = $this->_refreshAccessToken($tokenDetails);
            $tokenDetails             = $response['tokenDetails'];
        }

        $recordApiHelper     = new RecordApiHelper($integrationDetails, $integId, $tokenDetails);
        $lionDeskApiResponse = $recordApiHelper->execute($fieldValues, $fieldMap, $actionName);

        if (is_wp_error($lionDeskApiResponse)) {
            return $lionDeskApiResponse;
        }
        return $lionDeskApiResponse;
    }
}
