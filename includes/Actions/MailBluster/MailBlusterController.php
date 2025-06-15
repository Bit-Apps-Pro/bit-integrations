<?php

/**
 * MailBluster Integration
 */

namespace BitCode\FI\Actions\MailBluster;

use WP_Error;
use BitCode\FI\Core\Util\HttpHelper;

/**
 * Provide functionality for MailBluster integration
 */
class MailBlusterController
{
    private $baseUrl = 'https://api.mailbluster.com/api/';
    protected $_defaultHeader;

    public function authentication($fieldsRequestParams)
    {
        if (empty($fieldsRequestParams->auth_token)) {
            wp_send_json_error(
                __(
                    'Requested parameter is empty',
                    'bit-integrations'
                ),
                400
            );
        }

        $apiEndpoints = $this->baseUrl . 'fields';
        $apiKey       = $fieldsRequestParams->auth_token;
        $header       = [
            'Authorization' => $apiKey,
        ];

        $response     = HttpHelper::get($apiEndpoints, null, $header);
        $customFields = [];

        foreach ($response->fields as $field) {
            $customFields[] = [
                'key'      => $field->fieldMergeTag,
                'label'    => $field->fieldLabel,
                'required' => false
            ];
        }

        if (property_exists($response, 'fields')) {
            wp_send_json_success($customFields, 200);
        } else {
            wp_send_json_error('Please enter valid API key', 400);
        }
    }

    public function execute($integrationData, $fieldValues)
    {
        $integrationDetails = $integrationData->flow_details;
        $integId            = $integrationData->id;
        $auth_token         = $integrationDetails->auth_token;
        $selectedTags       = $integrationDetails->selectedTags;
        $fieldMap           = $integrationDetails->field_map;
        $subscribed         = $integrationDetails->subscribed;

        if (
            empty($fieldMap)
            || empty($auth_token) || empty($subscribed)
        ) {
            return new WP_Error('REQ_FIELD_EMPTY', __('module, fields are required for GetResponse api', 'bit-integrations'));
        }
        $recordApiHelper = new RecordApiHelper($integrationDetails, $integId);
        $mailBlusterApiResponse = $recordApiHelper->execute(
            $selectedTags,
            $fieldValues,
            $fieldMap,
            $subscribed
        );

        if (is_wp_error($mailBlusterApiResponse)) {
            return $mailBlusterApiResponse;
        }
        return $mailBlusterApiResponse;
    }
}
