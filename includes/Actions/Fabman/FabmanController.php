<?php

/**
 * Fabman Integration
 */

namespace BitCode\FI\Actions\Fabman;

use BitCode\FI\Core\Util\HttpHelper;
use WP_Error;

class FabmanController
{
    public static function info()
    {
        return [
            'name'          => 'Fabman',
            'title'         => __('Fabman', 'bit-integrations'),
            'type'          => 'action',
            'integrationID' => 0
        ];
    }

    public static function authorization($requestParams)
    {
        if (empty($requestParams->apiKey)) {
            wp_send_json_error(__('API Key is required', 'bit-integrations'), 400);
        }

        $header = [
            'Authorization' => 'Bearer ' . $requestParams->apiKey,
            'Content-Type'  => 'application/json'
        ];

        $apiEndpoint = 'https://fabman.io/api/v1/accounts';
        $apiResponse = HttpHelper::get($apiEndpoint, null, $header);

        if (is_wp_error($apiResponse)) {
            wp_send_json_error($apiResponse->get_error_message(), 400);
        }

        if (empty($apiResponse) || isset($apiResponse->error)) {
            wp_send_json_error(isset($apiResponse->error) ? $apiResponse->error : __('Invalid API credentials', 'bit-integrations'), 400);
        }

        $accountId = $apiResponse[0]->id;
        wp_send_json_success([
            'accountId' => $accountId
        ], 200);
    }

    public static function fetchWorkspaces($requestParams)
    {
        $header = [
            'Authorization' => 'Bearer ' . $requestParams->apiKey,
            'Content-Type'  => 'application/json'
        ];

        $apiEndpoint = 'https://fabman.io/api/v1/spaces';
        $apiResponse = HttpHelper::get($apiEndpoint, null, $header);

        if (is_wp_error($apiResponse)) {
            wp_send_json_error($apiResponse->get_error_message(), 400);
        }

        if (empty($apiResponse) || isset($apiResponse->error)) {
            wp_send_json_error(isset($apiResponse->error) ? $apiResponse->error : __('Failed to fetch workspaces', 'bit-integrations'), 400);
        }

        wp_send_json_success([
            'workspaces' => $apiResponse
        ], 200);
    }

    public static function fetchMembers($requestParams)
    {
        if (empty($requestParams->apiKey) || empty($requestParams->workspaceId)) {
            wp_send_json_error(__('API Key and Workspace ID are required', 'bit-integrations'), 400);
        }

        $header = [
            'Authorization' => 'Bearer ' . $requestParams->apiKey,
            'Content-Type'  => 'application/json'
        ];

        $apiEndpoint = 'https://fabman.io/api/v1/members';
        $apiResponse = HttpHelper::get($apiEndpoint, null, $header);

        if (is_wp_error($apiResponse)) {
            wp_send_json_error($apiResponse->get_error_message(), 400);
        }

        if (empty($apiResponse) || isset($apiResponse->error)) {
            wp_send_json_error(isset($apiResponse->error) ? $apiResponse->error : __('Failed to fetch members', 'bit-integrations'), 400);
        }

        wp_send_json_success([
            'members' => $apiResponse
        ], 200);
    }

    public static function execute($integrationData, $fieldValues)
    {
        $integrationDetails = $integrationData->flow_details;
        $apiKey = $integrationDetails->apiKey;
        $selectedWorkspace = $integrationDetails->selectedWorkspace ?? null;
        $accountId = $integrationDetails->accountId ?? null;
        $memberId = $integrationDetails->selectedMember ?? null;
        $integId = $integrationData->id;
        $actionName = $integrationDetails->actionName;
        $lockVersion = $integrationDetails->selectedLockVersion ?? null;

        // error_log('the lockversion' . print_r($lockVersion, true));

        $recordApiHelper = new RecordApiHelper($apiKey, $selectedWorkspace, $accountId, $integId, $memberId, $lockVersion);
        $fabmanApiResponse = $recordApiHelper->execute($actionName, $fieldValues, $integrationDetails);

        if (is_wp_error($fabmanApiResponse)) {
            return $fabmanApiResponse;
        }

        return $fabmanApiResponse;
    }
}
