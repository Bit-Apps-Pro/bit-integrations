<?php

/**
 * SendGrid Integration
 */

namespace BitApps\BTCBI\Http\Services\Actions\SendGrid;

use WP_Error;
use BTCBI\Deps\BitApps\WPKit\Http\Client\Http;
use BTCBI\Deps\BitApps\WPKit\Http\Response;

/**
 * Provide functionality for SendGrid integration
 */
class SendGridController
{
    public function authentication($fieldsRequestParams)
    {
        if (empty($fieldsRequestParams->apiKey)) {
            return Response::error(__('Requested parameter is empty', 'bit-integrations'), 400);
        }

        $apiEndpoint = 'https://api.sendgrid.com/v3/marketing/field_definitions';
        $apiKey       = $fieldsRequestParams->apiKey;
        $header       = [
            'Authorization' => 'Bearer ' . $apiKey
        ];

        $response = Http::request($apiEndpoint, 'Get', null, $header);

        if (!isset($response->errors)) {
            foreach ($response->custom_fields as $customField) {
                $customFields[] = [
                    'key'      => $customField->id,
                    'label'    => $customField->name,
                    'required' => false
                ];
            }
            return Response::success($customFields);
        } else {
            return Response::error('Please enter valid API key', 400);
        }
    }

    public function getLists($fieldsRequestParams)
    {
        if (empty($fieldsRequestParams->apiKey)) {
            return Response::error(__('Requested parameter is empty', 'bit-integrations'), 400);
        }

        $apiEndpoint = 'https://api.sendgrid.com/v3/marketing/lists';
        $apiKey       = $fieldsRequestParams->apiKey;
        $header       = [
            'Authorization' => 'Bearer ' . $apiKey
        ];

        $response = Http::request($apiEndpoint, 'Get', null, $header);

        foreach ($response->result as $list) {
            $lists[] = [
                'id'   => $list->id,
                'name' => $list->name
            ];
        }

        if (!empty($lists)) {
            return Response::success($lists);
        } else {
            return Response::error('Lists fetch failed', 400);
        }
    }

    public function execute($integrationData, $fieldValues)
    {
        $integrationDetails = $integrationData->flow_details;
        $integId            = $integrationData->id;
        $apiKey             = $integrationDetails->apiKey;
        $selectedLists      = $integrationDetails->selectedLists;
        $fieldMap           = $integrationDetails->field_map;

        if (empty($fieldMap) || empty($apiKey)) {
            return new WP_Error('REQ_FIELD_EMPTY', __('module, fields are required for SendGrid api', 'bit-integrations'));
        }

        $recordApiHelper    = new RecordApiHelper($integrationDetails, $integId);
        $sendGridApiResponse = $recordApiHelper->execute(
            $selectedLists,
            $fieldValues,
            $fieldMap
        );

        if (is_wp_error($sendGridApiResponse)) {
            return $sendGridApiResponse;
        }
        return $sendGridApiResponse;
    }
}