<?php

/**
 * Encharge Integration
 */

namespace BitApps\BTCBI\Http\Services\Actions\Encharge;

use WP_Error;
use BitApps\BTCBI\Util\IpTool;
use BTCBI\Deps\BitApps\WPKit\Http\Client\Http;

use BitApps\BTCBI\Http\Services\Actions\Encharge\RecordApiHelper;
use BTCBI\Deps\BitApps\WPKit\Http\Response;

/**
 * Provide functionality for Encharge integration
 */
class EnchargeController
{
    private $_integrationID;
    public const APIENDPOINT = 'https://api.encharge.io/v1/';

    public function __construct($integrationID)
    {

        $this->_integrationID = $integrationID;
    }

    /**
     * Process ajax request for generate_token
     *
     * @param $requestsParams Params for Auth
     *
     * @return JSON enchagre user Authorization
     */
    public static function enChargeAuthorize($requestsParams)
    {
        if (empty($requestsParams->api_key)) {
            return Response::error(
                __(
                    'Requested parameter is empty',
                    'bit-integrations'
                ),
                400
            );
        }

        $apiEndpoint = self::APIENDPOINT . 'accounts/info';
        $authorizationHeader["Accept"] = 'application/json';
        $authorizationHeader["X-Encharge-Token"] = $requestsParams->api_key;
        $apiResponse = Http::request($apiEndpoint, 'Get', null, $authorizationHeader);

        if (is_wp_error($apiResponse) || isset($apiResponse->error)) {
            return Response::error(
                empty($apiResponse->code) ? 'Unknown' : $apiResponse->error->message,
                400
            );
        }

        return Response::success(true);
    }
    /**
     * Process ajax request for refresh crm modules
     *
     * @param $queryParams Params for fetch headers
     *
     * @return JSON Encharge field
     */
    public static function enchargeHeaders($queryParams)
    {
        if (empty($queryParams->api_key)) {
            return Response::error(
                __(
                    'Requested parameter is empty',
                    'bit-integrations'
                ),
                400
            );
        }
        $apiEndpoint = self::APIENDPOINT . 'fields';
        $authorizationHeader["Accept"] = 'application/json';
        $authorizationHeader["X-Encharge-Token"] = $queryParams->api_key;
        $enChargeResponse = Http::request($apiEndpoint, 'Get', null, $authorizationHeader);
        $fields = [];
        if (!is_wp_error($enChargeResponse)) {
            $allFields = $enChargeResponse->items;
            // return Response::success($allFields);
            foreach ($allFields as $field) {
                $required = $field->name === 'email' ? true : false;
                $fields[$field->name] = (object) [
                'fieldId' => $field->name,
                'fieldName' => ucfirst($field->name),
                'required' => $required
                ];
            }
            $response['enChargeFields'] = $fields;
            return Response::success($response);
        }
    }

    public function execute($integrationData, $fieldValues)
    {
        $integrationDetails = $integrationData->flow_details;

        $api_key = $integrationDetails->api_key;
        $fieldMap = $integrationDetails->field_map;
        $tags = property_exists($integrationDetails, 'tags') ? $integrationDetails->tags : null;

        if (empty($api_key)
            || empty($fieldMap)
        ) {
            return new WP_Error('REQ_FIELD_EMPTY', __('module, fields are required for Sendinblue api', 'bit-integrations'));
        }
        $recordApiHelper = new RecordApiHelper($api_key, $this->_integrationID);
        $enchagreApiResponse = $recordApiHelper->execute(
            $fieldValues,
            $fieldMap,
            $tags
        );

        if (is_wp_error($enchagreApiResponse)) {
            return $enchagreApiResponse;
        }
        return $enchagreApiResponse;
    }
}
