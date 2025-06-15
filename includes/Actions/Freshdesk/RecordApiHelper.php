<?php

/**
 * Freshdesk Record Api
 */

namespace BitCode\FI\Actions\Freshdesk;

use BitCode\FI\Core\Util\Common;
use BitCode\FI\Core\Util\HttpHelper;
use BitCode\FI\Log\LogHandler;

/**
 * Provide functionality for Record insert, upsert
 */
class RecordApiHelper
{
    private $_integrationID;

    private $_api_key;

    public function __construct($api_key, $integrationId)
    {
        $this->_api_key = $api_key;
        $this->_integrationID = $integrationId;
    }

    public function insertTicket($apiEndpoint, $data, $api_key, $fileTicket)
    {
        if (
            empty($data)
            || empty($api_key)
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
            'Authorization' => base64_encode("{$api_key}"),
            'Content-Type'  => 'application/json'
        ];

        if ($fileTicket) {
            $data = $data + ['attachments' => $fileTicket];

            $sendPhotoApiHelper = new AllFilesApiHelper();

            return $sendPhotoApiHelper->allUploadFiles($apiEndpoint, $data, $api_key);
        }
        $data = wp_json_encode($data);
        $apiResponse = HttpHelper::post($apiEndpoint, $data, $header);
        if (is_wp_error($apiResponse) || !empty($apiResponse->error)) {
            wp_send_json_error(
                empty($apiResponse->error) ? 'Unknown' : $apiResponse->error,
                400
            );
        }
        $apiResponse->generates_on = time();

        return $apiResponse;
    }

    public function generateReqDataFromFieldMap($data, $fieldMap)
    {
        $dataFinal = [];
        foreach ($fieldMap as $key => $value) {
            $triggerValue = $value->formField;
            $actionValue = $value->freshdeskFormField;
            if ($triggerValue === 'custom') {
                $dataFinal[$actionValue] = Common::replaceFieldWithValue($value->customValue, $data);
            } elseif (!\is_null($data[$triggerValue])) {
                $dataFinal[$actionValue] = $data[$triggerValue];
            }
        }

        return $dataFinal;
    }

    public function generateReqDataFromFieldMapContact($data, $fieldMapContact)
    {
        $dataFinalContact = [];

        foreach ($fieldMapContact as $key => $value) {
            $triggerValue = $value->formField;
            $actionValue = $value->contactFreshdeskFormField;
            if ($triggerValue === 'custom') {
                $dataFinalContact[$actionValue] = Common::replaceFieldWithValue($value->customValue, $data);
            } elseif (!\is_null($data[$triggerValue])) {
                $dataFinalContact[$actionValue] = $data[$triggerValue];
            }
        }

        return $dataFinalContact;
    }

    public function fetchContact($app_base_domamin, $email, $api_key)
    {
        $apiEndpoint = $app_base_domamin . '/api/v2/contacts?email=' . $email;

        if (
            empty($app_base_domamin)
            || empty($email) || empty($api_key)
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
            'Authorization' => base64_encode("{$api_key}"),
            'Content-Type'  => 'application/json'
        ];
        $apiEndpoint = $app_base_domamin . '/api/v2/contacts?email=' . $email;

        return HttpHelper::get($apiEndpoint, null, $header);
    }

    public function insertContact($app_base_domamin, $finalDataContact, $api_key, $avatar)
    {
        if (
            empty($app_base_domamin)
            || empty($finalDataContact)
            || empty($api_key)
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
            'Authorization' => base64_encode("{$api_key}"),
            'Content-Type'  => 'multipart/form-data'
        ];

        $data = $finalDataContact;
        $apiEndpoint = $app_base_domamin . '/api/v2/contacts/';
        if ($avatar) {
            $data = $finalDataContact + ['avatar' => static::getAvatar($avatar)];
            $sendPhotoApiHelper = new FilesApiHelper();

            return $sendPhotoApiHelper->uploadFiles($apiEndpoint, $data, $api_key);
        }

        return HttpHelper::post($apiEndpoint, $data, $header);
    }

