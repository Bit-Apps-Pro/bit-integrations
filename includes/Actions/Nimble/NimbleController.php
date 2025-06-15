<?php

/**
 * Nimble Integration
 */

namespace BitCode\FI\Actions\Nimble;

use BitCode\FI\Core\Util\HttpHelper;
use WP_Error;

/**
 * Provide functionality for Nimble integration
 */
class NimbleController
{
    protected $_defaultHeader;

    protected $_apiEndpoint;

    public function __construct()
    {
        $this->_apiEndpoint = 'https://app.nimble.com/api/v1';
    }

    public function authentication($fieldsRequestParams)
    {
        $this->checkValidation($fieldsRequestParams);
        $this->setHeaders($fieldsRequestParams->api_key);
        $apiEndpoint = $this->_apiEndpoint . '/myself';
        $response = HttpHelper::get($apiEndpoint, null, $this->_defaultHeader);

        if (isset($response->user_id)) {
            wp_send_json_success(__('Authentication successful', 'bit-integrations'), 200);
        } else {
            wp_send_json_error(__('Please enter valid API key', 'bit-integrations'), 400);
        }
    }

    public function getAllFields($fieldsRequestParams)
    {
        $this->checkValidation($fieldsRequestParams);
        $this->setHeaders($fieldsRequestParams->api_key);
        $apiEndpoint = $this->_apiEndpoint . '/contacts/fields';
        $response = HttpHelper::get($apiEndpoint, null, $this->_defaultHeader);

        if (isset($response->tabs)) {
            $unWantedFields = ['contact employment', '# of employees', 'rating', 'lead status', 'lead source', 'lead type', 'Description', 'Social', 'Files'];
            $person = [];
            $company = [];
            $xofEmployees = [];
            $ratings = [];
            $leadStatus = [];
            $leadSource = [];
            $leadType = [];

            foreach ($response->tabs as $tab) {
                if (\in_array('person', $tab->contact_types)) {
                    $fields = $this->createFields($tab->members, $unWantedFields, 'first name');
                    array_push($person, ...$fields);
                }
                if (\in_array('company', $tab->contact_types)) {
                    $fields = $this->createFields($tab->members, $unWantedFields, 'company name');
                    array_push($company, ...$fields);
                }

                foreach ($tab->members as $field) {
                    switch ($field->name) {
                        case '# of employees':
                            $xofEmployees = $this->createActionFields($field->field_type->values->values);

                            break;
                        case 'rating':
                            $ratings = $this->createActionFields($field->field_type->values->values);

                            break;
                        case 'lead status':
                            $leadStatus = $this->createActionFields($field->field_type->values->values);

                            break;
                        case 'lead source':
                            $leadSource = $this->createActionFields($field->field_type->values->values);

                            break;
                        case 'lead type':
                            $leadType = $this->createActionFields($field->field_type->values->values);

                            break;

                        default:
                            break;
                    }
                }
            }

            wp_send_json_success(
                [
                    'person'       => $person,
                    'company'      => $company,
                    'xofEmployees' => $xofEmployees,
                    'ratings'      => $ratings,
                    'leadStatus'   => $leadStatus,
                    'leadSource'   => $leadSource,
                    'leadTypes'    => $leadType,
                ],
                200
            );
        } else {
            wp_send_json_error(__('Field fetching failed', 'bit-integrations'), 400);
        }
    }

    public function execute($integrationData, $fieldValues)
    {
        $integrationDetails = $integrationData->flow_details;
        $integId = $integrationData->id;
        $apiKey = $integrationDetails->api_key;
        $fieldMap = $integrationDetails->field_map;
        $actionName = $integrationDetails->actionName;

        if (empty($fieldMap) || empty($apiKey) || empty($actionName)) {
            return new WP_Error('REQ_FIELD_EMPTY', wp_sprintf(__('module, fields are required for %s api', 'bit-integrations'), 'Nimble'));
        }

        $recordApiHelper = new RecordApiHelper($integrationDetails, $integId, $apiKey);
        $nimbleApiResponse = $recordApiHelper->execute($fieldValues, $fieldMap, $actionName);

        if (is_wp_error($nimbleApiResponse)) {
            return $nimbleApiResponse;
        }

        return $nimbleApiResponse;
    }

    private function checkValidation($fieldsRequestParams, $customParam = '**')
    {
        if (empty($fieldsRequestParams->api_key) || empty($customParam)) {
            wp_send_json_error(__('Requested parameter is empty', 'bit-integrations'), 400);
        }
    }

    private function setHeaders($apiKey)
    {
        $this->_defaultHeader = [
            'Authorization' => "Bearer {$apiKey}",
            'Accept'        => 'application/json',
            'Content-Type'  => 'application/json'
        ];
    }

    private function createFields($fields, $unWantedFields, $requiredFields)
    {
        $fieldsArr = [];
        foreach ($fields as $field) {
            if (!\in_array($field->name, $unWantedFields)) {
                $fieldsArr[]
                = (object) [
                    'key'      => $field->name,
                    'label'    => ucwords($field->name),
                    'required' => $field->name === $requiredFields ? true : false
                ]
                ;
            }
        }

        return $fieldsArr;
    }

    private function createActionFields($fields)
    {
        $fieldsArr = [];
        foreach ($fields as $field) {
            $fieldsArr[] = $field->value;
        }

        return $fieldsArr;
    }
}
