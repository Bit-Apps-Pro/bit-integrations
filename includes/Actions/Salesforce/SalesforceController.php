<?php

/**
 * Selesforce Integration
 */

namespace BitCode\FI\Actions\Salesforce;

use WP_Error;
use BitCode\FI\Flow\FlowController;
use BitCode\FI\Core\Util\HttpHelper;

class SalesforceController
{
    private $_integrationID;

    // public function __construct($integrationID)
    // {
    //     $this->_integrationID = $integrationID;
    // }

    public static function generateTokens($requestsParams)
    {
        if (
            empty($requestsParams->clientId)
            || empty($requestsParams->clientSecret)
            || empty($requestsParams->redirectURI)
            || empty($requestsParams->code)
        ) {
            wp_send_json_error(
                __(
                    'Requested parameter is empty',
                    'bit-integrations'
                ),
                400
            );
        }

        $apiEndpoint = 'https://login.salesforce.com/services/oauth2/token?grant_type=authorization_code&client_id=' . $requestsParams->clientId . '&client_secret=' . $requestsParams->clientSecret . '&redirect_uri=' . $requestsParams->redirectURI . '&code=' . $requestsParams->code;
        $requestParams = [
            'grant_type'    => 'authorization_code',
            'code'          => explode('#', $requestsParams->code)[0],
            'client_id'     => $requestsParams->clientId,
            'client_secret' => $requestsParams->clientSecret,
            'redirect_uri'  => urldecode($requestsParams->redirectURI),
            'format'        => 'json',
        ];
        $apiResponse = HttpHelper::post($apiEndpoint, $requestParams);

        if (is_wp_error($apiResponse) || !empty($apiResponse->error)) {
            wp_send_json_error(
                empty($apiResponse->error) ? 'Unknown' : $apiResponse->error,
                400
            );
        }
        $apiResponse->generates_on = time();
        wp_send_json_success($apiResponse, 200);
    }

