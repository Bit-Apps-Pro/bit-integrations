<?php

namespace BitCode\FI\Actions\Hubspot;

use WP_Error;
use BitCode\FI\Log\LogHandler;
use BitCode\FI\Flow\FlowController;
use BitCode\FI\Core\Util\HttpHelper;

final class HubspotController
{
    private $_integrationID;

    public function __construct($integrationID)
    {
        $this->_integrationID = $integrationID;
    }

    public static function authorization($requestParams)
    {
        if (empty($requestParams->api_key)) {
            wp_send_json_error(__('Requested parameter is empty', 'bit-integrations'), 400);
        }

        $apiEndpoint = 'https://api.hubapi.com/crm/v3/objects/contacts';
        $header      = [
            'authorization' => 'Bearer ' . $requestParams->api_key
        ];

        $apiResponse = HttpHelper::get($apiEndpoint, null, $header);

        if (isset($apiResponse->results)) {
            wp_send_json_success('Authorization successfull', 200);
        } else {
            wp_send_json_error('Authorization failed', 400);
        }
    }

    public static function getFields($requestParams)
    {
        if (empty($requestParams->api_key) || empty($requestParams->type)) {
            wp_send_json_error(__('Requested parameter is empty', 'bit-integrations'), 400);
        }

        $apiEndpoint = "https://api.hubapi.com/crm/v3/properties/$requestParams->type";
        $header      = [
            'authorization' => 'Bearer ' . $requestParams->api_key
        ];

        $apiResponse = HttpHelper::get($apiEndpoint, null, $header);

        if (isset($apiResponse->results) && !empty($apiResponse->results)) {
            foreach ($apiResponse->results as $field) {
                if ($requestParams->type == 'contact' && $field->formField === true) {
                    $fields[] = [
                        'key'      => $field->name,
                        'label'    => $field->label,
                        'required' => $field->name == 'email' ? true : false
                    ];
                } elseif ($requestParams->type == 'deal' && $field->formField === true) {
                    $fields[] = [
                        'key'      => $field->name,
                        'label'    => $field->label,
                        'required' => $field->name == 'dealname' ? true : false
                    ];
                } elseif ($requestParams->type == 'ticket' && $field->formField === true) {
                    $fields[] = [
                        'key'      => $field->name,
                        'label'    => $field->label,
                        'required' => $field->name == 'subject' ? true : false
                    ];
                }
            }

            wp_send_json_success($fields, 200);
        } else {
            wp_send_json_error('fields fetching failed', 400);
        }
    }

    public static function getAllOwners($requestParams)
    {
        if (empty($requestParams->api_key)) {
            wp_send_json_error(__('Requested parameter is empty', 'bit-integrations'), 400);
        }

        $apiEndpoint = 'https://api.hubapi.com/crm/v3/owners';
        $header      = [
            'authorization' => 'Bearer ' . $requestParams->api_key
        ];

        $apiResponse = HttpHelper::get($apiEndpoint, null, $header);

        if (isset($apiResponse->results) && !empty($apiResponse->results)) {
            foreach ($apiResponse->results as $owner) {
                $owners[] = [
                    'ownerId'   => $owner->id,
                    'ownerName' => "$owner->firstName $owner->lastName"
                ];
            }
            wp_send_json_success($owners, 200);
        } else {
            wp_send_json_error('fields fetching failed', 400);
        }
    }

    public static function getAllPipelines($requestParams)
    {
        if (empty($requestParams->api_key) || empty($requestParams->type)) {
            wp_send_json_error(__('Requested parameter is empty', 'bit-integrations'), 400);
        }

        $apiEndpoint = "https://api.hubapi.com/crm/v3/pipelines/$requestParams->type";
        $header      = [
            'authorization' => 'Bearer ' . $requestParams->api_key
        ];

        $apiResponse = HttpHelper::get($apiEndpoint, null, $header);

        if (isset($apiResponse->results) && !empty($apiResponse->results)) {
            $pipelines = $apiResponse->results;
            $response  = [];

            foreach ($pipelines as $pipeline) {
                $tempStage = [];
                foreach ($pipeline->stages as $stage) {
                    $tempStage[] = (object) array(
                        'stageId'   => $stage->id,
                        'stageName' => $stage->label
                    );
                }
                $response[] = (object) array(
                    'pipelineId'   => $pipeline->id,
                    'pipelineName' => $pipeline->label,
                    'stages'       => $tempStage
                );
            }
            wp_send_json_success($response, 200);
        } else {
            wp_send_json_error('pipelines fetching failed', 400);
        }
    }

    public static function getAllContacts($requestParams)
    {
        if (empty($requestParams->api_key)) {
            wp_send_json_error(__('Requested parameter is empty', 'bit-integrations'), 400);
        }

        $apiEndpoint = 'https://api.hubapi.com/crm/v3/objects/contacts?limit=100';
        $header      = [
            'authorization' => 'Bearer ' . $requestParams->api_key
        ];

        $apiResponse = HttpHelper::get($apiEndpoint, null, $header);

        if (isset($apiResponse->results) && !empty($apiResponse->results)) {
            foreach ($apiResponse->results as $contact) {
                $contactName = !empty($contact->properties->firstname || $contact->properties->lastname) ? $contact->properties->firstname . ' ' . $contact->properties->lastname : 'N/A';
                $contacts[] = [
                    'contactId'   => $contact->id,
                    'contactName' => $contactName
                ];
            }
            wp_send_json_success($contacts, 200);
        } else {
            wp_send_json_error('contacts fetching failed', 400);
        }
    }

    public static function getAllCompany($requestParams)
    {
        if (empty($requestParams->api_key)) {
            wp_send_json_error(__('Requested parameter is empty', 'bit-integrations'), 400);
        }

        $apiEndpoint = 'https://api.hubapi.com/crm/v3/objects/companies?limit=100';
        $header      = [
            'authorization' => 'Bearer ' . $requestParams->api_key
        ];

        $apiResponse = HttpHelper::get($apiEndpoint, null, $header);

        if (isset($apiResponse->results) && !empty($apiResponse->results)) {
            foreach ($apiResponse->results as $company) {
                $companies[] = [
                    'companyId'   => $company->id,
                    'companyName' => $company->properties->name
                ];
            }
            wp_send_json_success($companies, 200);
        } else {
            wp_send_json_error('fields fetching failed', 400);
        }
    }

    public function execute($integrationData, $fieldValues)
    {
        $integrationDetails = $integrationData->flow_details;
        $fieldMap           = $integrationDetails->field_map;
        $integId            = $integrationData->id;
        $apiKey             = $integrationDetails->api_key;

        if (empty($fieldMap) || empty($apiKey)) {
            $error = new WP_Error('REQ_FIELD_EMPTY', __('Access token, fields map are required for hubspot api', 'bit-integrations'));
            LogHandler::save($this->_integrationID, 'record', 'validation', $error);
            return $error;
        }

        $recordApiHelper = new HubspotRecordApiHelper($apiKey);
        $hubspotResponse = $recordApiHelper->executeRecordApi($integId, $integrationDetails, $fieldValues, $fieldMap);

        if (is_wp_error($hubspotResponse)) {
            return $hubspotResponse;
        }
        return $hubspotResponse;
    }
}