    public function updateContact($app_base_domamin, $finalDataContact, $api_key, $contactId)
    {
        if (
            empty($app_base_domamin)
            || empty($finalDataContact)
            || empty($api_key) || empty($contactId)
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
            'Authorization' => base64_encode("{$api_key}"),
            'Content-Type'  => 'application/json'
        ];
        $data = wp_json_encode($finalDataContact);
        $apiEndpoint = $app_base_domamin . '/api/v2/contacts/' . $contactId;

        return HttpHelper::request($apiEndpoint, 'PUT', $data, $header);
    }

    public function execute(
        $apiEndpoint,
        $fieldValues,
        $fieldMap,
        $fieldMapContact,
        $integrationDetails,
        $app_base_domamin
    ) {
        $fieldData = [];
        $finalData = $this->generateReqDataFromFieldMap($fieldValues, $fieldMap);
        $finalData = $finalData + ['status' => json_decode($integrationDetails->status)] + ['priority' => json_decode($integrationDetails->priority)];

        if (!empty($integrationDetails->selected_ticket_type)) {
            $finalData['type'] = $integrationDetails->selected_ticket_type;
        }
        if (!empty($integrationDetails->selected_ticket_source)) {
            $finalData['source'] = (int) $integrationDetails->selected_ticket_source;
        }
        if (!empty($integrationDetails->selected_ticket_group)) {
            $finalData['group_id'] = (int) $integrationDetails->selected_ticket_group;
        }
        if (!empty($integrationDetails->selected_ticket_product)) {
            $finalData['product_id'] = (int) $integrationDetails->selected_ticket_product;
        }
        if (!empty($integrationDetails->selected_ticket_agent)) {
            $finalData['responder_id'] = (int) $integrationDetails->selected_ticket_agent;
        }

        if ($integrationDetails->updateContact && $integrationDetails->contactShow) {
            $finalDataContact = $this->generateReqDataFromFieldMapContact($fieldValues, $fieldMapContact);
            $avatarFieldName = $integrationDetails->actions->attachments;
            $avatar = $fieldValues[$avatarFieldName];
            $apiResponseFetchContact = $this->fetchContact($app_base_domamin, $finalDataContact['email'], $integrationDetails->api_key);
            if (empty($apiResponseFetchContact)) {
                $apiResponseContact = $this->insertContact($app_base_domamin, $finalDataContact, $integrationDetails->api_key, $avatar);
            } else {
                $contactId = $apiResponseFetchContact[0]->id;
                $apiResponseContact = $this->updateContact($app_base_domamin, $finalDataContact, $integrationDetails->api_key, $contactId);
            }
        }

        if ($integrationDetails->contactShow) {
            $finalDataContact = $this->generateReqDataFromFieldMapContact($fieldValues, $fieldMapContact);
            $avatarFieldName = $integrationDetails->actions->attachments;
            $avatar = $fieldValues[$avatarFieldName];
            $apiResponseFetchContact = $this->fetchContact($app_base_domamin, $finalDataContact['email'], $integrationDetails->api_key);
            if (empty($apiResponseFetchContact)) {
                $apiResponseContact = $this->insertContact($app_base_domamin, $finalDataContact, $integrationDetails->api_key, $avatar);
            }
        }
        $attachmentsFieldName = $integrationDetails->actions->file;
        $fileTicket = $fieldValues[$attachmentsFieldName];
        $apiResponse = $this->insertTicket($apiEndpoint, $finalData, $integrationDetails->api_key, $fileTicket);

        if (property_exists($apiResponse, 'errors')) {
            LogHandler::save($this->_integrationID, wp_json_encode(['type' => 'contact', 'type_name' => 'add-contact']), 'error', wp_json_encode($apiResponse));
        } else {
            LogHandler::save($this->_integrationID, wp_json_encode(['type' => 'record', 'type_name' => 'add-contact']), 'success', wp_json_encode($apiResponse));
        }

        return $apiResponse;
    }

    private static function getAvatar($avatar)
    {
        foreach ($avatar as $value) {
            if (\is_array($value)) {
                return static::getAvatar($value);
            }

            return $value;
        }
    }
}
