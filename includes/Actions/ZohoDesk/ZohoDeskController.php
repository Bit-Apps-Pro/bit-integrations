<?php

/**
 * ZohoDesk Integration
 */

namespace BitCode\FI\Actions\ZohoDesk;

use WP_Error;
use BitCode\FI\Flow\FlowController;
use BitCode\FI\Core\Util\HttpHelper;
use BitCode\FI\controller\ZohoAuthController;

/**
 * Provide functionality for ZohoCrm integration
 */
class ZohoDeskController
{
    private $_integrationID;

    public function __construct($integrationID)
    {
        $this->_integrationID = $integrationID;
    }

    public static function refreshOrganizations($queryParams)
    {
        if (
            empty($queryParams->tokenDetails)
            || empty($queryParams->dataCenter)
            || empty($queryParams->clientId)
            || empty($queryParams->clientSecret)
        ) {
            wp_send_json_error(
                __(
                    'Requested parameter is empty',
                    'bit-integrations'
                ),
                400
            );
        }
        $response = [];
        if ((intval($queryParams->tokenDetails->generates_on) + (55 * 60)) < time()) {
            $response['tokenDetails'] = ZohoAuthController::_refreshAccessToken($queryParams);
        }

        $organizationsMetaApiEndpoint = "https://desk.{$queryParams->dataCenter}/api/v1/organizations";

        $authorizationHeader['Authorization'] = "Zoho-oauthtoken {$queryParams->tokenDetails->access_token}";
        $organizationsMetaResponse = HttpHelper::get($organizationsMetaApiEndpoint, null, $authorizationHeader);

        if (!is_wp_error($organizationsMetaResponse)) {
            $allOrganizations = [];
            $organizations = $organizationsMetaResponse->data;

            if (count($organizations) > 0) {
                foreach ($organizations as $organization) {
                    $allOrganizations[$organization->companyName] = (object) [
                        'orgId' => $organization->id,
                        'portalName' => $organization->companyName
                    ];
                }
            }
            uksort($allOrganizations, 'strnatcasecmp');
            $response['organizations'] = $allOrganizations;
        } else {
            wp_send_json_error(
                empty($organizationsMetaResponse->data) ? 'Unknown' : $organizationsMetaResponse->error,
                400
            );
        }
        if (!empty($response['tokenDetails']) && !empty($queryParams->id)) {
            ZohoAuthController::_saveRefreshedToken($queryParams->formID, $queryParams->id, $response['tokenDetails'], $response['lists']);
        }
        wp_send_json_success($response, 200);
        // } else {
        //     wp_send_json_error(
        //         __(
        //             'Token expired',
        //             'bit-integrations'
        //         ),
        //         401
        //     );
        // }
    }

    /**
     * Process ajax request for refresh crm modules
     *
     * @return JSON crm module data
     */
    public static function refreshDepartments($queryParams)
    {
        if (
            empty($queryParams->tokenDetails)
            || empty($queryParams->dataCenter)
            || empty($queryParams->clientId)
            || empty($queryParams->clientSecret)
            || empty($queryParams->orgId)
        ) {
            wp_send_json_error(
                __(
                    'Requested parameter is empty',
                    'bit-integrations'
                ),
                400
            );
        }
        $response = [];
        if ((intval($queryParams->tokenDetails->generates_on) + (55 * 60)) < time()) {
            $response['tokenDetails'] = ZohoAuthController::_refreshAccessToken($queryParams);
        }

        $departmentsMetaApiEndpoint = "https://desk.{$queryParams->dataCenter}/api/v1/departments?isEnabled=true&limit=100";

        $authorizationHeader['orgId'] = "{$queryParams->orgId}";
        $authorizationHeader['Authorization'] = "Zoho-oauthtoken {$queryParams->tokenDetails->access_token}";
        $departmentsMetaResponse = HttpHelper::get($departmentsMetaApiEndpoint, null, $authorizationHeader);

        if (!is_wp_error($departmentsMetaResponse)) {
            $allDepartments = [];
            $departments = $departmentsMetaResponse->data;

            if (count($departments) > 0) {
                foreach ($departments as $department) {
                    $allDepartments[$department->name] = (object) [
                        'departmentId' => $department->id,
                        'departmentName' => $department->name
                    ];
                }
            }
            uksort($allDepartments, 'strnatcasecmp');
            $response['departments'] = $allDepartments;
        } else {
            wp_send_json_error(
                empty($departmentsMetaResponse->data) ? 'Unknown' : $departmentsMetaResponse->error,
                400
            );
        }
        if (!empty($response['tokenDetails']) && !empty($queryParams->id)) {
            ZohoAuthController::_saveRefreshedToken($queryParams->formID, $queryParams->id, $response['tokenDetails'], $response['lists']);
        }
        wp_send_json_success($response, 200);
    }

