<?php

/**
 * PerfexCRM Integration
 */

namespace BitCode\FI\Actions\PerfexCRM;

use WP_Error;
use BitCode\FI\Core\Util\HttpHelper;

/**
 * Provide functionality for PerfexCRM integration
 */
class PerfexCRMController
{
    protected $_defaultHeader;
    protected $apiEndpoint;
    protected $domain;

    private function setApiEndpoint()
    {
        return $this->apiEndpoint = "{$this->domain}/api";
    }

    private function checkValidation($fieldsRequestParams, $customParam = '**')
    {
        if (empty($fieldsRequestParams->api_token) || empty($fieldsRequestParams->domain) || empty($customParam)) {
            wp_send_json_error(__('Requested parameter is empty', 'bit-integrations'), 400);
        }
    }

    private function setHeaders($apiToken)
    {
        return
            [
                "authtoken"  => $apiToken,
                "Content-type" => "application/json",
            ];
    }

    public function authentication($fieldsRequestParams)
    {
        $this->checkValidation($fieldsRequestParams);
        $this->domain  = $fieldsRequestParams->domain;
        $apiToken      = $fieldsRequestParams->api_token;
        $apiEndpoint   = $this->setApiEndpoint() . "/staffs";
        $headers       = $this->setHeaders($apiToken);
        $response      = HttpHelper::get($apiEndpoint, null, $headers);

        if (isset($response->errors) || (isset($response->status) && !$response->status)) {
            wp_send_json_error('Please enter valid API Token or Access Api URL', 400);
        } else {
            wp_send_json_success('Authentication successful', 200);
        }
    }

    public function getCustomFields($fieldsRequestParams)
    {
        $this->checkValidation($fieldsRequestParams, $fieldsRequestParams->action_name);
        $this->domain   = $fieldsRequestParams->domain;
        $apiToken       = $fieldsRequestParams->api_token;

        switch ($fieldsRequestParams->action_name) {
            case 'customer':
                $actionName = 'customers';
                break;
            case 'contact':
                $actionName = 'contacts';
                break;
            case 'lead':
                $actionName = 'leads';
                break;
            case 'project':
                $actionName = 'projects';
                break;

            default:
                $actionName = '';
                break;
        }

        $apiEndpoint    = $this->setApiEndpoint() . "/custom_fields/{$actionName}";
        $headers        = $this->setHeaders($apiToken);
        $response       = HttpHelper::get($apiEndpoint, null, $headers);

        if (isset($response->errors) || (isset($response->status) && !$response->status)) {
            wp_send_json_error('Custom Fields fetching failed', 400);
        } else {
            $fieldMap = [];
            foreach ($response as $field) {
                array_push(
                    $fieldMap,
                    (object)[
                        'key'       => $field->field_name,
                        'label'     => $field->label,
                        'required'  => $field->required === "1" ? true : false
                    ]
                );
            }
            wp_send_json_success($fieldMap, 200);
        }
    }

    public function getAllCustomer($fieldsRequestParams)
    {
        $this->checkValidation($fieldsRequestParams);
        $this->domain   = $fieldsRequestParams->domain;
        $apiToken       = $fieldsRequestParams->api_token;
        $apiEndpoint    = $this->setApiEndpoint() . "/customers";
        $headers        = $this->setHeaders($apiToken);
        $response       = HttpHelper::get($apiEndpoint, null, $headers);

        if (isset($response->errors) || (isset($response->status) && !$response->status)) {
            wp_send_json_error('Customer fetching failed', 400);
        } else {
            $customers = [];
            foreach ($response as $customer) {
                array_push(
                    $customers,
                    (object)[
                        'id' => $customer->userid,
                        'name' => $customer->company
                    ]
                );
            }
            wp_send_json_success($customers, 200);
        }
    }

    public function getAllLead($fieldsRequestParams)
    {
        $this->checkValidation($fieldsRequestParams);
        $this->domain   = $fieldsRequestParams->domain;
        $apiToken       = $fieldsRequestParams->api_token;
        $apiEndpoint    = $this->setApiEndpoint() . "/leads";
        $headers        = $this->setHeaders($apiToken);
        $response       = HttpHelper::get($apiEndpoint, null, $headers);

        if (isset($response->errors) || (isset($response->status) && !$response->status)) {
            wp_send_json_error('Lead fetching failed', 400);
        } else {
            $leads = [];
            foreach ($response as $lead) {
                array_push(
                    $leads,
                    (object)[
                        'id' => $lead->id,
                        'name' => $lead->name
                    ]
                );
            }
            wp_send_json_success($leads, 200);
        }
    }

    public function getAllStaff($fieldsRequestParams)
    {
        $this->checkValidation($fieldsRequestParams);
        $this->domain   = $fieldsRequestParams->domain;
        $apiToken       = $fieldsRequestParams->api_token;
        $apiEndpoint    = $this->setApiEndpoint() . "/staffs";
        $headers        = $this->setHeaders($apiToken);
        $response       = HttpHelper::get($apiEndpoint, null, $headers);

        if (isset($response->errors) || (isset($response->status) && !$response->status)) {
            wp_send_json_error('Project Member fetching failed', 400);
        } else {
            $staffs = [];
            foreach ($response as $staff) {
                array_push(
                    $staffs,
                    (object)[
                        'id' => $staff->staffid,
                        'name' => "$staff->firstname $staff->lastname"
                    ]
                );
            }
            wp_send_json_success($staffs, 200);
        }
    }

    public function execute($integrationData, $fieldValues)
    {
        $integrationDetails = $integrationData->flow_details;
        $integId            = $integrationData->id;
        $apiToken           = $integrationDetails->api_token;
        $fieldMap           = $integrationDetails->field_map;
        $actionName         = $integrationDetails->actionName;
        $actionId           = $integrationDetails->actionId;
        $domain             = $integrationDetails->domain;

        if (empty($fieldMap) || empty($apiToken) || empty($actionName) || empty($domain)) {
            return new WP_Error('REQ_FIELD_EMPTY', __('module, fields are required for PerfexCRM api', 'bit-integrations'));
        }

        $recordApiHelper        = new RecordApiHelper($integrationDetails, $integId, $apiToken, $domain);
        $perfexCRMApiResponse   = $recordApiHelper->execute($fieldValues, $fieldMap, $actionName);

        if (is_wp_error($perfexCRMApiResponse)) {
            return $perfexCRMApiResponse;
        }
        return $perfexCRMApiResponse;
    }
}
