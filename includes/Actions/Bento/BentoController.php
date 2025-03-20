<?php

/**
 * Bento Integration
 */

namespace BitCode\FI\Actions\Bento;

use WP_Error;
use BitCode\FI\Core\Util\HttpHelper;

/**
 * Provide functionality for Bento integration
 */
class BentoController
{
    protected $_defaultHeader;

    protected $_apiEndpoint = 'https://app.bentonow.com/api/v1/fetch/';

    public function authentication($fieldsRequestParams)
    {
        $this->checkValidation($fieldsRequestParams);
        $this->setHeaders($fieldsRequestParams->publishable_key, $fieldsRequestParams->secret_key);

        $apiEndpoint = $this->setEndpoint('tags', $fieldsRequestParams->site_uuid);
        $response = HttpHelper::get($apiEndpoint, null, $this->_defaultHeader);

        if (HttpHelper::$responseCode === 200) {
            wp_send_json_success(__('Authentication successful', 'bit-integrations'), 200);
        } else {
            wp_send_json_error(!empty($response) ? $response : __('Please enter valid Publishable Key, Secret Key & Site UUID', 'bit-integrations'), 400);
        }
    }

    public function getAllFields($fieldsRequestParams)
    {
        $this->checkValidation($fieldsRequestParams, $fieldsRequestParams->action ?? '');

        $defaultFields = [(object) ['label' => __('Email Address', 'bit-integrations'), 'key' => 'email', 'required' => true]];

        switch ($fieldsRequestParams->action) {
            case 'create_user':
                $fields = apply_filters('btcbi_bento_get_custom_fields', $defaultFields, $fieldsRequestParams);

                break;

            default:
                $fields = $defaultFields;

                break;
        }

        wp_send_json_success($fields, 200);
    }

    public function getAlTags($fieldsRequestParams)
    {
        $this->checkValidation($fieldsRequestParams);

        $tags = apply_filters('btcbi_bento_get_all_tags', [], $fieldsRequestParams);

        wp_send_json_success($tags, 200);
    }

    public function execute($integrationData, $fieldValues)
    {
        $integrationDetails = $integrationData->flow_details;
        $integId = $integrationData->id;
        $publishableKey = $integrationDetails->publishable_key;
        $secretKey = $integrationDetails->secret_key;
        $siteUUID = $integrationDetails->site_uuid;
        $fieldMap = $integrationDetails->field_map;
        $action = $integrationDetails->action;

        if (empty($fieldMap) || empty($publishableKey) || empty($secretKey) || empty($siteUUID) || empty($action)) {
            return new WP_Error('REQ_FIELD_EMPTY', wp_sprintf(__('module, fields are required for %s api', 'bit-integrations'), 'Bento'));
        }

        $recordApiHelper = new RecordApiHelper(
            $integrationDetails,
            $integId,
            $publishableKey,
            $secretKey,
            $siteUUID
        );

        $bentoApiResponse = $recordApiHelper->execute($fieldValues, $fieldMap, $action);

        if (is_wp_error($bentoApiResponse)) {
            return $bentoApiResponse;
        }

        return $bentoApiResponse;
    }

    private function checkValidation($fieldsRequestParams, $customParam = '**')
    {
        if (empty($fieldsRequestParams->publishable_key) || empty($fieldsRequestParams->secret_key || empty($fieldsRequestParams->site_uuid)) || empty($customParam)) {
            wp_send_json_error(__('Requested parameter is empty', 'bit-integrations'), 400);
        }
    }

    private function setHeaders($publishableKey, $secretKey)
    {
        $this->_defaultHeader = [
            'Authorization' => 'Basic ' . base64_encode("{$publishableKey}:{$secretKey}"),
            'Accept'        => 'application/json',
            'Content-Type'  => 'application/json'
        ];
    }

    private function setEndpoint($endpoint, $siteUUID)
    {
        return "{$this->_apiEndpoint}{$endpoint}?site_uuid={$siteUUID}";
    }
}
