<?php

namespace BitCode\FI\Actions\UserRegistrationMembership;

use BitCode\FI\Core\Util\Common;
use BitCode\FI\Log\LogHandler;

/**
 * Provide functionality for User Registration and Membership integration
 */
class RecordApiHelper
{
    private $_integrationID;

    private $_integrationDetails;

    public function __construct($integrationDetails, $integId)
    {
        $this->_integrationDetails = $integrationDetails;
        $this->_integrationID = $integId;
    }

    public function execute($fieldValues, $fieldMap)
    {
        if (!class_exists('UserRegistration')) {
            $response = [
                'success' => false,
                'message' => __('User Registration and Membership is not installed or activated', 'bit-integrations')
            ];

            LogHandler::save($this->_integrationID, ['type' => 'User Registration', 'type_name' => 'check'], 'error', $response);

            return $response;
        }

        $fieldData = $this->generateReqDataFromFieldMap($fieldMap, $fieldValues);
        $mainAction = $this->_integrationDetails->mainAction ?? 'create_user';
        $response = $this->processAction($mainAction, $fieldData);

        $responseType = !empty($response['success']) ? 'success' : 'error';
        LogHandler::save($this->_integrationID, ['type' => 'User Registration', 'type_name' => $mainAction], $responseType, $response);

        return $response;
    }

    private function processAction($mainAction, $fieldData)
    {
        $defaultResponse = [
            'success' => false,
            'message' => wp_sprintf(__('%s plugin is not installed or activate', 'bit-integrations'), 'Bit Integrations Pro')
        ];

        switch ($mainAction) {
            case 'create_user':
                return apply_filters('btcbi_user_registration_create_user', $defaultResponse, $fieldData, $this->_integrationDetails);

            default:
                return [
                    'success' => false,
                    'message' => __('Invalid action', 'bit-integrations')
                ];
        }
    }

    private function generateReqDataFromFieldMap($fieldMap, $fieldValues)
    {
        $dataFinal = [];

        foreach ($fieldMap as $item) {
            if (empty($item->userRegistrationField)) {
                continue;
            }

            $dataFinal[$item->userRegistrationField] = $item->formField === 'custom' && isset($item->customValue)
                ? Common::replaceFieldWithValue($item->customValue, $fieldValues)
                : ($fieldValues[$item->formField] ?? '');
        }

        return $dataFinal;
    }
}
