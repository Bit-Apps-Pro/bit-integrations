<?php

/**
 * Benchmark Integration
 */

namespace BitCode\FI\Actions\BenchMark;

use WP_Error;
use BitCode\FI\Core\Util\HttpHelper;
use BitCode\FI\Actions\BenchMark\RecordApiHelper;

/**
 * Provide functionality for ZohoCrm integration
 */
class BenchMarkController
{
    private $_integrationID;

    public function __construct($integrationID)
    {
        $this->_integrationID = $integrationID;
    }

    public static function _apiEndpoint($method)
    {
        return "https://clientapi.benchmarkemail.com/{$method}";
    }

    /**
     * Process ajax request
     *
     * @param $requestsParams Params to authorize
     *
     * @return JSON Benchmark api response and status
     */
    public static function benchMarkAuthorize($requestsParams)
    {
        if (empty($requestsParams->api_secret)
        ) {
            wp_send_json_error(
                __(
                    'Requested parameter is empty',
                    'bit-integrations'
                ),
                400
            );
        }

        $apiEndpoint = self::_apiEndpoint('Client/');

        $authorizationHeader['AuthToken'] = $requestsParams->api_secret;
        $apiResponse = HttpHelper::get($apiEndpoint, null, $authorizationHeader);

        if (is_wp_error($apiResponse) || empty($apiResponse)) {
            wp_send_json_error(
                empty($apiResponse) ? 'Unknown' : $apiResponse,
                400
            );
        }

        wp_send_json_success(true);
    }

    /**
     * Process ajax request for refresh Lists
     *
     * @param $queryParams Params to fetch list
     *
     * @return JSON Benchmark lists data
     */
    public static function benchMarkLists($queryParams)
    {
        if (empty($queryParams->api_secret)
        ) {
            wp_send_json_error(
                __(
                    'Requested parameter is empty',
                    'bit-integrations'
                ),
                400
            );
        }

        $apiEndpoint = self::_apiEndpoint('Contact/');

        $authorizationHeader['AuthToken'] = $queryParams->api_secret;
        $benchMarkResponse = HttpHelper::get($apiEndpoint, null, $authorizationHeader);

        $lists = [];
        if (!is_wp_error($benchMarkResponse)) {
            $allLists = (object)($benchMarkResponse->Response->Data);

            foreach ($allLists as $key=>$list) {
                $lists[$list->Name] = (object) [
                    'listId' => $list->ID,
                    'listName' => $list->Name,
                ];
            }
            $response['benchMarkLists'] = $lists;
            wp_send_json_success($response);
        }
    }

    /**
     * Process ajax request for refresh crm modules
     *
     * @param $queryParams Params to fetch headers
     *
     * @return JSON crm module data
     */
    public static function benchMarkHeaders($queryParams)
    {
        if (empty($queryParams->api_secret)
        ) {
            wp_send_json_error(
                __(
                    'Requested parameter is empty',
                    'bit-integrations'
                ),
                400
            );
        }

        $listId = $queryParams->list_id;

        $apiEndpoint = "https://clientapi.benchmarkemail.com/Contact/{$listId}/Fields";


        $authorizationHeader['AuthToken'] = $queryParams->api_secret;
        $benchMarkResponse = HttpHelper::get($apiEndpoint, null, $authorizationHeader);

        $fields = [];
        if (!is_wp_error($benchMarkResponse)) {
            $allFields = $benchMarkResponse->Response->Data;


            foreach ($allFields as $field) {
                $fields[$field] = (object) [
                    'fieldId' => $field,
                    'fieldName' => $field,
                    'fieldValue' => strtolower(str_replace(' ', '_', $field)),
                    'required' =>  $field=='email' ? true : false
                ];
            }

            $response['benchMarkField'] = $fields;

            wp_send_json_success($response);
        }
    }

    public function execute($integrationData, $fieldValues)
    {
        $integrationDetails = $integrationData->flow_details;

        $api_secret = $integrationDetails->api_secret;
        $fieldMap = $integrationDetails->field_map;
        $actions = $integrationDetails->actions;
        $listId = $integrationDetails->listId;

        if (empty($api_secret)
            || empty($fieldMap)
        ) {
            return new WP_Error('REQ_FIELD_EMPTY', __('module, fields are required for Sendinblue api', 'bit-integrations'));
        }
        $recordApiHelper = new RecordApiHelper($api_secret, $this->_integrationID);

        $benchMarkApiResponse = $recordApiHelper->execute(
            $fieldValues,
            $fieldMap,
            $actions,
            $listId
        );

        return isset($benchMarkApiResponse->Response->Data) ? true : false;
    }
}