    /**
     * Process ajax request for refresh crm layouts
     *
     * @param  Object $queryParams Params to fetch fields
     *
     * @return JSON crm layout data
     */
    public static function refreshFields($queryParams)
    {
        if (
            empty($queryParams->tokenDetails)
            || empty($queryParams->dataCenter)
            || empty($queryParams->clientId)
            || empty($queryParams->clientSecret)
            || empty($queryParams->orgId)
        ) {
            wp_send_json_error(
                __(
                    'Requested parameter is empty',
                    'bit-integrations'
                ),
                400
            );
        }
        $response = [];
        if ((intval($queryParams->tokenDetails->generates_on) + (55 * 60)) < time()) {
            $response['tokenDetails'] = ZohoAuthController::_refreshAccessToken($queryParams);
        }

        $fieldsMetaApiEndpoint = "https://desk.{$queryParams->dataCenter}/api/v1/organizationFields?module=tickets";

        $authorizationHeader['orgId'] = "{$queryParams->orgId}";
        $authorizationHeader['Authorization'] = "Zoho-oauthtoken {$queryParams->tokenDetails->access_token}";
        $fieldsMetaResponse = HttpHelper::get($fieldsMetaApiEndpoint, null, $authorizationHeader);

        if (!is_wp_error($fieldsMetaResponse)) {
            $fields = $fieldsMetaResponse->data;

            if (count($fields) > 0) {
                $response['fields']['Contact Name - Last Name'] = (object) [
                    'apiName' => 'lastName',
                    'displayLabel' => 'Contact Name - Last Name',
                    'isCustomField' => false,
                    'required' => true
                ];
                $response['fields']['Contact Name - First Name'] = (object) [
                    'apiName' => 'firstName',
                    'displayLabel' => 'Contact Name - First Name',
                    'isCustomField' => false,
                    'required' => false
                ];
                $response['required'][] = 'lastName';
                foreach ($fields as $field) {
                    if ($field->apiName === 'contactId' || $field->apiName === 'assigneeId') {
                        continue;
                    }
                    $response['fields'][$field->displayLabel] = (object) [
                        'apiName' => $field->apiName,
                        'displayLabel' => $field->displayLabel,
                        'isCustomField' => $field->isCustomField,
                        'required' => $field->isMandatory
                    ];

                    if ($field->isMandatory) {
                        $response['required'][] = $field->apiName;
                    }
                }
            }
            uksort($response['fields'], 'strnatcasecmp');
            usort($response['required'], 'strnatcasecmp');
        } else {
            wp_send_json_error(
                $fieldsMetaResponse->status === 'error' ? $fieldsMetaResponse->message : 'Unknown',
                400
            );
        }
        if (!empty($response['tokenDetails']) && $response['tokenDetails'] && !empty($queryParams->id)) {
            $response['queryModule'] = $queryParams->module;
            ZohoAuthController::_saveRefreshedToken($queryParams->formID, $queryParams->id, $response['tokenDetails'], $response);
        }
        wp_send_json_success($response, 200);
    }

    /**
     * Process ajax request for refresh crm modules
     *
     * @param  Object $queryParams Params to refresh ticket owner
     *
     * @return JSON crm module data
     */
    public static function refreshTicketOwners($queryParams)
    {
        if (
            empty($queryParams->tokenDetails)
            || empty($queryParams->dataCenter)
            || empty($queryParams->clientId)
            || empty($queryParams->clientSecret)
            || empty($queryParams->orgId)
        ) {
            wp_send_json_error(
                __(
                    'Requested parameter is empty',
                    'bit-integrations'
                ),
                400
            );
        }
        $response = [];
        if ((intval($queryParams->tokenDetails->generates_on) + (55 * 60)) < time()) {
            $response['tokenDetails'] = ZohoAuthController::_refreshAccessToken($queryParams);
        }

        $ownersMetaApiEndpoint = "https://desk.{$queryParams->dataCenter}/api/v1/agents?status=ACTIVE&limit=100";

        $authorizationHeader['orgId'] = "{$queryParams->orgId}";
        $authorizationHeader['Authorization'] = "Zoho-oauthtoken {$queryParams->tokenDetails->access_token}";
        $ownersMetaResponse = HttpHelper::get($ownersMetaApiEndpoint, null, $authorizationHeader);

        if (!is_wp_error($ownersMetaResponse)) {
            $owners = $ownersMetaResponse->data;

            if (count($owners) > 0) {
                foreach ($owners as $owner) {
                    $response['owners'][] = (object) [
                        'ownerId' => $owner->id,
                        'ownerName' => $owner->name
                    ];
                }
            }
        } else {
            wp_send_json_error(
                empty($ownersMetaResponse->data) ? 'Unknown' : $ownersMetaResponse->error,
                400
            );
        }
        if (!empty($response['tokenDetails']) && !empty($queryParams->id)) {
            ZohoAuthController::_saveRefreshedToken($queryParams->formID, $queryParams->id, $response['tokenDetails'], $response['lists']);
        }
        wp_send_json_success($response, 200);
    }

