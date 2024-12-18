<?php

/**
 * SmartSuite Integration
 */

namespace BitCode\FI\Actions\SmartSuite;

use BitCode\FI\Core\Util\HttpHelper;

/**
 * Provide functionality for SmartSuite integration
 */
class SmartSuiteController
{
    protected $_defaultHeader;

    protected $apiEndpoint;

    public function __construct()
    {
        $this->apiEndpoint = 'https://app.smartsuite.com/api/v1/';
    }

    /**
     * Process ajax request for generate_token
     *
     * @param $requestsParams Mandatory params for generate tokens
     *
     * @return JSON SmartSuite api response and status
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
        $this->setHeaders($fieldsRequestParams->api_key, $fieldsRequestParams->api_secret);
        $apiEndpoint = $this->apiEndpoint . "applications/{$fieldsRequestParams->event_id}";
        $response = HttpHelper::get($apiEndpoint, null, $this->_defaultHeader);

        if (isset($response)) {
            if (isset($response->structure)) {
                foreach ($response->structure as $customField) {
                    $customFields[] = [
                        'key'   => $customField->slug,
                        'label' => $customField->label,
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

    public function getAllSolutions($fieldsRequestParams)
    {
        $this->checkValidation($fieldsRequestParams);
        $this->setHeaders($fieldsRequestParams->api_key, $fieldsRequestParams->api_secret);
        $apiEndpoint = $this->apiEndpoint . 'solutions/';
        $response = HttpHelper::get($apiEndpoint, null, $this->_defaultHeader);

        if (!isset($response->errors)) {
            $solutions = [];
            foreach ($response as $solution) {
                $solutions[]
                = (object) [
                    'id'   => $solution->id,
                    'name' => $solution->name
                ]
                ;
            }
            wp_send_json_success($solutions, 200);
        } else {
            wp_send_json_error(__('Solutions fetching failed', 'bit-integrations'), 400);
        }
    }

    public function getAllTables($fieldsRequestParams)
    {
        $this->checkValidation($fieldsRequestParams);
        $this->setHeaders($fieldsRequestParams->api_key, $fieldsRequestParams->api_secret);
        $apiEndpoint = $this->apiEndpoint . "applications/?solution={$fieldsRequestParams->solution_id}";

        $response = HttpHelper::get($apiEndpoint, null, $this->_defaultHeader);
        if (!isset($response->errors)) {
            $tables = [];
            foreach ($response as $table) {
                $tables[]
                = (object) [
                    'id'           => $table->id,
                    'name'         => $table->name,
                    'customFields' => $table->structure
                ]
                ;
            }
            wp_send_json_success($tables, 200);
        } else {
            wp_send_json_error(__('Tables fetching failed', 'bit-integrations'), 400);
        }
    }

    public function getAllUser($fieldsRequestParams)
    {
        $this->checkValidation($fieldsRequestParams);
        $this->setHeaders($fieldsRequestParams->api_key, $fieldsRequestParams->api_secret);
        $apiEndpoint = $this->apiEndpoint . 'applications/members/records/list/';

        $response = HttpHelper::post($apiEndpoint, null, $this->_defaultHeader);

        if (isset($response->items)) {
            $users = [];
            foreach ($response->items as $user) {
                $users[]
                = (object) [
                    'id'   => $user->id,
                    'name' => $user->full_name->sys_root
                ]
                ;
            }
            wp_send_json_success($users, 200);
        } else {
            wp_send_json_error(__('User fetching failed', 'bit-integrations'), 400);
        }
    }

    public function execute($integrationData, $fieldValues)
    {
        $integrationDetails = $integrationData->flow_details;
        $apiKey = $integrationDetails->api_key;
        $apiSecret = $integrationDetails->api_secret;
        $integId = $integrationData->id;
        $tokenDetails = '';
        $fieldMap = $integrationDetails->field_map;
        $actionName = $integrationDetails->actionName;
        $recordApiHelper = new RecordApiHelper($integrationDetails, $integId, $tokenDetails, $apiKey, $apiSecret);

        $smartSuiteApiResponse = $recordApiHelper->execute($fieldValues, $fieldMap, $actionName);

        if (is_wp_error($smartSuiteApiResponse)) {
            return $smartSuiteApiResponse;
        }

        return $smartSuiteApiResponse;
    }

    /**
     * Helps to refresh SmartSuite access_token
     *
     * @param object $apiData             Contains required data for refresh access token
     * @param mixed  $fieldsRequestParams
     *
     * @return JSON $tokenDetails API token details
     */
    public function authentication($fieldsRequestParams)
    {
        $this->setHeaders($fieldsRequestParams->api_key, $fieldsRequestParams->api_secret);
        $apiEndpoint = $this->apiEndpoint . 'solutions/';
        $response = HttpHelper::get($apiEndpoint, null, $this->_defaultHeader);
        if (\is_array($response)) {
            wp_send_json_success(__('Authentication successful', 'bit-integrations'), 200);
        } else {
            wp_send_json_error(__($response, 'bit-integrations'), 400);
        }
    }

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

    private function checkValidation($fieldsRequestParams)
    {
        if (empty($fieldsRequestParams->api_key) || empty($fieldsRequestParams->api_secret)) {
            wp_send_json_error(__('Requested parameter is empty', 'bit-integrations'), 400);
        }
    }

    private function setHeaders1($access_token)
    {
        return [
            'ACCOUNT-ID'    => '',
            'Authorization' => 'Token ',
            'Content-Type'  => 'application/json'
        ];
    }

    private function setHeaders($apiKey, $apiSecret)
    {
        $this->_defaultHeader = [
            'ACCOUNT-ID'    => $apiKey,
            'Authorization' => 'Token ' . $apiSecret,
            'Content-Type'  => 'application/json'
        ];
    }
}
