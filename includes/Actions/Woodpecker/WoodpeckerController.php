<?php

/**
 * Woodpecker Integration
 */

namespace BitCode\FI\Actions\Woodpecker;

use WP_Error;
use BitCode\FI\Core\Util\HttpHelper;

/**
 * Provide functionality for Woodpecker integration
 */
class WoodpeckerController
{
    protected $_defaultHeader;
    protected $apiEndpoint;
    protected $domain;

    private function setApiEndpoint()
    {
        return $this->apiEndpoint = "https://api.woodpecker.co/rest/v1";
    }

    private function checkValidation($fieldsRequestParams, $customParam = '**')
    {
        if (empty($fieldsRequestParams->api_key) || empty($customParam)) {
            wp_send_json_error(__('Requested parameter is empty', 'bit-integrations'), 400);
        }
    }

    private function setHeaders($apiKey)
    {
        return
            [
                "Authorization" => "Basic $apiKey",
                "Content-type"  => "application/json",
            ];
    }

    public function authentication($fieldsRequestParams)
    {
        $this->checkValidation($fieldsRequestParams);
        $apiKey         = $fieldsRequestParams->api_key;
        $apiEndpoint    = $this->setApiEndpoint() . "/campaign_list";
        $headers        = $this->setHeaders(base64_encode($apiKey));
        $response       = HttpHelper::get($apiEndpoint, null, $headers);

        if (isset($response->status) && $response->status->status === "ERROR") {
            wp_send_json_error('Please enter valid API Key', 400);
        } else {
            wp_send_json_success('Authentication successful', 200);
        }
    }

    public function getAllCampagns($fieldsRequestParams)
    {
        $this->checkValidation($fieldsRequestParams);
        $apiKey         = $fieldsRequestParams->api_key;
        $apiEndpoint    = $this->setApiEndpoint() . "/campaign_list";
        $headers        = $this->setHeaders(base64_encode($apiKey));
        $response       = HttpHelper::get($apiEndpoint, null, $headers);

        if (isset($response->status) && $response->status->status === "ERROR") {
            wp_send_json_error('Campaign not found!', 400);
        } else {
            $campaigns = [];
            foreach ($response as $campaign) {
                array_push(
                    $campaigns,
                    (object) [
                        'id' => $campaign->id,
                        'name' => $campaign->name,
                    ]
                );
            }

            wp_send_json_success($campaigns, 200);
        }
    }

    public function execute($integrationData, $fieldValues)
    {
        $integrationDetails = $integrationData->flow_details;
        $integId            = $integrationData->id;
        $apiKey             = $integrationDetails->api_key;
        $actions            = $integrationDetails->actions;
        $fieldMap           = $integrationDetails->field_map;
        $actionName         = $integrationDetails->actionName;

        if (empty($fieldMap) || empty($apiKey) || empty($actionName)) {
            return new WP_Error('REQ_FIELD_EMPTY', __('module, fields are required for Woodpecker api', 'bit-integrations'));
        }

        $recordApiHelper        = new RecordApiHelper($integrationDetails, $integId, base64_encode($apiKey));
        $woodpeckerApiResponse  = $recordApiHelper->execute($fieldValues, $fieldMap, $actionName, $actions);

        if (is_wp_error($woodpeckerApiResponse)) {
            return $woodpeckerApiResponse;
        }
        return $woodpeckerApiResponse;
    }
}
