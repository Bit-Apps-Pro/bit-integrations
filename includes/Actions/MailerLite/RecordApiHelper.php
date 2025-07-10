<?php

/**
 * MailerLite    Record Api
 */

namespace BitCode\FI\Actions\MailerLite;

use BitCode\FI\Core\Util\Common;
use BitCode\FI\Core\Util\HttpHelper;
use BitCode\FI\Log\LogHandler;

/**
 * Provide functionality for Record insert, upsert
 */
class RecordApiHelper
{
    private $_integrationID;

    private $_integrationDetails;

    private $_defaultHeader;

    private $_baseUrl;

    private $_actions;

    private $_isMailerLiteV2;

    public function __construct($auth_token, $integrationDetails, $integId, $actions, $version)
    {
        $this->_integrationDetails = $integrationDetails;
        $this->_integrationID = $integId;
        $this->_isMailerLiteV2 = (bool) ('v2' === $version);

        if ('v2' === $version) {
            $this->_baseUrl = 'https://connect.mailerlite.com/api/';
            $this->_defaultHeader = [
                'Authorization' => "Bearer {$auth_token}"
            ];
        } else {
            $this->_baseUrl = 'https://api.mailerlite.com/api/v2/';
            $this->_defaultHeader = [
                'X-Mailerlite-Apikey' => $auth_token
            ];
        }
        $this->_actions = $actions;
    }

    public function existSubscriber($auth_token, $email)
    {
        if (empty($auth_token)) {
            wp_send_json_error(
                __(
                    'Requested parameter is empty',
                    'bit-integrations'
                ),
                400
            );
        }

        $apiEndpoints = $this->_baseUrl . "subscribers/{$email}";

        $response = HttpHelper::get($apiEndpoints, null, $this->_defaultHeader);

        return $response->data->id ?? false;
    }

    public function enableDoubleOptIn($auth_token)
    {
        if (empty($auth_token)) {
            wp_send_json_error(
                __(
                    'Requested parameter is empty',
                    'bit-integrations'
                ),
                400
            );
        }

        $apiEndpoints = $this->_baseUrl . 'settings/double_optin';
        $requestParams = [
            'enable' => true
        ];

        HttpHelper::post($apiEndpoints, $requestParams, $this->_defaultHeader);
    }

    public function addSubscriber($auth_token, $groupIds, $type, $finalData)
    {
        if (empty($finalData['email'])) {
            return [
                'success' => false,
                'message' => __('Required field Email is empty', 'bit-integrations'),
                'code'    => 400
            ];
        }

        $email = $finalData['email'];
        $splitGroupIds = !empty($groupIds) ? explode(',', $groupIds) : [];
        $apiEndpoint = $this->_baseUrl . 'subscribers';

        $requestParams = self::prepareRequestParams($finalData, $type, $this->_isMailerLiteV2);

        $isExist = $this->existSubscriber($auth_token, $email);
        $response = null;

        if ($isExist && empty($this->_actions->update)) {
            return [
                'success' => false,
                'message' => __('Subscriber already exist', 'bit-integrations'),
                'code'    => 400
            ];
        }

        self::handleDoubleOptIn($this, $auth_token, $requestParams, $this->_isMailerLiteV2);

        if (!empty($splitGroupIds)) {
            return self::sendToGroups($this, $splitGroupIds, $requestParams, $this->_isMailerLiteV2);
        }

        if ($isExist) {
            $response = HttpHelper::post($apiEndpoint, $requestParams, $this->_defaultHeader);
            $response->update = true;

            return $response;
        }

        return HttpHelper::post($apiEndpoint, $requestParams, $this->_defaultHeader);
    }

    public function deleteSubscriber($auth_token, $finalData, $forget = false)
    {
        if (!$this->_isMailerLiteV2) {
            return [
                'success' => false,
                'message' => __('This action is not supported for Classic accounts.', 'bit-integrations'),
                'code'    => 400
            ];
        }

        if (empty($finalData['email'])) {
            return [
                'success' => false,
                'message' => __('Required field Email is empty', 'bit-integrations'),
                'code'    => 400
            ];
        }

        $subscriberId = $this->existSubscriber($auth_token, $finalData['email']);

        if (empty($subscriberId)) {
            return [
                'success' => false,
                'message' => __('Subscriber not exist', 'bit-integrations'),
                'code'    => 400
            ];
        }

        $apiEndpoint = $forget
            ? $this->_baseUrl . 'subscribers/' . $subscriberId . '/forget'
            : $this->_baseUrl . 'subscribers/' . $subscriberId;

        return HttpHelper::request($apiEndpoint, $forget ? 'POST' : 'DELETE', $finalData, $this->_defaultHeader);
    }

