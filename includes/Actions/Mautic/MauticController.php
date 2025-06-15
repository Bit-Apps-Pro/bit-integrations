<?php

/**
 * MailChimp Integration
 */

namespace BitCode\FI\Actions\Mautic;

use WP_Error;
use BitCode\FI\Core\Util\HttpHelper;

/**
 * Provide functionality for MailChimp integration
 */
class MauticController
{
    private $_integrationID;

    public function __construct($integrationID)
    {
        $this->_integrationID = $integrationID;
    }

    /**
     * Process ajax request for generate_token
     *
     * @param object $requestsParams Params for generate token
     *
     * @return JSON zoho crm api response and status
     */
    public static function generateTokens($requestsParams)
    {
        if (
            empty($requestsParams->clientId)
            || empty($requestsParams->clientSecret)
            || empty($requestsParams->redirectURI)
            || empty($requestsParams->baseUrl)
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
        $baseUrl = $requestsParams->baseUrl;
        $apiEndpoint = "{$baseUrl}/oauth/v2/token";
        $authorizationHeader['Content-Type'] = 'application/x-www-form-urlencoded';
        $requestParams = [
            'code'          => $requestsParams->code,
            'client_id'     => $requestsParams->clientId,
            'client_secret' => $requestsParams->clientSecret,
            'redirect_uri'  => $requestsParams->redirectURI,
            'grant_type'    => 'authorization_code'
        ];
        $apiResponse = HttpHelper::post($apiEndpoint, $requestParams, $authorizationHeader);
        if (is_wp_error($apiResponse) || !empty($apiResponse->errors)) {
            wp_send_json_error(
                empty($apiResponse->error) ? 'Unknown' : $apiResponse->error,
                400
            );
        }
        $apiResponse->generates_on = time();
        wp_send_json_success($apiResponse, 200);
    }

    /**
     * Process ajax request for refresh Mautic Audience Fields
     *
     * @param $queryParams Params to refresh fields
     *
     * @return JSON mautic contact fields
     */
    public static function getAllFields($queryParams)
    {
        if (empty($queryParams->tokenDetails)) {
            wp_send_json_error(
                __(
                    'Requested parameter is empty',
                    'bit-integrations'
                ),
                400
            );
        }
        $mauticUrl = $queryParams->baseUrl;
        $response = [];
        if ((\intval($queryParams->tokenDetails->generates_on) + (55 * 60)) < time()) {
            $response['tokenDetails'] = static::_refreshAccessToken($queryParams);
        }
        $tokenDetails = empty($response['tokenDetails']) ? $queryParams->tokenDetails : $response['tokenDetails'];

        $apiEndpoint = "{$mauticUrl}/api/contacts/list/fields"; // "/api/fields/contact" this endpoint did not contain all of fields
        $authorizationHeader['Authorization'] = "Bearer {$tokenDetails->access_token}";
        $apiResponse = HttpHelper::get($apiEndpoint, null, $authorizationHeader);
        $response = [];
        if (!is_wp_error($apiResponse)) {
            foreach ($apiResponse as $field) {
                $response[] = (object) [
                    'fieldName'  => $field->label,
                    'fieldAlias' => $field->alias,
                    'required'   => $field->alias === 'email' ? true : false
                ];
            }
        }

        wp_send_json_success($response);
    }

    public static function getAllTags($queryParams)
    {
        if (empty($queryParams->tokenDetails)) {
            wp_send_json_error(
                __(
                    'Requested parameter is empty',
                    'bit-integrations'
                ),
                400
            );
        }
        $mauticUrl = $queryParams->baseUrl;
        $response = [];
        if ((\intval($queryParams->tokenDetails->generates_on) + (55 * 60)) < time()) {
            $response['tokenDetails'] = static::_refreshAccessToken($queryParams);
        }
        $tokenDetails = empty($response['tokenDetails']) ? $queryParams->tokenDetails : $response['tokenDetails'];

        $apiEndpoint = "{$mauticUrl}/api/tags";
        $authorizationHeader['Authorization'] = "Bearer {$tokenDetails->access_token}";
        $apiResponse = HttpHelper::get($apiEndpoint, null, $authorizationHeader);
        $response = [];
        if (!is_wp_error($apiResponse)) {
            foreach ($apiResponse->tags as $field) {
                $response[] = (object) [
                    'tagId'   => $field->id,
                    'tagName' => $field->tag
                ];
            }
        }
        wp_send_json_success($response);
    }

    public static function getAllUsers($queryParams)
    {
        if (empty($queryParams->tokenDetails)) {
            wp_send_json_error(
                __(
                    'Requested parameter is empty',
                    'bit-integrations'
                ),
                400
            );
        }

        $response = [];

        if ((\intval($queryParams->tokenDetails->generates_on) + (55 * 60)) < time()) {
            $response['tokenDetails'] = static::_refreshAccessToken($queryParams);
        }

        $apiEndpoint = "{$queryParams->baseUrl}/api/users";
        $tokenDetails = empty($response['tokenDetails']) ? $queryParams->tokenDetails : $response['tokenDetails'];
        $authorizationHeader['Authorization'] = "Bearer {$tokenDetails->access_token}";
        $apiResponse = HttpHelper::get($apiEndpoint, null, $authorizationHeader);

        if (!is_wp_error($apiResponse) && isset($apiResponse->users)) {
            foreach ($apiResponse->users as $user) {
                $response['allUsers'][] = (object) [
                    'id'    => $user->id,
                    'label' => "{$user->firstName} {$user->lastName}"
                ];
            }
        }

        wp_send_json_success($response);
    }

    /**
     * Save updated access_token to avoid unnecessary token generation
     *
     * @param object $integrationData Details of flow
     * @param array  $fieldValues     Data to send Mail Chimp
     *
     * @return null
     */
    public function execute($integrationData, $fieldValues)
    {
        $integrationDetails = $integrationData->flow_details;
        $baseUrl = $integrationDetails->baseUrl;

        $tokenDetails = $integrationDetails->tokenDetails;
        $fieldMap = $integrationDetails->field_map;
        $actions = $integrationDetails->actions;
        $defaultDataConf = $integrationDetails->default;

        if (
            empty($tokenDetails)
            || empty($fieldMap)
            || empty($defaultDataConf)
        ) {
            return new WP_Error('REQ_FIELD_EMPTY', wp_sprintf(__('module, fields are required for %s api', 'bit-integrations'), 'mautic'));
        }
        if ((\intval($tokenDetails->generates_on) + (60 * 55)) < time()) {
            $requiredParams['clientId'] = $integrationDetails->clientId;
            $requiredParams['clientSecret'] = $integrationDetails->clientSecret;
            $requiredParams['baseUrl'] = $integrationDetails->baseUrl;
            $requiredParams['tokenDetails'] = $tokenDetails;
            $newTokenDetails = static::_refreshAccessToken((object) $requiredParams);
            $tokenDetails = $newTokenDetails;
        }
        $recordApiHelper = new RecordApiHelper($tokenDetails, $this->_integrationID, $baseUrl);
        $mChimpApiResponse = $recordApiHelper->execute(
            $integrationDetails,
            $defaultDataConf,
            $fieldValues,
            $fieldMap,
            $actions
        );

        if (is_wp_error($mChimpApiResponse)) {
            return $mChimpApiResponse;
        }

        return $mChimpApiResponse;
    }

    protected static function _refreshAccessToken($apiData)
    {
        if (
            empty($apiData->clientId)
            || empty($apiData->clientSecret)
            || empty($apiData->tokenDetails)
        ) {
            return false;
        }
        $tokenDetails = $apiData->tokenDetails;
        $baseUrl = $apiData->baseUrl;
        $apiEndpoint = "{$baseUrl}/oauth/v2/token";
        $requestParams = [
            'grant_type'    => 'client_credentials',
            'client_id'     => $apiData->clientId,
            'client_secret' => $apiData->clientSecret,
            'refresh_token' => $tokenDetails->refresh_token,
        ];
        $apiResponse = HttpHelper::post($apiEndpoint, $requestParams);
        if (is_wp_error($apiResponse) || !empty($apiResponse->error)) {
            return false;
        }
        $tokenDetails->generates_on = time();
        $tokenDetails->access_token = $apiResponse->access_token;

        return $tokenDetails;
    }
}
