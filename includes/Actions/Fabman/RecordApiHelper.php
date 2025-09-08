<?php

namespace BitCode\FI\Actions\Fabman;

use BitCode\FI\Core\Util\HttpHelper;
use BitCode\FI\Log\LogHandler;
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
        $finalData['account'] = $this->_accountId;

        if ($this->_workspaceId) {
            $finalData['space'] = $this->_workspaceId;
        }

        if ($this->_memberId) {
            $finalData['memberId'] = $this->_memberId;
        }

        if (!empty($integrationDetails->field_map)) {
            foreach ($integrationDetails->field_map as $fieldMap) {
                if (!empty($fieldMap->formField) && !empty($fieldMap->fabmanFormField)) {
                    $finalData[$fieldMap->fabmanFormField] = $fieldMap->formField === 'custom'
                        ? $fieldMap->customValue
                        : ($fieldValues[$fieldMap->formField] ?? null);
                }
            }
        }

        switch ($actionName) {
            case 'create_member':
                $apiResponse = $this->createMember($finalData);
                $apiResponse = HttpHelper::$responseCode === 201 ? 'Member Created Successfully' : 'Failed';

                break;
            case 'update_member':
                $apiResponse = $this->updateMember($finalData);

                break;
            case 'delete_member':
                $apiResponse = $this->deleteMember($finalData);

                break;
            case 'create_spaces':
                $apiResponse = $this->createSpace($finalData);

                break;
            case 'update_spaces':
                $apiResponse = $this->updateSpace($finalData);

                break;
            default:
                $apiResponse = new WP_Error('INVALID_ACTION', \__('Invalid action name', 'bit-integrations'));
        }

        $status = \in_array(HttpHelper::$responseCode, [200, 201, 204]) ? 'success' : 'error';

        LogHandler::save($this->_integrationID, ['type' => 'record', 'type_name' => $actionName], $status, $apiResponse);

        return $apiResponse;
    }

    private function createMember($data)
    {
        unset($data['memberId']);
        $apiEndpoint = $this->_apiEndpoint . '/members';
        $header = $this->setHeaders();

        $apiResponse = HttpHelper::post($apiEndpoint, json_encode($data), $header);

        if (\is_wp_error($apiResponse)) {
            return $apiResponse;
        }

        if (empty($apiResponse) || isset($apiResponse->error)) {
            return new WP_Error('API_ERROR', isset($apiResponse->error) ? $apiResponse->error : \__('Failed to create member', 'bit-integrations'));
        }

        return $apiResponse;
    }

    private function updateMember($data)
    {
        $data['lockVersion'] = $this->_lockVersion;
        if (empty($this->_memberId)) {
            return new WP_Error('MISSING_MEMBER_ID', \__('Member ID is required for update operation', 'bit-integrations'));
        }
        $response = \apply_filters('btcbi_fabman_update_member', false, json_encode($data), $this->setHeaders(), $this->_apiEndpoint, $this->_memberId);

        return $this->handleFilterResponse($response, 'update_member');
    }

    private function deleteMember()
    {
        if (empty($this->_memberId)) {
            return new WP_Error('MISSING_MEMBER_ID', \__('Member ID is required for delete operation', 'bit-integrations'));
        }
        $response = \apply_filters('btcbi_fabman_delete_member', false, $this->setHeaders(), $this->_apiEndpoint, $this->_memberId);

        return $this->handleFilterResponse($response, 'delete_member');
    }

    private function createSpace($data)
    {
        unset($data['space']);
        $response = \apply_filters('btcbi_fabman_create_space', false, json_encode($data), $this->setHeaders(), $this->_apiEndpoint);

        return $this->handleFilterResponse($response, 'create_space');
    }

    private function updateSpace($data)
    {
        $data['lockVersion'] = $this->_lockVersion;
        if (empty($this->_workspaceId)) {
            return new WP_Error('MISSING_SPACE_ID', \__('Space ID is required for update operation', 'bit-integrations'));
        }
        $response = \apply_filters('btcbi_fabman_update_space', false, json_encode($data), $this->setHeaders(), $this->_apiEndpoint, $this->_workspaceId);

        return $this->handleFilterResponse($response, 'update_space');
    }

    /**
     * Handle the response from filter-based (Pro) actions.
     *
     * @param mixed  $response
     * @param string $action
     *
     * @return mixed|WP_Error
     */
    private function handleFilterResponse($response, $action = '')
    {
        if (empty($response) || (\is_object($response) && isset($response->error))) {
            $msg = \wp_sprintf(\__('%s plugin is not installed or activated', 'bit-integrations'), 'Bit Integration Pro');
            if ($action) {
                $msg = \sprintf('%s: %s', ucfirst(str_replace('_', ' ', $action)), $msg);
            }

            return new WP_Error('PRO_FEATURE_REQUIRED', $msg);
        }

        return $response;
    }

    private function setHeaders(): array
    {
        return [
            'Authorization' => 'Bearer ' . $this->_apiKey,
            'Content-Type'  => 'application/json'
        ];
    }
}