    public function customActions($customFieldRequestParams)
    {
        if (
            empty($customFieldRequestParams->tokenDetails)
            || empty($customFieldRequestParams->clientId)
            || empty($customFieldRequestParams->clientSecret)
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
        if ((\intval($customFieldRequestParams->tokenDetails->generates_on) + (55 * 60)) < time()) {
            $response['tokenDetails'] = self::refreshAccessToken($customFieldRequestParams);
        }

        $apiEndpoint = "{$customFieldRequestParams->tokenDetails->instance_url}/services/data/v37.0/sobjects";
        $authorizationHeader['Authorization'] = "Bearer {$customFieldRequestParams->tokenDetails->access_token}";
        $authorizationHeader['Content-Type'] = 'application/json';
        $apiResponse = HttpHelper::get($apiEndpoint, null, $authorizationHeader);

        if (!property_exists((object) $apiResponse, 'sobjects')) {
            wp_send_json_error($apiResponse, 400);
        }

        $customActions = array_filter($apiResponse->sobjects, function ($action) {
            if ($action->custom) {
                return true;
            }
        });

        $allCustomActions = [];
        foreach ($customActions as $action) {
            $allCustomActions[] = (object) [
                'label' => $action->label,
                'value' => $action->name
            ];
        }

        if (!empty($response['tokenDetails'])) {
            self::saveRefreshedToken($customFieldRequestParams->flowID, $response['tokenDetails'], $response['organizations']);
        }
        wp_send_json_success($allCustomActions, 200);
    }

    public function customFields($customFieldRequestParams)
    {
        if (
            empty($customFieldRequestParams->tokenDetails)
            || empty($customFieldRequestParams->actionName)
            || empty($customFieldRequestParams->clientId)
            || empty($customFieldRequestParams->clientSecret)
        ) {
            wp_send_json_error(
                __(
                    'Requested parameter is empty',
                    'bit-integrations'
                ),
                400
            );
        }
        $response = ['tokenDetails' => $customFieldRequestParams->tokenDetails];
        if ((\intval($customFieldRequestParams->tokenDetails->generates_on) + (55 * 60)) < time()) {
            $response['tokenDetails'] = self::refreshAccessToken($customFieldRequestParams);
        }

        $actionMap = [
            'contact-create'      => 'Contact',
            'lead-create'         => 'Lead',
            'account-create'      => 'Account',
            'campaign-create'     => 'Campaign',
            'add-campaign-member' => 'Campaign',
            'opportunity-create'  => 'Opportunity',
            'event-create'        => 'Event',
            'case-create'         => 'Case'
        ];

        $action = $actionMap[$customFieldRequestParams->actionName] ?? $customFieldRequestParams->actionName;
        $apiEndpoint = "{$customFieldRequestParams->tokenDetails->instance_url}/services/data/v37.0/sobjects/{$action}/describe";
        $headers = [
            'Authorization' => "Bearer {$customFieldRequestParams->tokenDetails->access_token}",
            'Content-Type'  => 'application/json'
        ];

        $apiResponse = HttpHelper::get($apiEndpoint, null, $headers);

        if (!property_exists((object) $apiResponse, 'fields')) {
            wp_send_json_error($apiResponse, 400);
        }

        $unusualFields = ['Id', 'Type', 'Status', 'Origin', 'Priority', 'PotentialLiability__c', 'SLAViolation__c', 'Reason', 'Ownership', 'StageName', 'MasterRecordId', 'AccountId', 'ReportsToId', 'OwnerId', 'LeadSource', 'IsDeleted', 'CreatedDate', 'CreatedById', 'LastModifiedDate', 'LastModifiedById', 'SystemModstamp', 'LastViewedDate', 'LastActivityDate', 'LastCURequestDate', 'EmailBouncedReason', 'EmailBouncedDate', 'IsEmailBounced', 'LastCUUpdateDate', 'LastReferencedDate', 'Jigsaw', 'JigsawContactId', 'CleanStatus'];
        $customFields = array_filter($apiResponse->fields, function ($field) use ($unusualFields) {
            return !\in_array($field->name, $unusualFields) || (boolean) $field->custom;
        });

        $fieldMap = array_map(function ($field) use ($action) {
            return (object) [
                'key'      => $field->name,
                'label'    => $field->label,
                'required' => static::isRequiredField($field->name, $action)
            ];
        }, array_values($customFields));

        if (!empty($response['tokenDetails'])) {
            self::saveRefreshedToken($customFieldRequestParams->flowID, $response['tokenDetails'], $response['organizations']);
        }

        wp_send_json_success($fieldMap, 200);
    }

    public static function selesforceCampaignList($campaignRequestParams)
    {
        if (
            empty($campaignRequestParams->tokenDetails)
            || empty($campaignRequestParams->clientId)
            || empty($campaignRequestParams->clientSecret)
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
        if ((\intval($campaignRequestParams->tokenDetails->generates_on) + (55 * 60)) < time()) {
            $response['tokenDetails'] = self::refreshAccessToken($campaignRequestParams);
        }

        $apiEndpoint = "{$campaignRequestParams->tokenDetails->instance_url}/services/data/v37.0/sobjects/Campaign";

        $authorizationHeader['Authorization'] = "Bearer {$campaignRequestParams->tokenDetails->access_token}";
        $authorizationHeader['Content-Type'] = 'application/json';
        $apiResponse = HttpHelper::get($apiEndpoint, null, $authorizationHeader);

        if (property_exists($apiResponse, 'objectDescribe')) {
            $response['allCampaignLists'] = $apiResponse->recentItems;
        } else {
            wp_send_json_error(
                empty($apiResponse->recentItems) ? 'Unknown' : $apiResponse->error,
                400
            );
        }
        if (!empty($response['tokenDetails'])) {
            self::saveRefreshedToken($campaignRequestParams->flowID, $response['tokenDetails'], $response['organizations']);
        }
        wp_send_json_success($response, 200);
    }

    public static function selesforceLeadList($campaignRequestParams)
    {
        if (
            empty($campaignRequestParams->tokenDetails)
            || empty($campaignRequestParams->clientId)
            || empty($campaignRequestParams->clientSecret)
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
        if ((\intval($campaignRequestParams->tokenDetails->generates_on) + (55 * 60)) < time()) {
            $response['tokenDetails'] = self::refreshAccessToken($campaignRequestParams);
        }

        $apiEndpoint = "{$campaignRequestParams->tokenDetails->instance_url}/services/data/v37.0/sobjects/lead";

        $authorizationHeader['Authorization'] = "Bearer {$campaignRequestParams->tokenDetails->access_token}";
        $authorizationHeader['Content-Type'] = 'application/json';
        $apiResponse = HttpHelper::get($apiEndpoint, null, $authorizationHeader);

        if (property_exists($apiResponse, 'recentItems')) {
            $response['leadLists'] = $apiResponse->recentItems;
        } else {
            wp_send_json_error(
                empty($apiResponse->recentItems) ? 'Unknown' : $apiResponse->error,
                400
            );
        }
        if (!empty($response['tokenDetails'])) {
            self::saveRefreshedToken($campaignRequestParams->flowID, $response['tokenDetails'], $response['organizations']);
        }
        wp_send_json_success($response, 200);
    }

    public static function selesforceContactList($campaignRequestParams)
    {
        if (
            empty($campaignRequestParams->tokenDetails)
            || empty($campaignRequestParams->clientId)
            || empty($campaignRequestParams->clientSecret)
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
        if ((\intval($campaignRequestParams->tokenDetails->generates_on) + (55 * 60)) < time()) {
            $response['tokenDetails'] = self::refreshAccessToken($campaignRequestParams);
        }

        $apiEndpoint = "{$campaignRequestParams->tokenDetails->instance_url}/services/data/v37.0/sobjects/contact";
        $authorizationHeader['Authorization'] = "Bearer {$campaignRequestParams->tokenDetails->access_token}";
        $authorizationHeader['Content-Type'] = 'application/json';
        $apiResponse = HttpHelper::get($apiEndpoint, null, $authorizationHeader);

        if (property_exists($apiResponse, 'recentItems')) {
            $response['contactLists'] = $apiResponse->recentItems;
        } else {
            wp_send_json_error(
                empty($apiResponse->recentItems) ? 'Unknown' : $apiResponse->error,
                400
            );
        }
        if (!empty($response['tokenDetails'])) {
            self::saveRefreshedToken($campaignRequestParams->flowID, $response['tokenDetails'], $response['organizations']);
        }
        wp_send_json_success($response, 200);
    }

    public static function selesforceAccountList($campaignRequestParams)
    {
        if (
            empty($campaignRequestParams->tokenDetails)
            || empty($campaignRequestParams->clientId)
            || empty($campaignRequestParams->clientSecret)
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
        if ((\intval($campaignRequestParams->tokenDetails->generates_on) + (55 * 60)) < time()) {
            $response['tokenDetails'] = self::refreshAccessToken($campaignRequestParams);
        }

        $apiEndpoint = "{$campaignRequestParams->tokenDetails->instance_url}/services/data/v37.0/sobjects/Account";
        $authorizationHeader['Authorization'] = "Bearer {$campaignRequestParams->tokenDetails->access_token}";
        $authorizationHeader['Content-Type'] = 'application/json';
        $apiResponse = HttpHelper::get($apiEndpoint, null, $authorizationHeader);

        if (property_exists($apiResponse, 'recentItems')) {
            $response['accountLists'] = $apiResponse->recentItems;
        } else {
            wp_send_json_error(
                empty($apiResponse->recentItems) ? 'Unknown' : $apiResponse->error,
                400
            );
        }
        if (!empty($response['tokenDetails'])) {
            self::saveRefreshedToken($campaignRequestParams->flowID, $response['tokenDetails']);
        }
        wp_send_json_success($response, 200);
    }

    public static function selesforceCaseOrigin($campaignRequestParams)
    {
        $caseOrigin = static::getCaseMetaData($campaignRequestParams, 'Origin');
        wp_send_json_success($caseOrigin, 200);
    }

    public static function selesforceCaseType($campaignRequestParams)
    {
        $caseTypes = static::getCaseMetaData($campaignRequestParams, 'Type');
        wp_send_json_success($caseTypes, 200);
    }

    public static function selesforceCaseReason($campaignRequestParams)
    {
        $caseReason = static::getCaseMetaData($campaignRequestParams, 'Reason');
        wp_send_json_success($caseReason, 200);
    }

    public static function selesforceCaseStatus($campaignRequestParams)
    {
        $caseStatus = static::getCaseMetaData($campaignRequestParams, 'Status');
        wp_send_json_success($caseStatus, 200);
    }

    public static function selesforceCasePriority($campaignRequestParams)
    {
        $casePriority = static::getCaseMetaData($campaignRequestParams, 'Priority');
        wp_send_json_success($casePriority, 200);
    }

    public static function selesforceCasePotentialLiability($campaignRequestParams)
    {
        $casePotentialLiability = static::getCaseMetaData($campaignRequestParams, 'PotentialLiability__c');
        wp_send_json_success($casePotentialLiability, 200);
    }

    public static function selesforceCaseSLAViolation($campaignRequestParams)
    {
        $caseSLAViolation = static::getCaseMetaData($campaignRequestParams, 'SLAViolation__c');
        wp_send_json_success($caseSLAViolation, 200);
    }

    public function execute($integrationData, $fieldValues)
    {
        $integrationDetails = $integrationData->flow_details;
        $this->_integrationID = $integrationData->id;
        $tokenDetails = $integrationDetails->tokenDetails;
        $fieldMap = $integrationDetails->field_map;
        $actions = $integrationDetails->actions;
        if (
            empty($tokenDetails)
            || empty($fieldMap)
        ) {
            return new WP_Error('REQ_FIELD_EMPTY', __('list are required for zoho desk api', 'bit-integrations'));
        }

        if ((\intval($tokenDetails->generates_on) + (55 * 60)) < time()) {
            $requiredParams['clientId'] = $integrationDetails->clientId;
            $requiredParams['clientSecret'] = $integrationDetails->clientSecret;
            $requiredParams['tokenDetails'] = $tokenDetails;
            $newTokenDetails = self::refreshAccessToken((object) $requiredParams);
            if ($newTokenDetails) {
                self::saveRefreshedToken($this->_integrationID, $newTokenDetails);
                $tokenDetails = $newTokenDetails;
            }
        }
        $recordApiHelper = new RecordApiHelper($tokenDetails, $this->_integrationID);

        $salesforceApiResponse = $recordApiHelper->execute(
            $integrationDetails,
            $fieldValues,
            $fieldMap,
            $actions,
            $tokenDetails
        );

        if (is_wp_error($salesforceApiResponse)) {
            return $salesforceApiResponse;
        }

        return $salesforceApiResponse;
    }

    protected static function refreshAccessToken($apiData)
    {
        if (
            !\is_object($apiData)
            || empty($apiData->clientId)
            || empty($apiData->clientSecret)
            || empty($apiData->tokenDetails)
        ) {
            return false;
        }
        $tokenDetails = $apiData->tokenDetails;

        $apiEndpoint = 'https://login.salesforce.com/services/oauth2/token?grant_type=refresh_token&client_id=' . $apiData->clientId . '&client_secret=' . $apiData->clientSecret . '&redirect_uri=' . $apiData->redirectURI . '&refresh_token=' . $tokenDetails->refresh_token;
        $requestParams = [
            'grant_type'    => 'refresh_token',
            'client_id'     => $apiData->clientId,
            'client_secret' => $apiData->clientSecret,
            'redirect_uri'  => urldecode($apiData->redirectURI),
            'refresh_token' => $tokenDetails->refresh_token
        ];

        $apiResponse = HttpHelper::post($apiEndpoint, $requestParams);
        if (is_wp_error($apiResponse) || !empty($apiResponse->error)) {
            return false;
        }
        $tokenDetails->generates_on = time();
        $tokenDetails->access_token = $apiResponse->access_token;

        return $tokenDetails;
    }

    private static function isRequiredField($key, $action)
    {
        $requiredFields = [
            'Contact' => ['LastName'],
            'Case'    => ['SuppliedName'],
            'Event'   => ['StartDateTime', 'EndDateTime'],
            'Lead'    => ['LastName', 'Email', 'Company'],
        ];

        return \in_array($key, $requiredFields[$action] ?? ['Name']);
    }

    private static function getCaseMetaData($campaignRequestParams, $module)
    {
        if (
            empty($campaignRequestParams->tokenDetails)
            || empty($campaignRequestParams->clientId)
            || empty($campaignRequestParams->clientSecret)
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
        if ((\intval($campaignRequestParams->tokenDetails->generates_on) + (55 * 60)) < time()) {
            $response['tokenDetails'] = self::refreshAccessToken($campaignRequestParams);
        }

        $apiEndpoint = "{$campaignRequestParams->tokenDetails->instance_url}/services/data/v52.0/sobjects/Case/describe";
        $authorizationHeader['Authorization'] = "Bearer {$campaignRequestParams->tokenDetails->access_token}";
        $authorizationHeader['Content-Type'] = 'application/json';

        $data = [];
        $apiResponse = HttpHelper::get($apiEndpoint, null, $authorizationHeader);

        if (isset($apiResponse->fields)) {
            foreach ($apiResponse->fields as $field) {
                if ($field->name == $module && isset($field->picklistValues)) {
                    foreach ($field->picklistValues as $picklistValue) {
                        $data[] = (object) [
                            'label' => $picklistValue->label,
                            'value' => $picklistValue->value
                        ];
                    }

                    break;
                }
            }
        }

        return $data;
    }

    private static function saveRefreshedToken($integrationID, $tokenDetails)
    {
        if (empty($integrationID)) {
            return;
        }

        $flow = new FlowController();
        $selesforceDetails = $flow->get(['id' => $integrationID]);
        if (is_wp_error($selesforceDetails)) {
            return;
        }

        $newDetails = json_decode($selesforceDetails[0]->flow_details);
        $newDetails->tokenDetails = $tokenDetails;
        $flow->update($integrationID, ['flow_details' => wp_json_encode($newDetails)]);
    }
}
