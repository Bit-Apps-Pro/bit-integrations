<?php

/**
 * ZohoSheet Integration
 */

namespace BitCode\FI\Actions\ElasticEmail;

use BitCode\FI\Core\Util\HttpHelper;
use WP_Error;

/**
 * Provide functionality for ZohoCrm integration
 */
class ElasticEmailController
{
    public static function elasticEmailAuthorize($requestsParams)
    {
        if (empty($requestsParams->api_key)) {
            wp_send_json_error(
                __(
                    'Requested parameter is empty',
                    'bit-integrations'
                ),
                400
            );
        }

        $apiEndpoint = 'https://api.elasticemail.com/v4/lists';
        $apiKey = $requestsParams->api_key;
        $header = [
            'X-ElasticEmail-ApiKey' => $apiKey,
            'Accept'                => '*/*',
        ];
        $apiResponse = HttpHelper::get($apiEndpoint, null, $header);
        if (is_wp_error($apiResponse) || !\is_null($apiResponse->Error)) {
            wp_send_json_error(
                empty($apiResponse->code) ? 'Unknown' : $apiResponse->Error,
                400
            );
        }
        wp_send_json_success(true);
    }

    public static function getAllLists($requestsParams)
    {
        if (empty($requestsParams->apiKey)) {
            wp_send_json_error(
                __(
                    'Requested parameter is empty',
                    'bit-integrations'
                ),
                400
            );
        }

        $apiEndpoint = 'https://api.elasticemail.com/v4/lists';
        $apiKey = $requestsParams->apiKey;
        $header = [
            'X-ElasticEmail-ApiKey' => $apiKey,
            'Accept'                => '*/*',
        ];
        $apiResponse = HttpHelper::get($apiEndpoint, null, $header);
        $data = [];
        foreach ($apiResponse as $list) {
            $data[] = (object) [
                'listId'   => $list->PublicListID,
                'listName' => $list->ListName
            ];
        }
        $response['lists'] = $data;
        wp_send_json_success($response, 200);
        // wp_send_json_success(true);
    }

    public function execute($integrationData, $fieldValues)
    {
        $integrationDetails = $integrationData->flow_details;
        $integId = $integrationData->id;

        $api_key = $integrationDetails->api_key;
        $fieldMap = $integrationDetails->field_map;
        $actions = $integrationDetails->actions;
        if (empty($api_key)
            || empty($fieldMap)
        ) {
            return new WP_Error('REQ_FIELD_EMPTY', wp_sprintf(__('module, fields are required for %s api', 'bit-integrations'), 'Elastic Email'));
        }
        $recordApiHelper = new RecordApiHelper($api_key, $integId);
        $elasticEmailApiResponse = $recordApiHelper->execute(
            $integId,
            $fieldValues,
            $fieldMap,
            $integrationDetails
            // $actions
        );

        if (is_wp_error($elasticEmailApiResponse)) {
            return $elasticEmailApiResponse;
        }

        return $elasticEmailApiResponse;
    }
}
