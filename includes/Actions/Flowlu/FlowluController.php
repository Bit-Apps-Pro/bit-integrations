<?php

/**
 * Flowlu Integration
 */

namespace BitCode\FI\Actions\Flowlu;

use WP_Error;
use BitCode\FI\Core\Util\HttpHelper;

/**
 * Provide functionality for Flowlu integration
 */
class FlowluController
{
    protected $_defaultHeader;
    protected $apiEndpoint;
    protected $comapnyName;

    public function __construct()
    {
        $this->_defaultHeader = ["Content-type" => "application/json"];
    }

    private function setApiEndpoint()
    {
        return $this->apiEndpoint = "https://{$this->comapnyName}.flowlu.com/api/v1";
    }

    private function checkValidation($fieldsRequestParams, $customParam = '**')
    {
        if (empty($fieldsRequestParams->api_key) || empty($fieldsRequestParams->company_name) || empty($customParam)) {
            wp_send_json_error(__('Requested parameter is empty', 'bit-integrations'), 400);
        }
    }

    public function authentication($fieldsRequestParams)
    {
        $this->checkValidation($fieldsRequestParams);
        $this->comapnyName  = $fieldsRequestParams->company_name;
        $apiKey             = $fieldsRequestParams->api_key;
        $apiEndpoint        = $this->setApiEndpoint() . "/module/crm/account?api_key={$apiKey}";
        $response           = HttpHelper::get($apiEndpoint, null, $this->_defaultHeader);

        if (!isset($response->error)) {
            wp_send_json_success('Authentication successful', 200);
        } else {
            wp_send_json_error('Please enter valid Session Token or Link Name', 400);
        }
    }

    public function getAllFields($fieldsRequestParams)
    {
        $this->checkValidation($fieldsRequestParams, $fieldsRequestParams->action_name);
        switch ($fieldsRequestParams->action_name) {
            case 'account':
                $action = 'crm/account';
                $fieldsetId = (int) $fieldsRequestParams->selectedAccountType === 1 ? 5 : 6;
                break;
            case 'opportunity':
                $action = 'crm/lead';
                $fieldsetId = 3;
                break;
            case 'project':
                $action = 'st/projects';
                $fieldsetId = 1;
                break;
            default:
                break;
        }

        $this->comapnyName  = $fieldsRequestParams->company_name;
        $apiKey             = $fieldsRequestParams->api_key;
        $apiEndpoint        = $this->setApiEndpoint() . "/module/{$action}?api_key={$apiKey}";
        $response           = HttpHelper::get($apiEndpoint, null, $this->_defaultHeader);

        if (!isset($response->error)) {
            $fieldMap   = [];
            $fieldsName = ['id', 'type', 'honorific_title_id', 'created_date', 'updated_date', 'merged_to', 'owner_id', 'industry_id', 'account_category_id', 'customer_id', 'contact_id', 'source_id', 'assignee_id', 'pipeline_id', 'pipeline_stage_id', 'active', 'closing_status_id', 'created_by', 'last_activity_id', 'last_activity_time', 'last_activity_model', 'ordering', 'auto_calc', 'pricelist_id', 'manager_id', 'ordering', 'stage_id', 'project_type_id', 'briefcase_id', 'is_archive', 'priority', 'customer_id', 'customer_crm_contact_id', 'archive_date', 'workspace_id', 'archive_description', 'crm_lead_id', 'uuid', 'ref', 'ref_id', 'updated_by', 'billing_type', 'default_billing_rate', 'default_bill_time_type', 'use_default_invoice_split_type', 'default_invoice_split_type_in_project', 'default_invoice_item_format', 'tasks_workflow_id'];
            foreach ($response->response->fields as $field) {
                if (array_search($field->code, $fieldsName) === false) {
                    array_push(
                        $fieldMap,
                        [
                            'key'       => $field->code,
                            'label'     => ucwords(str_replace('_', ' ', $field->name)),
                            'required'  => $field->code === 'name' ? true : false
                        ]
                    );
                }
            }

            if (isset($fieldsetId)) {
                $customFieldEndpoint = $this->setApiEndpoint() . "/module/customfields/fields/list?api_key={$apiKey}";
                $customFieldResponse = HttpHelper::get($customFieldEndpoint, null, $this->_defaultHeader);

                if (!isset($customFieldResponse->error)) {
                    foreach ($customFieldResponse->response->items as $field) {
                        if ($field->fieldset_id === $fieldsetId) {
                            array_push(
                                $fieldMap,
                                [
                                    'key'       => "cf_{$field->id}",
                                    'label'     => $field->name,
                                    'required'  => $field->required ? true : false
                                ]
                            );
                        }
                    }
                }
            }

            wp_send_json_success($fieldMap, 200);
        } else {
            wp_send_json_error('Fields fetching failed', 400);
        }
    }

