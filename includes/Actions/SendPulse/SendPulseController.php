<?php

namespace BitCode\FI\Actions\SendPulse;

use WP_Error;
use BitCode\FI\Flow\FlowController;
use BitCode\FI\Actions\SendPulse\RecordApiHelper;
use BitCode\FI\Core\Util\HttpHelper;

class SendPulseController
{
    private $integrationID;

    public function __construct($integrationID)
    {
        $this->integrationID = $integrationID;
    }

    public static function authorization($requestParams)
    {
        if (empty($requestParams->client_id) || empty($requestParams->client_secret)) {
            wp_send_json_error(__('Requested parameter is empty', 'bit-integrations'), 400);
        }

        $body = [
            'grant_type'    => 'client_credentials',
            'client_id'     => $requestParams->client_id,
            'client_secret' => $requestParams->client_secret,
        ];

        $apiEndpoint = 'https://api.sendpulse.com/oauth/access_token';

        $apiResponse = HttpHelper::post($apiEndpoint, $body);

        if (is_wp_error($apiResponse) || !empty($apiResponse->error)) {
            wp_send_json_error(empty($apiResponse->error_description) ? 'Unknown' : $apiResponse->error_description, 400);
        }
        $apiResponse->generates_on = \time();

        wp_send_json_success($apiResponse, 200);
    }

    public static function sendPulseHeaders($requestParams)
    {
        if (empty($requestParams->client_id) || empty($requestParams->client_secret)
        ) {
            wp_send_json_error(
                __(
                    'Requested parameter is empty',
                    'bit-integrations'
                ),
                400
            );
        }

        $listId = $requestParams->list_id;

        $apiEndpoint = "https://api.sendpulse.com/addressbooks/{$listId}/variables";

        $token   = self::tokenExpiryCheck($requestParams->tokenDetails, $requestParams->client_id, $requestParams->client_secret);

        $headers = [
            'Authorization' => 'Bearer ' . $token->access_token,
        ];

        $sendPulseResponse = HttpHelper::get($apiEndpoint, null, $headers);

        $fields = [];
        if (!is_wp_error($sendPulseResponse)) {
            $allFields = $sendPulseResponse;
            $fields['Email'] = (object) ['fieldValue' => 'email', 'fieldName' => 'Email', 'required' => true];
            $fields['Name'] = (object) ['fieldValue' => 'name', 'fieldName' => 'Name', 'required' => false];
            $fields['Phone'] = (object) ['fieldValue' => 'phone', 'fieldName' => 'Phone', 'required' => false];
            foreach ($allFields as $field) {
                if (array_key_exists(ucfirst($field->name), $fields)) {
                    $fields[$field->name] = (object) [
                        'fieldName' => $field->name,
                        'fieldValue' => strtolower(str_replace(' ', '_', $field->name)),
                        'required' =>  strtolower($field->name)=='email' ? true : false
                    ];
                }
            }

            $response['sendPulseField'] = $fields;

            wp_send_json_success($response);
        }
    }

    public static function getAllList($requestParams)
    {
        if (empty($requestParams->tokenDetails) || empty($requestParams->client_id) || empty($requestParams->client_secret)) {
            wp_send_json_error(__('Requested parameter is empty', 'bit-integrations'), 400);
        }

        $token   = self::tokenExpiryCheck($requestParams->tokenDetails, $requestParams->client_id, $requestParams->client_secret);
        $headers = [
            'Authorization' => 'Bearer ' . $token->access_token,
        ];
        $apiEndpoint = 'https://api.sendpulse.com/addressbooks';
        $apiResponse = HttpHelper::get($apiEndpoint, null, $headers);
        $lists       = [];

        foreach ($apiResponse as $item) {
            $lists[] = [
                'listId' => $item->id,
                'listName'   => $item->name
            ];
        }

        if ((count($lists))>0) {
            wp_send_json_success($lists, 200);
        } else {
            wp_send_json_error('List fetching failed', 400);
        }
    }

    protected static function tokenExpiryCheck($token, $clientId, $clientSecret)
    {
        if (!$token) {
            return false;
        }

        if ((intval($token->generates_on) + (55 * 60)) < time()) {
            $refreshToken = self::refreshToken($token->access_token, $clientId, $clientSecret);
            if (is_wp_error($refreshToken) || !empty($refreshToken->error)) {
                return false;
            }

            $token->access_token = $refreshToken->access_token;
            $token->expires_in   = $refreshToken->expires_in;
            $token->generates_on = $refreshToken->generates_on;
        }

        return $token;
    }

    protected static function refreshToken($clientId, $clientSecret)
    {
        $body = [
            'grant_type'    => 'client_credentials',
            'client_id'     => $clientId,
            'client_secret' => $clientSecret,
        ];

        $apiEndpoint = 'https://api.sendpulse.com/oauth/access_token';
        $apiResponse = HttpHelper::post($apiEndpoint, $body);
        if (is_wp_error($apiResponse) || !empty($apiResponse->error)) {
            return false;
        }
        $token = $apiResponse;
        $token->generates_on = \time();
        return $token;
    }

    protected function saveRefreshedToken($integrationID, $tokenDetails)
    {
        if (empty($integrationID)) {
            return;
        }

        $flow = new FlowController();
        $sendPulseDetails = $flow->get(['id' => $integrationID]);
        if (is_wp_error($sendPulseDetails)) {
            return;
        }

        $newDetails = json_decode($sendPulseDetails[0]->flow_details);
        $newDetails->tokenDetails = $tokenDetails;
        $flow->update($integrationID, ['flow_details' => \json_encode($newDetails)]);
    }

    public function execute($integrationData, $fieldValues)
    {
        $integrationDetails = $integrationData->flow_details;
        $integId            = $integrationData->id;
        $selectedList       = $integrationDetails->listId;
        $fieldMap           = $integrationDetails->field_map;
        $tokenDetails       = self::tokenExpiryCheck($integrationDetails->tokenDetails, $integrationData->flow_details->client_id, $integrationData->flow_details->client_secret);
        if ($tokenDetails->access_token !== $integrationDetails->tokenDetails->access_token) {
            $this->saveRefreshedToken($this->integrationID, $tokenDetails);
        }

        if (empty($fieldMap) || empty($tokenDetails) || empty($selectedList)) {
            return new WP_Error('REQ_FIELD_EMPTY', __('module, fields are required for SendPulse api', 'bit-integrations'));
        }

        $recordApiHelper   = new RecordApiHelper($integrationDetails, $integId, $tokenDetails->access_token);

        $sendPulseApiResponse = $recordApiHelper->execute(
            $selectedList,
            $fieldValues,
            $fieldMap
        );

        if (is_wp_error($sendPulseApiResponse)) {
            return $sendPulseApiResponse;
        }
        return $sendPulseApiResponse;
    }
}
