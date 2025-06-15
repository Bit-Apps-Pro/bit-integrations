<?php

/**
 * ConstantContact    Record Api
 */
namespace BitCode\FI\Actions\ConstantContact;

use BitCode\FI\Core\Util\Common;
use BitCode\FI\Core\Util\HttpHelper;
use BitCode\FI\Log\LogHandler;
use Requests;

/**
 * Provide functionality for Record insert, upsert
 */
class RecordApiHelper
{
    private $_integrationID;
    private $baseUrl = 'https://api.cc.email/v3/';

    public function __construct($integrationDetails, $integId)
    {
        $this->_integrationDetails = $integrationDetails;
        $this->_integrationID = $integId;
        $this->_defaultHeader = [
            'Authorization' => "Bearer {$this->_integrationDetails->tokenDetails->access_token}",
            'content-type'  => 'application/json'
        ];
    }

    public function addContact(
        $listIds,
        $tagIds,
        $source_type,
        $finalData
    ) {
        $apiEndpoints = $this->baseUrl . 'contacts';
        $splitListIds = [];
        $splitTagIds = [];
        if (!empty($listIds)) {
            $splitListIds = explode(',', $listIds);
        }

        if (!empty($tagIds)) {
            $splitTagIds = explode(',', $tagIds);
        }
        if (empty($finalData['email_address'])) {
            return ['success' => false, 'message' => 'Required field Email is empty', 'code' => 400];
        }

        $requestParams = [
            'email_address' => (object)[
                'address'            => $finalData['email_address'],
                'permission_to_send' => 'implicit'
            ],
            'create_source'    => $source_type,
            'list_memberships' => $splitListIds,
            'taggings'         => $splitTagIds
        ];
        $customFields = [];
        foreach ($finalData as $key => $value) {
            if ($key !== 'email_address') {
                if (str_contains($key, 'custom-')) {
                    $replacedStr = str_replace('custom-', '', $key);
                    array_push($customFields, [
                        'custom_field_id' => $replacedStr,
                        'value'           => $value
                    ]);
                } else {
                    $requestParams[$key] = $value;
                }
            }
        }
        $requestParams['custom_fields'] = $customFields;

        $apiResponse = HttpHelper::post($apiEndpoints, json_encode((object) $requestParams), $this->_defaultHeader);

        if (gettype($apiResponse) === 'array' && isset($apiResponse[0]->error_key) && $apiResponse[0]->error_key === 'contacts.api.conflict') {
            $startIndx = strpos($apiResponse[0]->error_message, 'contact');
            $strLength = strlen($apiResponse[0]->error_message);
            $contactId = substr($apiResponse[0]->error_message, $startIndx + 8, $strLength);
            $apiEndpoints = $this->baseUrl . 'contacts/' . $contactId;
            unset($requestParams['create_source']);
            $requestParams['update_source'] = $source_type;
            $apiResponse = Requests::PUT($apiEndpoints, $this->_defaultHeader, json_encode((object) $requestParams));
        }

        return $apiResponse;
    }

    public function generateReqDataFromFieldMap($data, $fieldMap)
    {
        $dataFinal = [];
        foreach ($fieldMap as $value) {
            $triggerValue = $value->formField;
            $actionValue = $value->constantContactFormField;
            if ($triggerValue === 'custom') {
                $dataFinal[$actionValue] = Common::replaceFieldWithValue($value->customValue, $data);
            } elseif (!is_null($data[$triggerValue])) {
                $dataFinal[$actionValue] = $data[$triggerValue];
            }
        }

        return $dataFinal;
    }

    public function execute(
        $listIds,
        $tagIds,
        $source_type,
        $fieldValues,
        $fieldMap,
        $addressFields,
        $phoneFields,
        $addressType,
        $phoneType
    ) {
        $finalData = $this->generateReqDataFromFieldMap($fieldValues, $fieldMap);
        if (!empty($addressFields)) {
            $fvalue = [];
            foreach ($addressFields as $key) {
                foreach ($fieldValues as $k => $v) {
                    if ($key->formField == $k) {
                        $fvalue[$key->constantContactAddressField] = $v;
                    }
                    if ($key->formField === 'custom') {
                        $fvalue[$key->constantContactAddressField] = $key->customValue;
                    }
                }
            }
            $fvalue['kind'] = $addressType;
            $finalData['street_addresses'] = [$fvalue];
        }
        if (!empty($phoneFields)) {
            $fvalue = [];
            foreach ($phoneFields as $key) {
                foreach ($fieldValues as $k => $v) {
                    if ($key->formField == $k) {
                        $fvalue[$key->constantContactPhoneField] = $v;
                    }
                    if ($key->formField === 'custom') {
                        $fvalue[$key->constantContactPhoneField] = $key->customValue;
                    }
                }
            }
            $fvalue['kind'] = $phoneType;
            $finalData['phone_numbers'] = [$fvalue];
        }

        $apiResponse = $this->addContact(
            $listIds,
            $tagIds,
            $source_type,
            $finalData
        );

        if (isset($apiResponse->error_key) || (gettype($apiResponse) === 'array' && $apiResponse[0]->error_key)) {
            LogHandler::save($this->_integrationID, json_encode(['source_type' => 'contact', 'type_name' => 'add-contact']), 'error', json_encode($apiResponse));
        } else {
            if (isset($apiResponse->contact_id)) {
                LogHandler::save($this->_integrationID, json_encode(['source_type' => 'contact', 'type_name' => 'add-contact']), 'success', json_encode($apiResponse));
            } else {
                LogHandler::save($this->_integrationID, json_encode(['source_type' => 'contact', 'type_name' => 'update-contact']), 'success', json_encode($apiResponse));
            }
        }
        return $apiResponse;
    }
}