    public function getAllAccountCategories($fieldsRequestParams)
    {
        $this->checkValidation($fieldsRequestParams);
        $this->comapnyName  = $fieldsRequestParams->company_name;
        $apiKey             = $fieldsRequestParams->api_key;
        $apiEndpoint        = $this->setApiEndpoint() . "/module/crm/account_category/list?api_key={$apiKey}";
        $response           = HttpHelper::get($apiEndpoint, null, $this->_defaultHeader);

        if (!isset($response->error)) {
            $accountCategories = [];
            foreach ($response->response->items as $field) {
                array_push(
                    $accountCategories,
                    [
                        'id'    => $field->id,
                        'name'  => $field->name
                    ]
                );
            }

            wp_send_json_success($accountCategories, 200);
        } else {
            wp_send_json_error('Category fetching failed', 400);
        }
    }

    public function getAllIndustries($fieldsRequestParams)
    {
        $this->checkValidation($fieldsRequestParams);
        $this->comapnyName  = $fieldsRequestParams->company_name;
        $apiKey             = $fieldsRequestParams->api_key;
        $apiEndpoint        = $this->setApiEndpoint() . "/module/crm/industry/list?api_key={$apiKey}";
        $response           = HttpHelper::get($apiEndpoint, null, $this->_defaultHeader);

        if (!isset($response->error)) {
            $industries = [];
            foreach ($response->response->items as $field) {
                array_push(
                    $industries,
                    [
                        'id'    => $field->id,
                        'name'  => $field->name
                    ]
                );
            }

            wp_send_json_success($industries, 200);
        } else {
            wp_send_json_error('Industry fetching failed', 400);
        }
    }

    public function getAllPipelines($fieldsRequestParams)
    {
        $this->checkValidation($fieldsRequestParams);
        $this->comapnyName  = $fieldsRequestParams->company_name;
        $apiKey             = $fieldsRequestParams->api_key;
        $apiEndpoint        = $this->setApiEndpoint() . "/module/crm/pipeline/list?api_key={$apiKey}";
        $response           = HttpHelper::get($apiEndpoint, null, $this->_defaultHeader);

        if (!isset($response->error)) {
            $pipelines = [];
            foreach ($response->response->items as $field) {
                array_push(
                    $pipelines,
                    [
                        'id'    => $field->id,
                        'name'  => $field->name
                    ]
                );
            }

            wp_send_json_success($pipelines, 200);
        } else {
            wp_send_json_error('Pipelines fetching failed', 400);
        }
    }

    public function getAllStages($fieldsRequestParams)
    {
        $this->checkValidation($fieldsRequestParams, $fieldsRequestParams->pipeline_id);
        $this->comapnyName  = $fieldsRequestParams->company_name;
        $apiKey             = $fieldsRequestParams->api_key;
        $apiEndpoint        = $this->setApiEndpoint() . "/module/crm/pipeline_stage/list?api_key={$apiKey}";
        $response           = HttpHelper::get($apiEndpoint, null, $this->_defaultHeader);

        if (!isset($response->error)) {
            $stages = [];
            foreach ($response->response->items as $field) {
                if ($field->pipeline_id === (int) $fieldsRequestParams->pipeline_id) {
                    array_push(
                        $stages,
                        [
                            'id'    => $field->id,
                            'name'  => $field->name
                        ]
                    );
                }
            }

            wp_send_json_success($stages, 200);
        } else {
            wp_send_json_error('Opportunity stages fetching failed', 400);
        }
    }

    public function getAllSources($fieldsRequestParams)
    {
        $this->checkValidation($fieldsRequestParams);
        $this->comapnyName  = $fieldsRequestParams->company_name;
        $apiKey             = $fieldsRequestParams->api_key;
        $apiEndpoint        = $this->setApiEndpoint() . "/module/crm/source/list?api_key={$apiKey}";
        $response           = HttpHelper::get($apiEndpoint, null, $this->_defaultHeader);

        if (!isset($response->error)) {
            $sources = [];
            foreach ($response->response->items as $field) {
                array_push(
                    $sources,
                    [
                        'id'    => $field->id,
                        'name'  => $field->name
                    ]
                );
            }

            wp_send_json_success($sources, 200);
        } else {
            wp_send_json_error('Source fetching failed', 400);
        }
    }