    public function generateReqDataFromFieldMap($data, $fieldMap)
    {
        $dataFinal = [];

        foreach ($fieldMap as $key => $value) {
            $triggerValue = $value->formField;
            $actionValue = $value->mailerLiteFormField;
            if ($triggerValue === 'custom') {
                $dataFinal[$actionValue] = Common::replaceFieldWithValue($value->customValue, $data);
            } elseif (!\is_null($data[$triggerValue])) {
                $dataFinal[$actionValue] = $data[$triggerValue];
            }
        }

        return $dataFinal;
    }

    public function execute(
        $groupId,
        $type,
        $fieldValues,
        $fieldMap,
        $auth_token,
        $action
    ) {
        $finalData = $this->generateReqDataFromFieldMap($fieldValues, $fieldMap);

        switch ($action) {
            case 'delete_subscriber':
                $apiResponse = $this->deleteSubscriber($auth_token, $finalData);
                $typeName = 'delete-subscriber';
                $res = ['success' => true, 'message' => __('Subscriber deleted successfully', 'bit-integrations'), 'code' => 200];

                break;

            case 'forget_subscriber':
                $apiResponse = $this->deleteSubscriber($auth_token, $finalData, true);
                $typeName = 'forget-subscriber';
                $res = $apiResponse->message ?? wp_json_encode($apiResponse);

                break;

            default:
                $apiResponse = $this->addSubscriber($auth_token, $groupId, $type, $finalData);
                $typeName = 'add-subscriber';
                $res = ['success' => true, 'message' => isset($apiResponse->update) ? __('Subscriber updated successfully', 'bit-integrations') : __('Subscriber created successfully', 'bit-integrations'), 'code' => 200];

                break;
        }

        if (isset($apiResponse->data->id) || isset($apiResponse->id) || str_starts_with((string) HttpHelper::$responseCode, '20')) {
            LogHandler::save($this->_integrationID, wp_json_encode(['type' => 'subscriber', 'type_name' => $typeName]), 'success', wp_json_encode($res));
        } else {
            LogHandler::save($this->_integrationID, wp_json_encode(['type' => 'subscriber', 'type_name' => $typeName]), 'error', wp_json_encode($apiResponse));
        }

        return $apiResponse;
    }

    private static function prepareRequestParams($finalData, $type, $isMailerLiteV2)
    {
        $email = $finalData['email'];
        $params = [
            'email'                             => $email,
            $isMailerLiteV2 ? 'status' : 'type' => $type ? $type : 'active',
        ];

        foreach ($finalData as $key => $value) {
            if ($key !== 'email') {
                $params['fields'][$key] = $value;
            }
        }

        $params['fields'] = !empty($params['fields']) ? (object) $params['fields'] : [];

        return $params;
    }

    private static function handleDoubleOptIn($context, $auth_token, &$requestParams, $isMailerLiteV2)
    {
        if (empty($context->_actions->double_opt_in)) {
            return;
        }

        if ($isMailerLiteV2) {
            $requestParams['opted_in_at'] = date('Y-m-d H:i:s');
            $requestParams['optin_ip'] = $_SERVER['REMOTE_ADDR'];
        } else {
            $context->enableDoubleOptIn($auth_token);
        }
    }

    private static function sendToGroups($context, $groupIds, $requestParams, $isMailerLiteV2)
    {
        $response = null;

        if ($isMailerLiteV2) {
            $requestParams['groups'] = $groupIds;
            $endpoint = $context->_baseUrl . 'subscribers';
            $response = HttpHelper::post($endpoint, $requestParams, $context->_defaultHeader);
        } else {
            foreach ($groupIds as $groupId) {
                $endpoint = $context->_baseUrl . 'groups/' . $groupId . '/subscribers';
                $response = HttpHelper::post($endpoint, $requestParams, $context->_defaultHeader);
            }
        }

        return $response;
    }
}
