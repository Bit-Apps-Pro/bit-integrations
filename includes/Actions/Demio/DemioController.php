<?php

/**
 * Demio Integration
 */

namespace BitCode\FI\Actions\Demio;

use BitCode\FI\Core\Util\HttpHelper;
use WP_Error;

/**
 * Provide functionality for Demio integration
 */
class DemioController
{
    protected $_defaultHeader;

    protected $_apiEndpoint;

    public function __construct()
    {
        $this->_apiEndpoint = 'https://my.demio.com/api/v1';
    }

    public function authentication($fieldsRequestParams)
    {
        $this->checkValidation($fieldsRequestParams);
        $this->setHeaders($fieldsRequestParams->api_key, $fieldsRequestParams->api_secret);
        $apiEndpoint = $this->_apiEndpoint . '/ping';
        $response = HttpHelper::get($apiEndpoint, null, $this->_defaultHeader);

        if ($response->pong) {
            wp_send_json_success(__('Authentication successful', 'bit-integrations'), 200);
        } else {
            wp_send_json_error(__('Please enter valid API Key & API Secret', 'bit-integrations'), 400);
        }
    }

    public function getAllEvents($fieldsRequestParams)
    {
        $this->checkValidation($fieldsRequestParams);
        $this->setHeaders($fieldsRequestParams->api_key, $fieldsRequestParams->api_secret);
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
        $this->setHeaders($fieldsRequestParams->api_key, $fieldsRequestParams->api_secret, $fieldsRequestParams->event_id);
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
        $apiKey = $integrationDetails->api_key;
        $apiSecret = $integrationDetails->api_secret;
        $fieldMap = $integrationDetails->field_map;
        $actionName = $integrationDetails->actionName;

        if (empty($fieldMap) || empty($apiSecret) || empty($actionName) || empty($apiKey)) {
            return new WP_Error('REQ_FIELD_EMPTY', wp_sprintf(__('module, fields are required for %s api', 'bit-integrations'), 'Demio'));
        }

        $recordApiHelper = new RecordApiHelper($integrationDetails, $integId, $apiSecret, $apiKey);
        $demioApiResponse = $recordApiHelper->execute($fieldValues, $fieldMap, $actionName);

        if (is_wp_error($demioApiResponse)) {
            return $demioApiResponse;
        }

        return $demioApiResponse;
    }

    private function checkValidation($fieldsRequestParams, $customParam = '**')
    {
        if (empty($fieldsRequestParams->api_key) || empty($fieldsRequestParams->api_secret) || empty($customParam)) {
            wp_send_json_error(__('Requested parameter is empty', 'bit-integrations'), 400);
        }
    }

    private function setHeaders($apiKey, $apiSecret)
    {
        $this->_defaultHeader = [
            'Api-Key'      => $apiKey,
            'Api-Secret'   => $apiSecret,
            'Content-Type' => 'application/json'
        ];
    }
}
