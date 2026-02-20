<?php

/**
 * Bento Integration
 */

namespace BitApps\Integrations\Actions\Bento;

use BitApps\Integrations\Config;
use BitApps\Integrations\Core\Util\HttpHelper;
use BitApps\Integrations\Core\Util\Hooks;
use WP_Error;

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
                $fields = Hooks::apply(Config::withPrefix('bento_get_user_fields'), $defaultFields, $fieldsRequestParams);

                /**
                 * @deprecated 2.7.8 Use `bit_integrations_bento_get_user_fields` filter instead.
                 * @since 2.7.8
                 */
                $fields = Hooks::apply('btcbi_bento_get_user_fields', $fields, $fieldsRequestParams);

                break;
            case 'add_event':
                $fields = Hooks::apply(Config::withPrefix('bento_get_event_fields'), []);

                /**
                 * @deprecated 2.7.8 Use `bit_integrations_bento_get_event_fields` filter instead.
                 * @since 2.7.8
                 */
                $fields = Hooks::apply('btcbi_bento_get_event_fields', $fields);

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

        $tags = Hooks::apply(Config::withPrefix('bento_get_all_tags'), [], $fieldsRequestParams);

        /**
         * @deprecated 2.7.8 Use `bit_integrations_bento_get_all_tags` filter instead.
         * @since 2.7.8
         */
        $tags = Hooks::apply('btcbi_bento_get_all_tags', $tags, $fieldsRequestParams);

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
            // translators: %s: Placeholder value
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
