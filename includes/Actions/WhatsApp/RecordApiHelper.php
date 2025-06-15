<?php

/**
 * WhatsApp Record Api
 */
namespace BitCode\FI\Actions\WhatsApp;

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

    public function __construct($integrationDetails, $integId)
    {
        $this->_integrationDetails = $integrationDetails;
        $this->_integrationID = $integId;
    }

    public function sendMessageWithTemplate(
        $numberId,
        $businessAccountID,
        $token,
        $data,
        $templateName,
        $phoneNumber
    ) {
        $apiEndPoint = "https://graph.facebook.com/v13.0/{$numberId}/messages";
        $header = [
            'Authorization' => 'Bearer ' . $token,
            'Accept' => '*/*',
            'verify' => false,
            'Content-Type' => 'application/json'
        ];

        $data = [
            'messaging_product' => 'whatsapp',
            'to' => "{$phoneNumber}",
            'type' => 'template',
            'template' => [
                'name' => $templateName,
                'language' => [
                    'code' => 'en_US'
                ]
            ]
        ];

        return HttpHelper::post($apiEndPoint, $data, $header);
    }

    public function sendMessageWithText(
        $numberId,
        $businessAccountID,
        $token,
        $data,
        $messagesBody,
        $phoneNumber
    ) {
        $apiEndPoint = "https://graph.facebook.com/v13.0/{$numberId}/messages";
        $header = [
            'Authorization' => 'Bearer ' . $token,
            'Accept' => '*/*',
            'verify' => false,
            'Content-Type' => 'application/json'
        ];
        $sanitizingSpace = rtrim($messagesBody, '&nbsp; ');

        $planMessage = strip_tags($sanitizingSpace);

        $data = [
            'messaging_product' => 'whatsapp',
            'to' => "{$phoneNumber}",
            'text' => [
                'body' => $planMessage
            ]
        ];

        return HttpHelper::post($apiEndPoint, $data, $header);
    }

    public function generateReqDataFromFieldMap($data, $fieldMap)
    {
        $dataFinal = [];

        foreach ($fieldMap as $key => $value) {
            $triggerValue = $value->formField;
            $actionValue = $value->whatsAppFormField;
            if ($triggerValue === 'custom') {
                $dataFinal[$actionValue] = Common::replaceFieldWithValue($value->customValue, $data);
            } elseif (!is_null($data[$triggerValue])) {
                $dataFinal[$actionValue] = $data[$triggerValue];
            }
        }
        return $dataFinal;
    }

    public function execute(
        $fieldValues,
        $fieldMap,
        $messageTypeId,
        $actions
    ) {
        $fieldData = [];
        $finalData = $this->generateReqDataFromFieldMap($fieldValues, $fieldMap);
        $phoneNumber = ltrim($finalData['phone'], '+');
        $templateName = $this->_integrationDetails->templateName;

        $numberId = $this->_integrationDetails->numberID;
        $businessAccountID = $this->_integrationDetails->businessAccountID;
        $token = $this->_integrationDetails->token;

        if ($messageTypeId === '2') {
            $apiResponse = $this->sendMessageWithTemplate(
                $numberId,
                $businessAccountID,
                $token,
                $finalData,
                $templateName,
                $phoneNumber
            );
        } else {
            $textBody = $this->_integrationDetails->body;
            $msg = Common::replaceFieldWithValue($textBody, $fieldValues);
            $messagesBody = str_replace(['<p>', '</p>'], ' ', $msg);
            $apiResponse = $this->sendMessageWithText(
                $numberId,
                $businessAccountID,
                $token,
                $finalData,
                $messagesBody,
                $phoneNumber
            );
        }
        if (property_exists($apiResponse, 'error')) {
            LogHandler::save($this->_integrationID, json_encode(['type' => 'contact', 'type_name' => 'send-message']), 'error', json_encode($apiResponse));
        } else {
            LogHandler::save($this->_integrationID, json_encode(['type' => 'record', 'type_name' => 'send-message']), 'success', json_encode($apiResponse));
        }
        return $apiResponse;
    }
}
