<?php

/**
 * MailChimp Record Api
 */

namespace BitCode\FI\Actions\MailChimp;

use BitCode\FI\Log\LogHandler;
use BitCode\FI\Core\Util\HttpHelper;

/**
 * Provide functionality for Record insert,upsert
 */
class RecordApiHelper
{
    private $_defaultHeader;
    private $_tokenDetails;
    private $_integrationID;

    public function __construct($tokenDetails, $integId)
    {
        $this->_defaultHeader['Authorization'] = "Bearer {$tokenDetails->access_token}";
        $this->_defaultHeader['Content-Type'] = "application/json";
        $this->_tokenDetails = $tokenDetails;
        $this->_integrationID = $integId;
    }
    private function _apiEndPoint()
    {
        return "https://{$this->_tokenDetails->dc}.api.mailchimp.com/3.0";
    }

    public function insertRecord($listId, $data)
    {
        $insertRecordEndpoint = $this->_apiEndPoint() . "/lists/{$listId}/members";
        return HttpHelper::post($insertRecordEndpoint, $data, $this->_defaultHeader);
    }

    public function updateRecord($listId, $contactId, $data)
    {
        $updateRecordEndpoint = $this->_apiEndPoint() . "/lists/{$listId}/members/{$contactId}";
        return HttpHelper::request($updateRecordEndpoint, 'PUT', $data, $this->_defaultHeader);
    }

    public function existContact($listId, $queryParam)
    {
        $existSearchEnpoint = $this->_apiEndPoint() . "/search-members?query={$queryParam}&list_id={$listId}";
        return HttpHelper::get($existSearchEnpoint, null, $this->_defaultHeader);
    }

    public function execute($listId, $tags, $defaultConf, $fieldValues, $fieldMap, $actions, $addressFields)
    {
        $fieldData = [];
        $mergeFields = [];
        foreach ($fieldMap as $fieldKey => $fieldPair) {
            if (!empty($fieldPair->mailChimpField)) {
                if ($fieldPair->mailChimpField === 'email_address') {
                    $fieldData['email_address'] = $fieldValues[$fieldPair->formField];
                } elseif ($fieldPair->mailChimpField === 'BIRTHDAY') {
                    $date = $fieldValues[$fieldPair->formField];
                    $mergeFields[$fieldPair->mailChimpField] = date("m/d", strtotime($date));
                } elseif ($fieldPair->formField === 'custom' && isset($fieldPair->customValue)) {
                    $mergeFields[$fieldPair->mailChimpField] = $fieldPair->customValue;
                } else {
                    $mergeFields[$fieldPair->mailChimpField] = $fieldValues[$fieldPair->formField];
                }
            }
        }

        $doubleOptIn = !empty($actions->double_opt_in) && $actions->double_opt_in ? true : false;

        $fieldData['merge_fields']  = (object) $mergeFields;
        // $fieldData['email_type']    = 'text';
        $fieldData['tags']          = !empty($tags) ? $tags : [];
        $fieldData['status']        = $doubleOptIn ? 'pending' : 'subscribed';
        $fieldData['double_optin']  = $doubleOptIn;
        if (!empty($actions->address)) {
            $fvalue = [];
            foreach ($addressFields as $key) {
                foreach ($fieldValues as $k => $v) {
                    if ($key->formField == $k) {
                        $fvalue[$key->mailChimpAddressField] =  $v;
                    }
                }
            }
            $fieldData['merge_fields']->ADDRESS = (object) $fvalue;
        }

        $recordApiResponse = $this->insertRecord($listId, wp_json_encode($fieldData));
        $type = 'insert';
        if (!empty($actions->update) && !empty($recordApiResponse->title) && $recordApiResponse->title === 'Member Exists') {
            $contactEmail = $fieldData['email_address'];
            $foundContact = $this->existContact($listId, $contactEmail);
            if (count($foundContact->exact_matches->members)) {
                $contactId = $foundContact->exact_matches->members[0]->id;
                $recordApiResponse = $this->updateRecord($listId, $contactId, wp_json_encode($fieldData));
                $type = 'update';
            }
        }
        if ($recordApiResponse->status === 400) {
            LogHandler::save($this->_integrationID, ['type' =>  'record', 'type_name' => $type], 'error', $recordApiResponse);
        } else {
            LogHandler::save($this->_integrationID, ['type' =>  'record', 'type_name' => $type], 'success', $recordApiResponse->id);
        }

        return $recordApiResponse;
    }
}
