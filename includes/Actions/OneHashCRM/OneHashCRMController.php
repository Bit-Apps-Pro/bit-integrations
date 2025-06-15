<?php

/**
 * OneHashCRM Integration
 */

namespace BitCode\FI\Actions\OneHashCRM;

use WP_Error;
use BitCode\FI\Core\Util\HttpHelper;

/**
 * Provide functionality for OneHashCRM integration
 */
class OneHashCRMController
{
    protected $_defaultHeader;
    protected $apiEndpoint;
    protected $domain;

    private function setApiEndpoint()
    {
        return $this->apiEndpoint = "{$this->domain}/api/resource";
    }

    private function checkValidation($fieldsRequestParams, $customParam = '**')
    {
        if (empty($fieldsRequestParams->api_key) || empty($fieldsRequestParams->api_secret) || empty($fieldsRequestParams->domain) || empty($customParam)) {
            wp_send_json_error(__('Requested parameter is empty', 'bit-integrations'), 400);
        }
    }

    private function setHeaders($apiKey, $apiSecret)
    {
        return
            [
                "Authorization" => "token {$apiKey}:$apiSecret",
                "Content-type"  => "application/json",
            ];
    }

    public function authentication($fieldsRequestParams)
    {
        $this->checkValidation($fieldsRequestParams);
        $this->domain   = $fieldsRequestParams->domain;
        $apiKey         = $fieldsRequestParams->api_key;
        $apiSecret      = $fieldsRequestParams->api_secret;
        $apiEndpoint    = $this->setApiEndpoint() . "/Lead";
        $headers        = $this->setHeaders($apiKey, $apiSecret);
        $response       = HttpHelper::get($apiEndpoint, null, $headers);

        if (isset($response->data)) {
            wp_send_json_success('Authentication successful', 200);
        } else {
            wp_send_json_error('Please enter valid API Key & Secret or Access Api URL', 400);
        }
    }

    public function execute($integrationData, $fieldValues)
    {
        $integrationDetails = $integrationData->flow_details;
        $integId            = $integrationData->id;
        $apiKey             = $integrationDetails->api_key;
        $apiSecret          = $integrationDetails->api_secret;
        $fieldMap           = $integrationDetails->field_map;
        $actionName         = $integrationDetails->actionName;
        $domain             = $integrationDetails->domain;

        if (empty($fieldMap) || empty($apiKey) || empty($apiSecret) || empty($actionName) || empty($domain)) {
            return new WP_Error('REQ_FIELD_EMPTY', __('module, fields are required for OneHashCRM api', 'bit-integrations'));
        }

        $recordApiHelper        = new RecordApiHelper($integrationDetails, $integId, $apiKey, $apiSecret,  $domain);
        $oneHashCRMApiResponse  = $recordApiHelper->execute($fieldValues, $fieldMap, $actionName);

        if (is_wp_error($oneHashCRMApiResponse)) {
            return $oneHashCRMApiResponse;
        }
        return $oneHashCRMApiResponse;
    }
}
