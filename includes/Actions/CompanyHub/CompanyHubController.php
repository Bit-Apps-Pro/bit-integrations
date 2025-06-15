<?php

/**
 * CompanyHub Integration
 */

namespace BitCode\FI\Actions\CompanyHub;

use WP_Error;
use BitCode\FI\Core\Util\HttpHelper;

/**
 * Provide functionality for CompanyHub integration
 */
class CompanyHubController
{
    protected $_defaultHeader;
    protected $_apiEndpoint;

    public function __construct()
    {
        $this->_apiEndpoint = "https://api.companyhub.com/v1";
    }

    private function checkValidation($fieldsRequestParams, $customParam = '**')
    {
        if (empty($fieldsRequestParams->sub_domain) || empty($fieldsRequestParams->api_key) || empty($customParam)) {
            wp_send_json_error(__('Requested parameter is empty', 'bit-integrations'), 400);
        }
    }

    private function setHeaders($subDomain, $apiKey)
    {
        $this->_defaultHeader = [
            "Authorization"     => "$subDomain $apiKey",
            "Content-Type"      => "application/json"
        ];
    }

    public function authentication($fieldsRequestParams)
    {
        $this->checkValidation($fieldsRequestParams);
        $this->setHeaders($fieldsRequestParams->sub_domain, $fieldsRequestParams->api_key);
        $apiEndpoint  = $this->_apiEndpoint . "/me";
        $response     = HttpHelper::get($apiEndpoint, null, $this->_defaultHeader);

        if (!isset($response->Success) && !$response->Success) {
            wp_send_json_success('Authentication successful', 200);
        } else {
            wp_send_json_error('Please enter valid Sub Domain & API Key', 400);
        }
    }

    public function getAllCompanies($fieldsRequestParams)
    {
        $this->checkValidation($fieldsRequestParams);
        $this->setHeaders($fieldsRequestParams->sub_domain, $fieldsRequestParams->api_key);
        $apiEndpoint  = $this->_apiEndpoint . "/tables/company";
        $response     = HttpHelper::get($apiEndpoint, null, $this->_defaultHeader);

        if (!isset($response->success)) {
            $companies = [];
            foreach ($response->Data as $company) {
                array_push(
                    $companies,
                    (object) [
                        'id'    => $company->ID,
                        'name'  => $company->Name
                    ]
                );
            }
            wp_send_json_success($companies, 200);
        } else {
            wp_send_json_error('Companies fetching failed', 400);
        }
    }

    public function getAllContacts($fieldsRequestParams)
    {
        $this->checkValidation($fieldsRequestParams);
        $this->setHeaders($fieldsRequestParams->sub_domain, $fieldsRequestParams->api_key);
        $apiEndpoint  = $this->_apiEndpoint . "/tables/contact";
        $response     = HttpHelper::get($apiEndpoint, null, $this->_defaultHeader);

        if (!isset($response->success)) {
            $contacts = [];
            foreach ($response->Data as $company) {
                array_push(
                    $contacts,
                    (object) [
                        'id'    => $company->ID,
                        'name'  => $company->Name
                    ]
                );
            }
            wp_send_json_success($contacts, 200);
        } else {
            wp_send_json_error('Contacts fetching failed', 400);
        }
    }


    public function execute($integrationData, $fieldValues)
    {
        $integrationDetails = $integrationData->flow_details;
        $integId            = $integrationData->id;
        $subDomain          = $integrationDetails->sub_domain;
        $apiKey             = $integrationDetails->api_key;
        $fieldMap           = $integrationDetails->field_map;
        $actionName         = $integrationDetails->actionName;

        if (empty($fieldMap) || empty($subDomain) || empty($actionName) || empty($apiKey)) {
            return new WP_Error('REQ_FIELD_EMPTY', __('module, fields are required for CompanyHub api', 'bit-integrations'));
        }

        $recordApiHelper      = new RecordApiHelper($integrationDetails, $integId, $subDomain, $apiKey);
        $companyHubApiResponse = $recordApiHelper->execute($fieldValues, $fieldMap, $actionName);

        if (is_wp_error($companyHubApiResponse)) {
            return $companyHubApiResponse;
        }
        return $companyHubApiResponse;
    }
}
