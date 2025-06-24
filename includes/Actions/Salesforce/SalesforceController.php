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

    private static $actions = [
        'contact-create'      => 'Contact',
        'lead-create'         => 'Lead',
        'account-create'      => 'Account',
        'campaign-create'     => 'Campaign',
        'add-campaign-member' => 'Campaign',
        'opportunity-create'  => 'Opportunity',
        'event-create'        => 'Event',
        'case-create'         => 'Case'
    ];

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

    public function customActions($params)
    {
        if (
            empty($params->tokenDetails)
            || empty($params->clientId)
            || empty($params->clientSecret)
        ) {
            wp_send_json_error(
                __(
                    'Requested parameter is empty',
                    'bit-integrations'
                ),
                400
            );
        }

        $response = self::refreshTokenDetails($params);
        $tokenDetails = $response['tokenDetails'];

        $apiEndpoint = "{$tokenDetails->instance_url}/services/data/v37.0/sobjects";

        $apiResponse = HttpHelper::get($apiEndpoint, null, self::setHeaders($tokenDetails->access_token));

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

        if (!empty($tokenDetails)) {
            self::saveRefreshedToken($params->flowID, $tokenDetails, $response['organizations']);
        }
        wp_send_json_success($allCustomActions, 200);
    }

    public function customFields($params)
    {
        if (
            empty($params->tokenDetails)
            || empty($params->actionName)
            || empty($params->clientId)
            || empty($params->clientSecret)
        ) {
            wp_send_json_error(
                __(
                    'Requested parameter is empty',
                    'bit-integrations'
                ),
                400
            );
        }

        $response = self::refreshTokenDetails($params);
        $action = self::$actions[$params->actionName] ?? $params->actionName;
        $tokenDetails = $response['tokenDetails'];

        $apiEndpoint = "{$tokenDetails->instance_url}/services/data/v37.0/sobjects/{$action}/describe";

        $apiResponse = HttpHelper::get($apiEndpoint, null, self::setHeaders($tokenDetails->access_token));

        if (!property_exists((object) $apiResponse, 'fields')) {
            wp_send_json_error($apiResponse, 400);
        }

        $excludedFields = [
            'Id', 'Type', 'Status', 'Origin', 'Priority', 'PotentialLiability__c',
            'SLAViolation__c', 'Reason', 'Ownership', 'StageName', 'MasterRecordId',
            'AccountId', 'ReportsToId', 'OwnerId', 'LeadSource', 'IsDeleted',
            'CreatedDate', 'CreatedById', 'LastModifiedDate', 'LastModifiedById',
            'SystemModstamp', 'LastViewedDate', 'LastActivityDate', 'LastCURequestDate',
            'EmailBouncedReason', 'Industry', 'Status', 'Rating', 'EmailBouncedDate', 'IsEmailBounced', 'LastCUUpdateDate',
            'LastReferencedDate', 'Jigsaw', 'JigsawContactId', 'CleanStatus'
        ];

        $customFields = array_filter($apiResponse->fields, function ($field) use ($excludedFields) {
            return !\in_array($field->name, $excludedFields) || (boolean) $field->custom;
        });

        $fieldMap = array_map(function ($field) use ($action) {
            return (object) [
                'key'      => $field->name,
                'label'    => $field->label,
                'required' => static::isRequiredField($field->name, $action)
            ];
        }, array_values($customFields));

        if (!empty($tokenDetails)) {
            self::saveRefreshedToken($params->flowID, $tokenDetails, $response['organizations']);
        }

        wp_send_json_success($fieldMap, 200);
    }

    public static function selesforceCampaignList($params)
    {
        if (
            empty($params->tokenDetails)
            || empty($params->clientId)
            || empty($params->clientSecret)
        ) {
            wp_send_json_error(
                __(
                    'Requested parameter is empty',
                    'bit-integrations'
                ),
                400
            );
        }

        $response = self::refreshTokenDetails($params);
        $tokenDetails = $response['tokenDetails'];

        $apiEndpoint = "{$tokenDetails->instance_url}/services/data/v37.0/sobjects/Campaign";

        $apiResponse = HttpHelper::get($apiEndpoint, null, self::setHeaders($tokenDetails->access_token));

        if (!property_exists($apiResponse, 'objectDescribe')) {
            wp_send_json_error($apiResponse, 400);
        }

        $response['allCampaignLists'] = $apiResponse->recentItems;

        if (!empty($tokenDetails)) {
            self::saveRefreshedToken($params->flowID, $tokenDetails, $response['organizations']);
        }

        wp_send_json_success($response, 200);
    }

    public static function selesforceLeadList($params)
    {
        if (
            empty($params->tokenDetails)
            || empty($params->clientId)
            || empty($params->clientSecret)
        ) {
            wp_send_json_error(
                __(
                    'Requested parameter is empty',
                    'bit-integrations'
                ),
                400
            );
        }

        $response = self::refreshTokenDetails($params);
        $tokenDetails = $response['tokenDetails'];

        $apiEndpoint = "{$tokenDetails->instance_url}/services/data/v37.0/sobjects/lead";

        $apiResponse = HttpHelper::get($apiEndpoint, null, self::setHeaders($tokenDetails->access_token));

        if (!property_exists($apiResponse, 'recentItems')) {
            wp_send_json_error($apiResponse, 400);
        }

        $response['leadLists'] = $apiResponse->recentItems;

        if (!empty($tokenDetails)) {
            self::saveRefreshedToken($params->flowID, $tokenDetails, $response['organizations']);
        }

        wp_send_json_success($response, 200);
    }

    public static function selesforceContactList($params)
    {
        if (
            empty($params->tokenDetails)
            || empty($params->clientId)
            || empty($params->clientSecret)
        ) {
            wp_send_json_error(
                __(
                    'Requested parameter is empty',
                    'bit-integrations'
                ),
                400
            );
        }

        $response = self::refreshTokenDetails($params);
        $tokenDetails = $response['tokenDetails'];

        $apiEndpoint = "{$tokenDetails->instance_url}/services/data/v37.0/sobjects/contact";

        $apiResponse = HttpHelper::get($apiEndpoint, null, self::setHeaders($tokenDetails->access_token));

        if (!property_exists($apiResponse, 'recentItems')) {
            wp_send_json_error($apiResponse, 400);
        }

        $response['contactLists'] = $apiResponse->recentItems;

        if (!empty($tokenDetails)) {
            self::saveRefreshedToken($params->flowID, $tokenDetails, $response['organizations']);
        }

        wp_send_json_success($response, 200);
    }

    public static function selesforceAccountList($params)
    {
        if (
            empty($params->tokenDetails)
            || empty($params->clientId)
            || empty($params->clientSecret)
        ) {
            wp_send_json_error(
                __(
                    'Requested parameter is empty',
                    'bit-integrations'
                ),
                400
            );
        }

        $response = self::refreshTokenDetails($params);
        $tokenDetails = $response['tokenDetails'];

        $apiEndpoint = "{$tokenDetails->instance_url}/services/data/v37.0/sobjects/Account";

        $apiResponse = HttpHelper::get($apiEndpoint, null, self::setHeaders($tokenDetails->access_token));

        if (!property_exists($apiResponse, 'recentItems')) {
            wp_send_json_error($apiResponse, 400);
        }

        $response['accountLists'] = $apiResponse->recentItems;

        if (!empty($tokenDetails)) {
            self::saveRefreshedToken($params->flowID, $tokenDetails);
        }

        wp_send_json_success($response, 200);
    }

    public static function selesforceCaseOrigin($params)
    {
        $caseOrigin = static::getCaseMetaData($params, 'Origin');
        wp_send_json_success($caseOrigin, 200);
    }

    public static function selesforceCaseType($params)
    {
        $caseTypes = static::getCaseMetaData($params, 'Type');
        wp_send_json_success($caseTypes, 200);
    }

    public static function selesforceCaseReason($params)
    {
        $caseReason = static::getCaseMetaData($params, 'Reason');
        wp_send_json_success($caseReason, 200);
    }

    public static function selesforceCaseStatus($params)
    {
        $caseStatus = static::getCaseMetaData($params, 'Status');
        wp_send_json_success($caseStatus, 200);
    }

    public static function selesforceCasePriority($params)
    {
        $casePriority = static::getCaseMetaData($params, 'Priority');
        wp_send_json_success($casePriority, 200);
    }

    public static function selesforceCasePotentialLiability($params)
    {
        $casePotentialLiability = static::getCaseMetaData($params, 'PotentialLiability__c');
        wp_send_json_success($casePotentialLiability, 200);
    }

    public static function selesforceCaseSLAViolation($params)
    {
        $caseSLAViolation = static::getCaseMetaData($params, 'SLAViolation__c');
        wp_send_json_success($caseSLAViolation, 200);
    }

    public function getAllLeadSources($params)
    {
        if (
            empty($params->tokenDetails)
            || empty($params->actionName)
            || empty($params->clientId)
            || empty($params->clientSecret)
        ) {
            wp_send_json_error(
                __(
                    'Requested parameter is empty',
                    'bit-integrations'
                ),
                400
            );
        }

        $response = self::refreshTokenDetails($params);
        $action = self::$actions[$params->actionName] ?? $params->actionName;
        $tokenDetails = $response['tokenDetails'];

        $apiEndpoint = "{$tokenDetails->instance_url}/services/data/v37.0/sobjects/{$action}/describe";

        $apiResponse = HttpHelper::get($apiEndpoint, null, self::setHeaders($tokenDetails->access_token));

        if (!property_exists((object) $apiResponse, 'fields')) {
            wp_send_json_error($apiResponse, 400);
        }

        $field = current(array_filter($apiResponse->fields, function ($field) {
            return $field->name === 'LeadSource';
        }));

        if (!empty($tokenDetails)) {
            self::saveRefreshedToken($params->flowID, $tokenDetails, $response['organizations']);
        }

        wp_send_json_success($field->picklistValues ?? [], 200);
    }

    public function getAllLeadStatus($params)
    {
        if (
            empty($params->tokenDetails)
            || empty($params->actionName)
            || empty($params->clientId)
            || empty($params->clientSecret)
        ) {
            wp_send_json_error(
                __(
                    'Requested parameter is empty',
                    'bit-integrations'
                ),
                400
            );
        }

        $response = self::refreshTokenDetails($params);
        $action = self::$actions[$params->actionName] ?? $params->actionName;
        $tokenDetails = $response['tokenDetails'];

        $apiEndpoint = "{$tokenDetails->instance_url}/services/data/v37.0/sobjects/{$action}/describe";

        $apiResponse = HttpHelper::get($apiEndpoint, null, self::setHeaders($tokenDetails->access_token));

        if (!property_exists((object) $apiResponse, 'fields')) {
            wp_send_json_error($apiResponse, 400);
        }

        $field = current(array_filter($apiResponse->fields, function ($field) {
            return $field->name === 'Status';
        }));

        if (!empty($tokenDetails)) {
            self::saveRefreshedToken($params->flowID, $tokenDetails, $response['organizations']);
        }

        wp_send_json_success($field->picklistValues ?? [], 200);
    }

    public function getAllLeadRatings($params)
    {
        if (
            empty($params->tokenDetails)
            || empty($params->actionName)
            || empty($params->clientId)
            || empty($params->clientSecret)
        ) {
            wp_send_json_error(
                __(
                    'Requested parameter is empty',
                    'bit-integrations'
                ),
                400
            );
        }

        $response = self::refreshTokenDetails($params);
        $action = self::$actions[$params->actionName] ?? $params->actionName;
        $tokenDetails = $response['tokenDetails'];

        $apiEndpoint = "{$tokenDetails->instance_url}/services/data/v37.0/sobjects/{$action}/describe";

        $apiResponse = HttpHelper::get($apiEndpoint, null, self::setHeaders($tokenDetails->access_token));

        if (!property_exists((object) $apiResponse, 'fields')) {
            wp_send_json_error($apiResponse, 400);
        }

        $field = current(array_filter($apiResponse->fields, function ($field) {
            return $field->name === 'Rating';
        }));

        if (!empty($tokenDetails)) {
            self::saveRefreshedToken($params->flowID, $tokenDetails, $response['organizations']);
        }

        wp_send_json_success($field->picklistValues ?? [], 200);
    }

    public function getAllLeadIndustries($params)
    {
        if (
            empty($params->tokenDetails)
            || empty($params->actionName)
            || empty($params->clientId)
            || empty($params->clientSecret)
        ) {
            wp_send_json_error(
                __(
                    'Requested parameter is empty',
                    'bit-integrations'
                ),
                400
            );
        }

        $response = self::refreshTokenDetails($params);
        $action = self::$actions[$params->actionName] ?? $params->actionName;
        $tokenDetails = $response['tokenDetails'];

        $apiEndpoint = "{$tokenDetails->instance_url}/services/data/v37.0/sobjects/{$action}/describe";

        $apiResponse = HttpHelper::get($apiEndpoint, null, self::setHeaders($tokenDetails->access_token));

        if (!property_exists((object) $apiResponse, 'fields')) {
            wp_send_json_error($apiResponse, 400);
        }

        $field = current(array_filter($apiResponse->fields, function ($field) {
            return $field->name === 'Industry';
        }));

        if (!empty($tokenDetails)) {
            self::saveRefreshedToken($params->flowID, $tokenDetails, $response['organizations']);
        }

        wp_send_json_success($field->picklistValues ?? [], 200);
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
            $newTokenDetails = self::refreshAccessToken((object) [
                'clientId'     => $integrationDetails->clientId,
                'clientSecret' => $integrationDetails->clientSecret,
                'tokenDetails' => $tokenDetails
            ]);

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
            'redirect_uri'  => urldecode($apiData->redirectURI ?? ''),
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

    private static function getCaseMetaData($params, $module)
    {
        if (
            empty($params->tokenDetails)
            || empty($params->clientId)
            || empty($params->clientSecret)
        ) {
            wp_send_json_error(
                __(
                    'Requested parameter is empty',
                    'bit-integrations'
                ),
                400
            );
        }

        $response = self::refreshTokenDetails($params);
        $tokenDetails = $response['tokenDetails'];

        $apiEndpoint = "{$params->tokenDetails->instance_url}/services/data/v52.0/sobjects/Case/describe";

        $apiResponse = HttpHelper::get($apiEndpoint, null, self::setHeaders($tokenDetails->access_token));

        if (empty($apiResponse->fields)) {
            return [];
        }

        $data = [];

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

    private static function refreshTokenDetails($params)
    {
        $response = ['tokenDetails' => $params->tokenDetails];

        if ((\intval($params->tokenDetails->generates_on) + (55 * 60)) < time()) {
            $response['tokenDetails'] = self::refreshAccessToken($params);
        }

        return $response;
    }

    private static function setHeaders($accessToken)
    {
        return [
            'Authorization' => "Bearer {$accessToken}",
            'Content-Type'  => 'application/json'
        ];
    }
}
