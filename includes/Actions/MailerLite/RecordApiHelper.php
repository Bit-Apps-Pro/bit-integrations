<?php

/**
 * MailerLite    Record Api
 */

namespace BitCode\FI\Actions\MailerLite;

use BitCode\FI\Log\LogHandler;
use BitCode\FI\Core\Util\Common;
use BitCode\FI\Core\Util\HttpHelper;

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

    public function __construct($auth_token, $integrationDetails, $integId, $actions, $version)
    {
        $this->_integrationDetails = $integrationDetails;
        $this->_integrationID = $integId;
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

        return ! (property_exists($response, 'error') || 'Resource not found.' === $response->message)

        ;
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
        $apiEndpoints = $this->_baseUrl . 'subscribers';
        $splitGroupIds = null;
        if (!empty($groupIds)) {
            $splitGroupIds = explode(',', $groupIds);
        }

        if (empty($finalData['email'])) {
            return ['success' => false, 'message' => __('Required field Email is empty', 'bit-integrations'), 'code' => 400];
        }
        if ('https://connect.mailerlite.com/api/' === $this->_baseUrl) {
            $requestParams = [
                'email'  => $finalData['email'],
                'status' => $type ? $type : 'active',
            ];
        } else {
            $requestParams = [
                'email' => $finalData['email'],
                'type'  => $type ? $type : 'active',
            ];
        }

        foreach ($finalData as $key => $value) {
            if ('email' !== $key) {
                $requestParams['fields'][$key] = $value;
            }
        }
        $requestParams['fields'] = !empty($requestParams['fields']) ? (object) $requestParams['fields'] : [];
        $email = $finalData['email'];
        $isExist = $this->existSubscriber($auth_token, $email);
        $response = null;

        if ($isExist && !empty($this->_actions->update)) {
            if (!empty($this->_actions->double_opt_in)) {
                $this->enableDoubleOptIn($auth_token);
            }
            if (!empty($groupIds)) {
                if ('https://connect.mailerlite.com/api/' === $this->_baseUrl) {
                    $requestParams['groups'] = $splitGroupIds;
                    $response = HttpHelper::post($apiEndpoints, $requestParams, $this->_defaultHeader);
                } else {
                    for ($i = 0; $i < \count($splitGroupIds); $i++) {
                        $apiEndpoints = $this->_baseUrl . 'groups/' . $splitGroupIds[$i] . '/subscribers';
                        $response = HttpHelper::post($apiEndpoints, $requestParams, $this->_defaultHeader);
                    }
                }

                return $response;
            }
            $response = HttpHelper::post($apiEndpoints, $requestParams, $this->_defaultHeader);
            $response->update = true;
        } elseif ($isExist && empty($this->_actions->update)) {
            return ['success' => false, 'message' => __('Subscriber already exist', 'bit-integrations'), 'code' => 400];
        } else {
            if (!empty($this->_actions->double_opt_in)) {
                $this->enableDoubleOptIn($auth_token);
            }
            if (!empty($groupIds)) {
                if ('https://connect.mailerlite.com/api/' === $this->_baseUrl) {
                    $requestParams['groups'] = $splitGroupIds;
                    $response = HttpHelper::post($apiEndpoints, $requestParams, $this->_defaultHeader);
                } else {
                    for ($i = 0; $i < \count($splitGroupIds); $i++) {
                        $apiEndpoints = $this->_baseUrl . 'groups/' . $splitGroupIds[$i] . '/subscribers';
                        $response = HttpHelper::post($apiEndpoints, $requestParams, $this->_defaultHeader);
                    }
                }

                return $response;
            }
            $response = HttpHelper::post($apiEndpoints, $requestParams, $this->_defaultHeader);
        }

        return $response;
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
        $auth_token
    ) {
        $finalData = $this->generateReqDataFromFieldMap($fieldValues, $fieldMap);
        $apiResponse = $this->addSubscriber($auth_token, $groupId, $type, $finalData);

        if (isset($apiResponse->data->id) || isset($apiResponse->id)) {
            $res = ['success' => true, 'message' => isset($apiResponse->update) ? __('Subscriber updated successfully', 'bit-integrations') : __('Subscriber created successfully', 'bit-integrations'), 'code' => 200];
            LogHandler::save($this->_integrationID, wp_json_encode(['type' => 'subscriber', 'type_name' => 'add-subscriber']), 'success', wp_json_encode($res));
        } else {
            LogHandler::save($this->_integrationID, wp_json_encode(['type' => 'subscriber', 'type_name' => 'add-subscriber']), 'error', wp_json_encode($apiResponse));
        }

        return $apiResponse;
    }
}
