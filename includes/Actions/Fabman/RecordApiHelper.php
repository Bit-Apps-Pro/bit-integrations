<?php

namespace BitCode\FI\Actions\Fabman;

use BitCode\FI\Core\Util\HttpHelper;
use WP_Error;

class RecordApiHelper
{
    private $_integrationID;

    private $_apiKey;

    private $_workspaceId;

    private $_accountId;

    private $_memberId;

    private $_apiEndpoint;

    private $_lockVersion;

    public function __construct($apiKey, $workspaceId, $accountId, $integrationID = null, $memberId = null, $lockVersion)
    {
        $this->_integrationID = $integrationID;
        $this->_apiKey = $apiKey;
        $this->_workspaceId = $workspaceId;
        $this->_accountId = $accountId;
        $this->_memberId = $memberId;
        $this->_lockVersion = $lockVersion;
        $this->_apiEndpoint = 'https://fabman.io/api/v1';
    }

    public function execute($actionName, $fieldValues, $integrationDetails)
    {
        $finalData = [];
        $finalData['space'] = $this->_workspaceId;
        $finalData['account'] = $this->_accountId;

        if ($this->_memberId) {
            $finalData['memberId'] = $this->_memberId;
        }

        if (!empty($integrationDetails->field_map)) {
            foreach ($integrationDetails->field_map as $fieldMap) {
                if (!empty($fieldMap->formField) && !empty($fieldMap->fabmanFormField)) {
                    $finalData[$fieldMap->fabmanFormField] = $fieldMap->formField === 'custom'
                        ? $fieldMap->customValue
                        : $fieldValues[$fieldMap->formField];
                }
            }
        }

        switch ($actionName) {
            case 'create_member':
                return $this->createMember($finalData);
            case 'update_member':
                return $this->updateMember($finalData);
            case 'delete_member':
                return $this->deleteMember($finalData);
            default:
                return new WP_Error('INVALID_ACTION', __('Invalid action name', 'bit-integrations'));
        }
    }

    private function createMember($data)
    {
        unset($data['memberId']);
        $apiEndpoint = $this->_apiEndpoint . '/members';
        $header = [
            'Authorization' => 'Bearer ' . $this->_apiKey,
            'Content-Type'  => 'application/json'
        ];

        $apiResponse = HttpHelper::post($apiEndpoint, json_encode($data), $header);
        error_log(print_r($apiResponse, true));

        if (is_wp_error($apiResponse)) {
            return $apiResponse;
        }

        if (empty($apiResponse) || isset($apiResponse->error)) {
            return new WP_Error('API_ERROR', isset($apiResponse->error) ? $apiResponse->error : __('Failed to create member', 'bit-integrations'));
        }

        return $apiResponse;
    }

    private function updateMember($data)
    {
        $data['lockVersion'] = $this->_lockVersion;
        if (empty($this->_memberId)) {
            return new WP_Error('MISSING_MEMBER_ID', __('Member ID is required for update operation', 'bit-integrations'));
        }

        error_log(print_r($data, true));

        $apiEndpoint = $this->_apiEndpoint . '/members/' . $this->_memberId;
        $header = [
            'Authorization' => 'Bearer ' . $this->_apiKey,
            'Content-Type'  => 'application/json'
        ];

        error_log(print_r($apiEndpoint, true));

        $apiResponse = HttpHelper::put($apiEndpoint, json_encode($data), $header);
        error_log(print_r($apiResponse, true));

        if (is_wp_error($apiResponse)) {
            return $apiResponse;
        }

        if (empty($apiResponse) || isset($apiResponse->error)) {
            return new WP_Error('API_ERROR', isset($apiResponse->error) ? $apiResponse->error : __('Failed to update member', 'bit-integrations'));
        }

        return $apiResponse;
    }

    private function deleteMember()
    {
        if (empty($this->_memberId)) {
            return new WP_Error('MISSING_MEMBER_ID', __('Member ID is required for delete operation', 'bit-integrations'));
        }

        $apiEndpoint = $this->_apiEndpoint . '/members/' . $this->_memberId;
        $header = [
            'Authorization' => 'Bearer ' . $this->_apiKey,
            'Content-Type'  => 'application/json'
        ];

        $apiResponse = HttpHelper::request($apiEndpoint, 'DELETE', null, $header);
        if (is_wp_error($apiResponse)) {
            return $apiResponse;
        }

        if (empty($apiResponse) || isset($apiResponse->error)) {
            return new WP_Error('API_ERROR', isset($apiResponse->error) ? $apiResponse->error : __('Failed to delete member', 'bit-integrations'));
        }

        return $apiResponse;
    }
}