    /**
     * Process ajax request for refresh crm modules
     *
     * @param  Object $queryParams Params to refresh ticket Products
     *
     * @return JSON crm module data
     */
    public static function refreshProducts($queryParams)
    {
        if (
            empty($queryParams->tokenDetails)
            || empty($queryParams->dataCenter)
            || empty($queryParams->clientId)
            || empty($queryParams->clientSecret)
            || empty($queryParams->orgId)
            || empty($queryParams->departmentId)
        ) {
            wp_send_json_error(
                __(
                    'Requested parameter is empty',
                    'bit-integrations'
                ),
                400
            );
        }

        $response = [];
        if ((intval($queryParams->tokenDetails->generates_on) + (55 * 60)) < time()) {
            $response['tokenDetails'] = ZohoAuthController::_refreshAccessToken($queryParams);
        }

        $productsMetaApiEndpoint = "https://desk.{$queryParams->dataCenter}/api/v1/products?departmentId={$queryParams->departmentId}&limit=100";

        $authorizationHeader['orgId'] = "{$queryParams->orgId}";
        $authorizationHeader['Authorization'] = "Zoho-oauthtoken {$queryParams->tokenDetails->access_token}";
        $productsMetaResponse = HttpHelper::get($productsMetaApiEndpoint, null, $authorizationHeader);

        if (!is_wp_error($productsMetaResponse)) {
            $products = $productsMetaResponse->data;

            if (count($products) > 0) {
                foreach ($products as $product) {
                    $response['products'][] = (object) [
                        'productId' => $product->id,
                        'productName' => $product->productName
                    ];
                }
            }
        } else {
            wp_send_json_error(
                empty($productsMetaResponse->data) ? 'Unknown' : $productsMetaResponse->error,
                400
            );
        }
        if (!empty($response['tokenDetails']) && !empty($queryParams->id)) {
            ZohoAuthController::_saveRefreshedToken($queryParams->formID, $queryParams->id, $response['tokenDetails'], $response['lists']);
        }
        wp_send_json_success($response, 200);
    }

    public function execute($integrationData, $fieldValues)
    {
        $integrationDetails = $integrationData->flow_details;

        $tokenDetails = $integrationDetails->tokenDetails;
        $orgId = $integrationDetails->orgId;
        $department = $integrationDetails->department;
        $dataCenter = $integrationDetails->dataCenter;
        $fieldMap = $integrationDetails->field_map;
        $required = $integrationDetails->default->fields->{$orgId}->required;
        $actions = $integrationDetails->actions;
        if (
            empty($tokenDetails)
            || empty($orgId)
            || empty($department)
            || empty($fieldMap)
        ) {
            return new WP_Error('REQ_FIELD_EMPTY', __('list are required for zoho desk api', 'bit-integrations'));
        }

        if ((intval($tokenDetails->generates_on) + (55 * 60)) < time()) {
            $requiredParams['clientId'] = $integrationDetails->clientId;
            $requiredParams['clientSecret'] = $integrationDetails->clientSecret;
            $requiredParams['dataCenter'] = $integrationDetails->dataCenter;
            $requiredParams['tokenDetails'] = $tokenDetails;
            $newTokenDetails = ZohoAuthController::_refreshAccessToken((object)$requiredParams);
            if ($newTokenDetails) {
                ZohoAuthController::_saveRefreshedToken($this->_integrationID, $newTokenDetails);
                $tokenDetails = $newTokenDetails;
            }
        }
        // $actions = $integrationDetails->actions;
        $recordApiHelper = new RecordApiHelper($tokenDetails, $orgId, $this->_integrationID);

        $zdeskApiResponse = $recordApiHelper->execute(
            $department,
            $dataCenter,
            $fieldValues,
            $fieldMap,
            $required,
            $actions
        );

        if (is_wp_error($zdeskApiResponse)) {
            return $zdeskApiResponse;
        }
        return $zdeskApiResponse;
    }
}