    public function getAllCustomers($fieldsRequestParams)
    {
        $this->checkValidation($fieldsRequestParams);
        $this->comapnyName  = $fieldsRequestParams->company_name;
        $apiKey             = $fieldsRequestParams->api_key;
        $apiEndpoint        = $this->setApiEndpoint() . "/module/crm/account/list?api_key={$apiKey}";
        $response           = HttpHelper::get($apiEndpoint, null, $this->_defaultHeader);

        if (!isset($response->error)) {
            $customers = [];
            foreach ($response->response->items as $field) {
                array_push(
                    $customers,
                    [
                        'id'    => $field->id,
                        'name'  => $field->name
                    ]
                );
            }

            wp_send_json_success($customers, 200);
        } else {
            wp_send_json_error('Customer fetching failed', 400);
        }
    }

    public function getAllManagers($fieldsRequestParams)
    {
        $this->checkValidation($fieldsRequestParams);
        $this->comapnyName  = $fieldsRequestParams->company_name;
        $apiKey             = $fieldsRequestParams->api_key;
        $apiEndpoint        = $this->setApiEndpoint() . "/module/core/user/list?api_key={$apiKey}";
        $response           = HttpHelper::get($apiEndpoint, null, $this->_defaultHeader);

        if (!isset($response->error)) {
            $managers = [];
            foreach ($response->response->items as $field) {
                array_push(
                    $managers,
                    [
                        'id'    => $field->id,
                        'name'  => $field->name
                    ]
                );
            }

            wp_send_json_success($managers, 200);
        }
        wp_send_json_error('Project Manager fetching failed', 400);
    }

    public function getAllProjectStage($fieldsRequestParams)
    {
        $this->checkValidation($fieldsRequestParams);
        $this->comapnyName  = $fieldsRequestParams->company_name;
        $apiKey             = $fieldsRequestParams->api_key;
        $apiEndpoint        = $this->setApiEndpoint() . "/module/st/stages/list?api_key={$apiKey}";
        $response           = HttpHelper::get($apiEndpoint, null, $this->_defaultHeader);

        if (!isset($response->error)) {
            $stages = [];
            foreach ($response->response->items as $field) {
                array_push(
                    $stages,
                    [
                        'id'    => $field->id,
                        'name'  => $field->name
                    ]
                );
            }

            wp_send_json_success($stages, 200);
        }
        wp_send_json_error('Project Manager fetching failed', 400);
    }

    public function getAllPortfolio($fieldsRequestParams)
    {
        $this->checkValidation($fieldsRequestParams);
        $this->comapnyName  = $fieldsRequestParams->company_name;
        $apiKey             = $fieldsRequestParams->api_key;
        $apiEndpoint        = $this->setApiEndpoint() . "/module/st/portfolio/list?api_key={$apiKey}";
        $response           = HttpHelper::get($apiEndpoint, null, $this->_defaultHeader);

        if (!isset($response->error)) {
            $portfolios = [];
            foreach ($response->response->items as $field) {
                array_push(
                    $portfolios,
                    [
                        'id'    => $field->id,
                        'name'  => $field->name
                    ]
                );
            }

            wp_send_json_success($portfolios, 200);
        }
        wp_send_json_error('Project Manager fetching failed', 400);
    }

    public function getAllProjectOpportunity($fieldsRequestParams)
    {
        $this->checkValidation($fieldsRequestParams);
        $this->comapnyName  = $fieldsRequestParams->company_name;
        $apiKey             = $fieldsRequestParams->api_key;
        $apiEndpoint        = $this->setApiEndpoint() . "/module/crm/lead/list?api_key={$apiKey}";
        $response           = HttpHelper::get($apiEndpoint, null, $this->_defaultHeader);

        if (!isset($response->error)) {
            $portfolios = [];
            foreach ($response->response->items as $field) {
                array_push(
                    $portfolios,
                    [
                        'id'    => $field->id,
                        'name'  => $field->name
                    ]
                );
            }

            wp_send_json_success($portfolios, 200);
        }
        wp_send_json_error('Project Manager fetching failed', 400);
    }

    public function execute($integrationData, $fieldValues)
    {
        $integrationDetails = $integrationData->flow_details;
        $integId            = $integrationData->id;
        $apiKey             = $integrationDetails->api_key;
        $fieldMap           = $integrationDetails->field_map;
        $actionName         = $integrationDetails->actionName;
        $comapnyName        = $integrationDetails->company_name;

        if (empty($fieldMap) || empty($apiKey) || empty($actionName) || empty($comapnyName)) {
            return new WP_Error('REQ_FIELD_EMPTY', __('module, fields are required for Flowlu api', 'bit-integrations'));
        }

        $recordApiHelper   = new RecordApiHelper($integrationDetails, $integId, $comapnyName);
        $flowluApiResponse = $recordApiHelper->execute($fieldValues, $fieldMap, $actionName, $apiKey);

        if (is_wp_error($flowluApiResponse)) {
            return $flowluApiResponse;
        }
        return $flowluApiResponse;
    }
}
