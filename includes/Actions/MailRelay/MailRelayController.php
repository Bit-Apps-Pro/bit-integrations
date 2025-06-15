<?php

/**
 * MailRelay Integration
 */

namespace BitCode\FI\Actions\MailRelay;

use BitCode\FI\Core\Util\HttpHelper;
use WP_Error;

/**
 * Provide functionality for MailRelay integration
 */
class MailRelayController
{
    protected $_defaultHeader;

    public function authentication($fieldsRequestParams)
    {
        if (empty($fieldsRequestParams->auth_token) && empty($fieldsRequestParams->domain)) {
            wp_send_json_error(
                __(
                    'Requested parameter is empty',
                    'bit-integrations'
                ),
                400
            );
        }

        $domain = $fieldsRequestParams->domain;
        $baseUrl = "https://{$domain}.ipzmarketing.com/api/v1/";
        $apiEndpoints = $baseUrl . 'custom_fields';
        $apiKey = $fieldsRequestParams->auth_token;
        $header = [
            'X-AUTH-TOKEN' => $apiKey
        ];

        $response = HttpHelper::get($apiEndpoints, null, $header);
        $customFields = [];

        foreach ($response as $customField) {
            $customFields[] = [
                'key'      => $customField->id,
                'label'    => $customField->label,
                'required' => false
            ];
        }

        if (isset($response->error) || isset($response->errors) || \gettype($response) == 'string') {
            wp_send_json_error(__('Please enter valid Domain name & API key', 'bit-integrations'), 400);
        } else {
            wp_send_json_success($customFields, 200);
        }
    }

    public function getAllGroups($fieldsRequestParams)
    {
        if (empty($fieldsRequestParams->auth_token) && empty($fieldsRequestParams->domain)) {
            wp_send_json_error(
                __(
                    'Requested parameter is empty',
                    'bit-integrations'
                ),
                400
            );
        }

        $domain = $fieldsRequestParams->domain;
        $baseUrl = "https://{$domain}.ipzmarketing.com/api/v1/";
        $apiEndpoints = $baseUrl . 'groups?page=1&&per_page=1000';
        $apiKey = $fieldsRequestParams->auth_token;
        $header = [
            'X-AUTH-TOKEN' => $apiKey
        ];

        $response = HttpHelper::get($apiEndpoints, null, $header);
        $groups = [];

        foreach ($response as $group) {
            $groups[] = [
                'id'   => (string) $group->id,
                'name' => $group->name
            ];
        }

        if (isset($response->error)) {
            wp_send_json_error('Groups fetch failed', 400);
        } else {
            wp_send_json_success($groups, 200);
        }
    }

    public function execute($integrationData, $fieldValues)
    {
        $integrationDetails = $integrationData->flow_details;
        $integId = $integrationData->id;
        $auth_token = $integrationDetails->auth_token;
        $selectedGroups = $integrationDetails->selectedGroups;
        $fieldMap = $integrationDetails->field_map;
        $status = $integrationDetails->status;

        if (
            empty($fieldMap)
            || empty($auth_token) || empty($status)
        ) {
            return new WP_Error('REQ_FIELD_EMPTY', wp_sprintf(__('module, fields are required for %s api', 'bit-integrations'), 'MailRelay'));
        }

        $recordApiHelper = new RecordApiHelper($integrationDetails, $integId);
        $mailRelayApiResponse = $recordApiHelper->execute(
            $selectedGroups,
            $fieldValues,
            $fieldMap,
            $status
        );

        if (is_wp_error($mailRelayApiResponse)) {
            return $mailRelayApiResponse;
        }

        return $mailRelayApiResponse;
    }
}
