<?php

/**
 * WhatsApp Record Api
 */

namespace BitCode\FI\Actions\WhatsApp;

use BitCode\FI\Core\Util\Common;
use BitCode\FI\Core\Util\Helper;
use BitCode\FI\Core\Util\HttpHelper;
use BitCode\FI\Log\LogHandler;

/**
 * Provide functionality for Record insert, upsert
 */
class RecordApiHelper
{
    private $_integrationID;

    private $_integrationDetails;

    private $_baseUrl = 'https://graph.facebook.com/v20.0/';

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
        $phoneNumber
    ) {
        $templateName = $this->_integrationDetails->templateName;
        $apiEndPoint = "{$this->_baseUrl}{$businessAccountID}/message_templates?fields=language&name={$templateName}";
        $response = HttpHelper::get($apiEndPoint, null, static::setHeaders($token));
        $language = $response->data[0]->language ?? 'en_US';

        $apiEndPoint = "{$this->_baseUrl}{$numberId}/messages";
        $data = [
            'messaging_product' => 'whatsapp',
            'to'                => "{$phoneNumber}",
            'type'              => 'template',
            'template'          => [
                'name'     => $templateName,
                'language' => [
                    'code' => $language
                ]
            ]
        ];

        return HttpHelper::post($apiEndPoint, $data, static::setHeaders($token));
    }

    public function sendMessageWithText(
        $numberId,
        $fieldValues,
        $token,
        $phoneNumber
    ) {
        if (Helper::proActionFeatExists('WhatsApp', 'sendTextMessages')) {
            $textBody = $this->_integrationDetails->body;
            $response = apply_filters('btcbi_whatsapp_send_text_messages', $textBody, $fieldValues, $numberId, $token, $phoneNumber);

            return static::handleFilterResponse($response);
        }

        return (object) ['error' => wp_sprintf(__('%s plugin is not installed or activate', 'bit-integrations'), 'Bit Integration Pro')];
    }

    public function sendMessageWithMedia(
        $numberId,
        $fieldValues,
        $token,
        $phoneNumber
    ) {
        if (Helper::proActionFeatExists('WhatsApp', 'sendMediaMessages')) {
            $response = apply_filters('btcbi_whatsapp_send_media_messages', $this->_integrationDetails, $fieldValues, $numberId, $token, $phoneNumber);

            return static::handleFilterResponse($response);
        }

        return (object) ['error' => wp_sprintf(__('%s plugin is not installed or activate', 'bit-integrations'), 'Bit Integration Pro')];
    }

    public function sendMessageWithContact(
        $numberId,
        $fieldValues,
        $token,
        $phoneNumber
    ) {
        if (Helper::proActionFeatExists('WhatsApp', 'sendContactMessages')) {
            $response = apply_filters('btcbi_whatsapp_send_contact_messages', $this->_integrationDetails, $fieldValues, $numberId, $token, $phoneNumber);

            return static::handleFilterResponse($response);
        }

        return (object) ['error' => wp_sprintf(__('%s plugin is not installed or activate', 'bit-integrations'), 'Bit Integration Pro')];
    }

    public function generateReqDataFromFieldMap($data, $fieldMap)
    {
        $dataFinal = [];

        foreach ($fieldMap as $key => $value) {
            $triggerValue = $value->formField;
            $actionValue = $value->whatsAppFormField;
            if ($triggerValue === 'custom') {
                $dataFinal[$actionValue] = Common::replaceFieldWithValue($value->customValue, $data);
            } elseif (!\is_null($data[$triggerValue])) {
                $dataFinal[$actionValue] = $data[$triggerValue];
            }
        }

        return $dataFinal;
    }

    public function execute($fieldValues, $messageType)
    {
        $fieldMap = $this->_integrationDetails->field_map;
        $finalData = $this->generateReqDataFromFieldMap($fieldValues, $fieldMap);
        $phoneNumber = ltrim($finalData['phone'], '+');

        $numberId = $this->_integrationDetails->numberID;
        $businessAccountID = $this->_integrationDetails->businessAccountID;
        $token = $this->_integrationDetails->token;

        if ($messageType === 'template' || $messageType === '2') {
            $apiResponse = $this->sendMessageWithTemplate($numberId, $businessAccountID, $token, $finalData, $phoneNumber);
            $typeName = 'Template Message';
        } elseif ($messageType === 'text') {
            $apiResponse = $this->sendMessageWithText($numberId, $fieldValues, $token, $phoneNumber);
            $typeName = 'Text Message';
        } elseif ($messageType === 'media') {
            $apiResponse = $this->sendMessageWithMedia($numberId, $fieldValues, $token, $phoneNumber);
            $typeName = 'Media Message';
        } elseif ($messageType === 'contact') {
            $apiResponse = $this->sendMessageWithContact($numberId, $fieldValues, $token, $phoneNumber);
            $typeName = 'Media Message';
        }

        if (property_exists($apiResponse, 'error')) {
            LogHandler::save($this->_integrationID, wp_json_encode(['type' => 'message', 'type_name' => $typeName]), 'error', wp_json_encode($apiResponse));
        } else {
            LogHandler::save($this->_integrationID, wp_json_encode(['type' => 'message', 'type_name' => $typeName]), 'success', wp_json_encode($apiResponse));
        }

        return $apiResponse;
    }

    private function handleFilterResponse($response)
    {
        if (isset($response->messages[0]->id) || isset($response->error) || is_wp_error($response)) {
            return $response;
        }

        return (object) ['error' => wp_sprintf(__('%s plugin is not installed or activate', 'bit-integrations'), 'Bit Integration Pro')];
    }

    private static function setHeaders($token)
    {
        return
            [
                'Authorization' => "Bearer {$token}",
                'Content-type'  => 'application/json',
            ];
    }
}
