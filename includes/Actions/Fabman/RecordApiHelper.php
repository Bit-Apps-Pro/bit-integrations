<?php

namespace BitCode\FI\Actions\Fabman;

use BitCode\FI\Core\Util\HttpHelper;
use BitCode\FI\Log\LogHandler;
use WP_Error;

class RecordApiHelper
{
    private $integrationID;

    private $apiKey;

    private $workspaceId;

    private $accountId;

    private $memberId;

    private $apiEndpoint;

    private $lockVersion;

    public function __construct($apiKey, $workspaceId, $accountId, $integrationID = null, $memberId = null, $lockVersion)
    {
        $this->integrationID = $integrationID;
        $this->apiKey = $apiKey;
        $this->workspaceId = $workspaceId;
        $this->accountId = $accountId;
        $this->memberId = $memberId;
        $this->lockVersion = $lockVersion;
        $this->apiEndpoint = 'https://fabman.io/api/v1';
    }

    public function execute($actionName, $fieldValues, $integrationDetails)
    {
        $finalData = [];
        $finalData['account'] = $this->accountId;

        if ($this->workspaceId) {
            $finalData['space'] = $this->workspaceId;
        }

        if ($this->memberId) {
            $finalData['memberId'] = $this->memberId;
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
                $apiResponse = new WP_Error(
                    'INVALID_ACTION',
                    __('Invalid action name', 'bit-integrations')
                );
        }

        if (is_wp_error($apiResponse) || (\is_object($apiResponse) && isset($apiResponse->error))) {
            $status = 'error';
        } else {
            $status = \in_array(HttpHelper::$responseCode, [200, 201, 204]) ? 'success' : 'error';
        }

        LogHandler::save($this->integrationID, ['type' => 'record', 'type_name' => $actionName], $status, $apiResponse);

        return $apiResponse;
    }

    private function createMember($data)
    {
        unset($data['memberId']);
        $apiEndpoint = $this->apiEndpoint . '/members';
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
        $data['lockVersion'] = $this->lockVersion;
        if (empty($this->memberId)) {
            return new WP_Error('MISSING_MEMBER_ID', __('The email provided did not match any existing Fabman member.', 'bit-integrations'));
        }

        $response = \apply_filters('btcbi_fabman_update_member', false, json_encode($data), $this->setHeaders(), $this->apiEndpoint, $this->memberId);

        return $this->handleFilterResponse($response);
    }

    private function deleteMember()
    {
        if (empty($this->memberId)) {
            return new WP_Error('MISSING_MEMBER_ID', __('The email provided did not match any existing Fabman member.', 'bit-integrations'));
        }

        $response = \apply_filters('btcbi_fabman_delete_member', false, $this->setHeaders(), $this->apiEndpoint, $this->memberId);

        return $this->handleFilterResponse($response);
    }

    private function createSpace($data)
    {
        unset($data['space']);
        $response = \apply_filters('btcbi_fabman_create_space', false, json_encode($data), $this->setHeaders(), $this->apiEndpoint);

        return $this->handleFilterResponse($response);
    }

    private function updateSpace($data)
    {
        $data['lockVersion'] = $this->lockVersion;
        if (empty($this->workspaceId)) {
            return new WP_Error('MISSING_SPACE_ID', __('Please select a space to update.', 'bit-integrations'));
        }
        $response = \apply_filters('btcbi_fabman_update_space', false, json_encode($data), $this->setHeaders(), $this->apiEndpoint, $this->workspaceId);

        return $this->handleFilterResponse($response);
    }

    private function handleFilterResponse($response)
    {
        if (empty($response)) {
            return (object) ['error' => \wp_sprintf(\__('%s plugin is not installed or activated', 'bit-integrations'), 'Bit Integration Pro')];
        }

        return $response;
    }

    private function setHeaders(): array
    {
        return [
            'Authorization' => 'Bearer ' . $this->apiKey,
            'Content-Type'  => 'application/json'
        ];
    }
}
