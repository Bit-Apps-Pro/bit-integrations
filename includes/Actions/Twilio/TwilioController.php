<?php

/**
 * Rapidmail Integration
 */

namespace BitCode\FI\Actions\Twilio;

use BitCode\FI\Core\Util\HttpHelper;
use BitCode\FI\Log\LogHandler;
use WP_Error;

final class TwilioController
{
    public static $apiBaseUri = 'https://api.twilio.com/2010-04-01';

    protected $_defaultHeader;

    private $_integrationID;

    public function __construct($integrationID)
    {
        $this->_integrationID = $integrationID;
    }

    public static function checkAuthorization($tokenRequestParams)
    {
        if (
            empty($tokenRequestParams->sid)
            || empty($tokenRequestParams->token)
            || empty($tokenRequestParams->from_num)
        ) {
            wp_send_json_error(
                __(
                    'Requested parameter is empty',
                    'bit-integrations'
                ),
                400
            );
        }
        $header = [
            'Authorization' => 'Basic ' . base64_encode("{$tokenRequestParams->sid}:{$tokenRequestParams->token}"),
            'Accept'        => '*/*',
            'verify'        => false
        ];
        $apiEndpoint = self::$apiBaseUri . '/Accounts';

        $apiResponse = HttpHelper::get($apiEndpoint, null, $header);

        $xml = simplexml_load_string($apiResponse);
        $json = wp_json_encode($xml);
        $response = json_decode($json, true);

        if (\array_key_exists('RestException', $response)) {
            wp_send_json_error(
                'Unauthorize',
                400
            );
        } else {
            wp_send_json_success($apiResponse, 200);
        }
    }

    public function execute($integrationData, $fieldValues)
    {
        $integrationDetails = $integrationData->flow_details;
        $fieldMap = $integrationDetails->field_map;
        $sid = $integrationDetails->sid;
        $token = $integrationDetails->token;
        $from_num = $integrationDetails->from_num;

        if (
            empty($sid)
            || empty($token)
            || empty($from_num)
            || empty($fieldMap)
        ) {
            $error = new WP_Error('REQ_FIELD_EMPTY', __('SID, Auth Token,From Number and mapping fields are required for rapidmail api', 'bit-integrations'));
            LogHandler::save($this->_integrationID, 'twilio sms sending', 'validation', $error);

            return $error;
        }
        $recordApiHelper = new RecordApiHelper($integrationDetails, $sid, $token, $from_num);

        return $recordApiHelper->executeRecordApi(
            $this->_integrationID,
            $fieldValues,
            $fieldMap,
            $integrationDetails
        );
    }
}
