<?php

/**
 * Demio Integration
 */

namespace BitCode\FI\Actions\Demio;

use WP_Error;
use BitCode\FI\Core\Util\HttpHelper;

/**
 * Provide functionality for Demio integration
 */
class DemioController
{
    protected $_defaultHeader;
    protected $_apiEndpoint;

    public function __construct()
    {
        $this->_apiEndpoint = "https://my.demio.com/api/v1";
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
            "Api-Key"       => $apiKey,
            "Api-Secret"    => $apiSecret,
            "Content-Type"  => "application/json"
        ];
    }

    public function authentication($fieldsRequestParams)
    {
        $this->checkValidation($fieldsRequestParams);
        $this->setHeaders($fieldsRequestParams->api_key, $fieldsRequestParams->api_secret);
        $apiEndpoint  = $this->_apiEndpoint . "/ping";
        $response     = HttpHelper::get($apiEndpoint, null, $this->_defaultHeader);

        if ($response->pong) {
            wp_send_json_success('Authentication successful', 200);
        } else {
            wp_send_json_error('Please enter valid API Key & API Secret', 400);
        }
    }

    public function getAllEvents($fieldsRequestParams)
    {
        $this->checkValidation($fieldsRequestParams);
        $this->setHeaders($fieldsRequestParams->api_key, $fieldsRequestParams->api_secret);
        $apiEndpoint  = $this->_apiEndpoint . "/events";
        $response     = HttpHelper::get($apiEndpoint, null, $this->_defaultHeader);

        if (!isset($response->errors)) {
            $events = [];
            foreach ($response as $event) {
                array_push(
                    $events,
                    (object) [
                        'id'    => $event->id,
                        'name'  => $event->name
                    ]
                );
            }
            wp_send_json_success($events, 200);
        } else {
            wp_send_json_error('Events fetching failed', 400);
        }
    }

    public function getAllSessions($fieldsRequestParams)
    {
        $this->checkValidation($fieldsRequestParams);
        $this->setHeaders($fieldsRequestParams->api_key, $fieldsRequestParams->api_secret, $fieldsRequestParams->event_id);
        $apiEndpoint  = $this->_apiEndpoint . "/event/{$fieldsRequestParams->event_id}";
        $response     = HttpHelper::get($apiEndpoint, null, $this->_defaultHeader);

        if (!isset($response->errors)) {
            $sessions = [];
            foreach ($response->dates as $session) {
                array_push(
                    $sessions,
                    (object) [
                        'date_id'   => $session->date_id,
                        'datetime'  => $session->datetime
                    ]
                );
            }
            wp_send_json_success($sessions, 200);
        } else {
            wp_send_json_error('Events fetching failed', 400);
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

        if (empty($fieldMap) || empty($apiSecret) || empty($actionName) || empty($apiKey)) {
            return new WP_Error('REQ_FIELD_EMPTY', __('module, fields are required for Demio api', 'bit-integrations'));
        }

        $recordApiHelper    = new RecordApiHelper($integrationDetails, $integId, $apiSecret, $apiKey);
        $demioApiResponse   = $recordApiHelper->execute($fieldValues, $fieldMap, $actionName);

        if (is_wp_error($demioApiResponse)) {
            return $demioApiResponse;
        }
        return $demioApiResponse;
    }
}
