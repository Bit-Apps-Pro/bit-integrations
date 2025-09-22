<?php

/**
 * Fabman Integration
 */

namespace BitCode\FI\Actions\Fabman;

use BitCode\FI\Core\Util\HttpHelper;

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

        if (empty($apiResponse) || isset($apiResponse->error) || !\is_array($apiResponse) || !isset($apiResponse[0]->id)) {
            wp_send_json_error(isset($apiResponse->error) ? $apiResponse->error : __('Invalid API credentials', 'bit-integrations'), 400);
        }

        $accountId = $apiResponse[0]->id;
        wp_send_json_success([
            'accountId' => $accountId
        ], 200);
    }

    public static function fetchWorkspaces($requestParams)
    {
        if (empty($requestParams->apiKey)) {
            wp_send_json_error(__('API Key is required', 'bit-integrations'), 400);
        }

        $header = [
            'Authorization' => 'Bearer ' . $requestParams->apiKey,
            'Content-Type'  => 'application/json'
        ];

        $apiEndpoint = 'https://fabman.io/api/v1/spaces';
        $apiResponse = HttpHelper::get($apiEndpoint, null, $header);

        if (is_wp_error($apiResponse)) {
            wp_send_json_error($apiResponse->get_error_message(), 400);
        }

        if (empty($apiResponse) || isset($apiResponse->error) || !\is_array($apiResponse)) {
            wp_send_json_error(isset($apiResponse->error) ? $apiResponse->error : __('Failed to fetch workspaces', 'bit-integrations'), 400);
        }

        wp_send_json_success([
            'workspaces' => $apiResponse
        ], 200);
    }

    public static function execute($integrationData, $fieldValues)
    {
        $integrationDetails = $integrationData->flow_details;
        $apiKey = $integrationDetails->apiKey;
        $selectedWorkspace = $integrationDetails->selectedWorkspace ?? null;
        $accountId = $integrationDetails->accountId ?? null;
        $actionName = $integrationDetails->actionName;
        $integId = $integrationData->id;
        $memberId = $integrationDetails->selectedMember ?? null;
        $lockVersion = $integrationDetails->selectedLockVersion ?? null;

        if (\in_array($actionName, ['update_member', 'delete_member'])) {
            if ($actionName === 'delete_member' || empty($memberId)) {
                $email = self::getMappedValue($integrationDetails->field_map, 'emailAddress', $fieldValues);
                if ($email) {
                    $memberData = self::fetchMemberByEmailInternal($apiKey, $email);
                    if ($memberData) {
                        $memberId = $memberData['memberId'];
                        $lockVersion = $memberData['lockVersion'];
                    }
                }
            }
        }

        $recordApiHelper = new RecordApiHelper(
            $apiKey,
            $selectedWorkspace,
            $accountId,
            $integId,
            $memberId,
            $lockVersion
        );

        return $recordApiHelper->execute($actionName, $fieldValues, $integrationDetails);
    }

    private static function getMappedValue($fieldMap, $targetField, $fieldValues)
    {
        if (empty($fieldMap)) {
            return;
        }

        foreach ($fieldMap as $map) {
            if (!empty($map->fabmanFormField) && $map->fabmanFormField === $targetField) {
                if ($map->formField === 'custom') {
                    return $map->customValue;
                }

                return $fieldValues[$map->formField] ?? null;
            }
        }
    }

    private static function fetchMemberByEmailInternal($apiKey, $email)
    {
        $header = [
            'Authorization' => 'Bearer ' . $apiKey,
            'Content-Type'  => 'application/json'
        ];

        $apiEndpoint = 'https://fabman.io/api/v1/members?q=' . urlencode($email);
        $apiResponse = HttpHelper::get($apiEndpoint, null, $header);

        if (is_wp_error($apiResponse) || empty($apiResponse) || isset($apiResponse->error) || !\is_array($apiResponse)) {
            return;
        }

        if (isset($apiResponse[0])) {
            return [
                'memberId'    => $apiResponse[0]->id,
                'lockVersion' => $apiResponse[0]->lockVersion
            ];
        }
    }
}
