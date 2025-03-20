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

    protected $_apiEndpoint = 'https://app.bentonow.com/api/v1/';

    public function authentication($fieldsRequestParams)
    {
        $this->checkValidation($fieldsRequestParams);
        $this->setHeaders($fieldsRequestParams->publishable_key, $fieldsRequestParams->secret_key, $fieldsRequestParams->site_uuid);

        $apiEndpoint = $this->setEndpoint('fetch/tags', $fieldsRequestParams->site_uuid);
        $response = HttpHelper::get($apiEndpoint, null, $this->_defaultHeader);
        error_log(print_r($response, true));
        if (HttpHelper::$responseCode === 200) {
            wp_send_json_success(__('Authentication successful', 'bit-integrations'), 200);
        } else {
            wp_send_json_error(!empty($response) ? $response : __('Please enter valid Publishable Key, Secret Key & Site UUID', 'bit-integrations'), 400);
        }
    }

    public function getAllEvents($fieldsRequestParams)
    {
        $this->checkValidation($fieldsRequestParams);
        $this->setHeaders($fieldsRequestParams->publishable_key, $fieldsRequestParams->secret_key, $fieldsRequestParams->site_uuid);
        $apiEndpoint = $this->_apiEndpoint . '/events';
        $response = HttpHelper::get($apiEndpoint, null, $this->_defaultHeader);

        if (!isset($response->errors)) {
            $events = [];
            foreach ($response as $event) {
                $events[]
                = (object) [
                    'id'   => $event->id,
                    'name' => $event->name
                ]
                ;
            }
            wp_send_json_success($events, 200);
        } else {
            wp_send_json_error(__('Events fetching failed', 'bit-integrations'), 400);
        }
    }

    public function getAllSessions($fieldsRequestParams)
    {
        $this->checkValidation($fieldsRequestParams);
        $this->setHeaders($fieldsRequestParams->publishable_key, $fieldsRequestParams->secret_key, $fieldsRequestParams->site_uuid, $fieldsRequestParams->event_id);
        $apiEndpoint = $this->_apiEndpoint . "/event/{$fieldsRequestParams->event_id}";
        $response = HttpHelper::get($apiEndpoint, null, $this->_defaultHeader);

        if (!isset($response->errors)) {
            $sessions = [];
            foreach ($response->dates as $session) {
                $sessions[]
                = (object) [
                    'date_id'  => $session->date_id,
                    'datetime' => $session->datetime
                ]
                ;
            }
            wp_send_json_success($sessions, 200);
        } else {
            wp_send_json_error(__('Events fetching failed', 'bit-integrations'), 400);
        }
    }

    public function execute($integrationData, $fieldValues)
    {
        $integrationDetails = $integrationData->flow_details;
        $integId = $integrationData->id;
        $apiKey = $integrationDetails->publishable_key;
        $apiSecret = $integrationDetails->secret_key;
        $fieldMap = $integrationDetails->field_map;
        $actionName = $integrationDetails->actionName;

        if (empty($fieldMap) || empty($apiSecret) || empty($actionName) || empty($apiKey)) {
            return new WP_Error('REQ_FIELD_EMPTY', wp_sprintf(__('module, fields are required for %s api', 'bit-integrations'), 'Bento'));
        }

        $recordApiHelper = new RecordApiHelper($integrationDetails, $integId, $apiSecret, $apiKey);
        $bentoApiResponse = $recordApiHelper->execute($fieldValues, $fieldMap, $actionName);

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
