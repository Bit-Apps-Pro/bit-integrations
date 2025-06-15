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

    public function authentication($fieldsRequestParams)
    {
        BentoHelper::checkValidation($fieldsRequestParams);

        $headers = BentoHelper::setHeaders($fieldsRequestParams->publishable_key, $fieldsRequestParams->secret_key);
        $apiEndpoint = BentoHelper::setEndpoint('tags', $fieldsRequestParams->site_uuid);
        $response = HttpHelper::get($apiEndpoint, null, $headers);

        if (BentoHelper::checkResponseCode()) {
            wp_send_json_success(__('Authentication successful', 'bit-integrations'), 200);

            return;
        }

        wp_send_json_error(!empty($response) ? $response : __('Please enter valid Publishable Key, Secret Key & Site UUID', 'bit-integrations'), 400);
    }

    public function getAllFields($fieldsRequestParams)
    {
        BentoHelper::checkValidation($fieldsRequestParams, $fieldsRequestParams->action ?? '');

        switch ($fieldsRequestParams->action) {
            case 'add_people':
                $defaultFields = [(object) ['label' => __('Email Address', 'bit-integrations'), 'key' => 'email', 'required' => true]];
                $fields = apply_filters('btcbi_bento_get_user_fields', $defaultFields, $fieldsRequestParams);

                break;
            case 'add_event':
                $fields = apply_filters('btcbi_bento_get_event_fields', []);

                break;

            default:
                $fields = [];

                break;
        }

        wp_send_json_success($fields, 200);
    }

    public function getAlTags($fieldsRequestParams)
    {
        BentoHelper::checkValidation($fieldsRequestParams);

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

        return $recordApiHelper->execute($fieldValues, $fieldMap, $action);
    }
}
