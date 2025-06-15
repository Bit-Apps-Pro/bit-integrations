<?php

/**
 * Moosend Integration
 */

namespace BitCode\FI\Actions\Moosend;

use BitCode\FI\Core\Util\HttpHelper;
use WP_Error;

/**
 * Provide functionality for Moosend integration
 */
class MoosendController
{
    private $baseUrl = 'https://api.moosend.com/v3/';

    public function handleAuthorize($requestParams)
    {
        if (empty($requestParams->authKey)) {
            wp_send_json_error(
                __(
                    'Requested parameter is empty',
                    'bit-integrations'
                ),
                400
            );
        }
        $apiEndpoints = $this->baseUrl . 'lists/1/1000.json?apikey=' . $requestParams->authKey;
        $headers = [
            'Content-Type' => 'application/json',
            'Accept'       => 'application/json',
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
        $authKey = $integrationDetails->authKey;
        $listId = $integrationDetails->listId;
        $method = $integrationDetails->method;
        $field_map = $integrationDetails->field_map;

        if (
            empty($field_map)
            || empty($authKey)
        ) {
            return new WP_Error('REQ_FIELD_EMPTY', wp_sprintf(__('module, fields are required for %s api', 'bit-integrations'), 'Moosend'));
        }
        $recordApiHelper = new RecordApiHelper($integrationDetails, $integId);
        $moosendApiResponse = $recordApiHelper->execute(
            $listId,
            $method,
            $fieldValues,
            $field_map,
            $authKey
        );

        if (is_wp_error($moosendApiResponse)) {
            return $moosendApiResponse;
        }

        return $moosendApiResponse;
    }
}
