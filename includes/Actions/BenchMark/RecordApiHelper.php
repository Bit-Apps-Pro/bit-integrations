<?php

/**
 * Benchmark Record Api
 */

namespace BitCode\FI\Actions\BenchMark;

use BitCode\FI\Core\Util\HttpHelper;
use BitCode\FI\Log\LogHandler;

/**
 * Provide functionality for Record insert,update, exist
 */
class RecordApiHelper
{
    private $_defaultHeader;
    private $_integrationID;


    public function __construct($api_secret, $integId)
    {
        $this->_defaultHeader = $api_secret;
        $this->_integrationID = $integId;
    }

    // for adding a contact to a list.
    public function storeOrModifyRecord($method, $listId, $data)
    {
        $apiEndpoint = "https://clientapi.benchmarkemail.com/Contact/{$listId}/ContactDetails";

        $headers = [
            'AuthToken' => $this->_defaultHeader,
            'Content-Type' => 'application/json'
            ];

        $body = '{
            "Data" : {
                "Email"         : "'. (isset($data->email)            ? $data->email            : '') . '",
                "FirstName"     : "'. (isset($data->firstname)        ? $data->firstname        : '')  . '",
                "MiddleName"    : "'. (isset($data->middlename)       ? $data->middlename       : '')  . '",
                "LastName"      : "'. (isset($data->lastname)         ? $data->lastname         : '')  . '",
                "Field1"        : "'. (isset($data->address)          ? $data->address          : '')  . '",
                "Field2"        : "'. (isset($data->city)             ? $data->city             : '')  . '",
                "Field3"        : "'. (isset($data->state)            ? $data->state            : '')  . '",
                "Field4"        : "'. (isset($data->zip)              ? $data->zip              : '')  . '",
                "Field5"        : "'. (isset($data->country)          ? $data->country          : '')  . '",
                "Field6"        : "'. (isset($data->phone)            ? $data->phone            : '')  . '",
                "Field7"        : "'. (isset($data->fax)              ? $data->fax              : '')  . '",
                "Field8"        : "'. (isset($data->cell_phone)       ? $data->cell_phone       : '')  . '",
                "Field9"        : "'. (isset($data->company_name)     ? $data->company_name     : '')  . '",
                "Field10"       : "'. (isset($data->job_title)        ? $data->job_title        : '')  . '",
                "Field11"       : "'. (isset($data->business_phone)   ? $data->business_phone   : '')  . '",
                "Field12"       : "'. (isset($data->business_fax)     ? $data->business_fax     : '')  . '",
                "Field13"       : "'. (isset($data->business_address) ? $data->business_address : '')  . '",
                "Field14"       : "'. (isset($data->business_city)    ? $data->business_city    : '')  . '",
                "Field15"       : "'. (isset($data->business_state)   ? $data->business_state   : '')  . '",
                "Field16"       : "'. (isset($data->business_zip)     ? $data->business_zip     : '')  . '",
                "Field17"       : "'. (isset($data->business_country) ? $data->business_country : '')  . '",
                "Field18"       : "'. (isset($data->notes)            ? $data->notes            : '')  . '",
                "Field19"       : "'. (isset($data->date_1)           ? $data->date_1           : '')  . '",
                "Field20"       : "'. (isset($data->date_2)           ? $data->date_2           : '')  . '",
                "Field21"       : "'. (isset($data->extra_3)          ? $data->extra_3          : '')  . '",
                "Field22"       : "'. (isset($data->extra_4)          ? $data->extra_4          : '')  . '",
                "Field23"       : "'. (isset($data->extra_5)          ? $data->extra_5          : '')  . '",
                "Field24"       : "'. (isset($data->extra_6)          ? $data->extra_6          : '')  . '",

                "EmailPerm"     : "1"
            }
        }';

        return  HttpHelper::post($apiEndpoint, $body, $headers);
    }

    //for updating contacts data through email id.
    public function updateRecord($data, $existContact)
    {
        $id = $existContact->Response->Data[0]->ID;
        $listId = $existContact->Response->Data[0]->ContactMasterID;

        $headers = [
            'AuthToken' => $this->_defaultHeader,
            'Content-Type' => 'application/json'
            ];

        $body = '{
                "Data" : {
                    "Email"         : "'. (isset($data->email)            ? $data->email            : '') . '",
                    "FirstName"     : "'. (isset($data->firstname)        ? $data->firstname        : '')  . '",
                    "MiddleName"    : "'. (isset($data->middlename)       ? $data->middlename       : '')  . '",
                    "LastName"      : "'. (isset($data->lastname)         ? $data->lastname         : '')  . '",
                    "Field1"        : "'. (isset($data->address)          ? $data->address          : '')  . '",
                    "Field2"        : "'. (isset($data->city)             ? $data->city             : '')  . '",
                    "Field3"        : "'. (isset($data->state)            ? $data->state            : '')  . '",
                    "Field4"        : "'. (isset($data->zip)              ? $data->zip              : '')  . '",
                    "Field5"        : "'. (isset($data->country)          ? $data->country          : '')  . '",
                    "Field6"        : "'. (isset($data->phone)            ? $data->phone            : '')  . '",
                    "Field7"        : "'. (isset($data->fax)              ? $data->fax              : '')  . '",
                    "Field8"        : "'. (isset($data->cell_phone)       ? $data->cell_phone       : '')  . '",
                    "Field9"        : "'. (isset($data->company_name)     ? $data->company_name     : '')  . '",
                    "Field10"       : "'. (isset($data->job_title)        ? $data->job_title        : '')  . '",
                    "Field11"       : "'. (isset($data->business_phone)   ? $data->business_phone   : '')  . '",
                    "Field12"       : "'. (isset($data->business_fax)     ? $data->business_fax     : '')  . '",
                    "Field13"       : "'. (isset($data->business_address) ? $data->business_address : '')  . '",
                    "Field14"       : "'. (isset($data->business_city)    ? $data->business_city    : '')  . '",
                    "Field15"       : "'. (isset($data->business_state)   ? $data->business_state   : '')  . '",
                    "Field16"       : "'. (isset($data->business_zip)     ? $data->business_zip     : '')  . '",
                    "Field17"       : "'. (isset($data->business_country) ? $data->business_country : '')  . '",
                    "Field18"       : "'. (isset($data->notes)            ? $data->notes            : '')  . '",
                    "Field19"       : "'. (isset($data->date_1)           ? $data->date_1           : '')  . '",
                    "Field20"       : "'. (isset($data->date_2)           ? $data->date_2           : '')  . '",
                    "Field21"       : "'. (isset($data->extra_3)          ? $data->extra_3          : '')  . '",
                    "Field22"       : "'. (isset($data->extra_4)          ? $data->extra_4          : '')  . '",
                    "Field23"       : "'. (isset($data->extra_5)          ? $data->extra_5          : '')  . '",
                    "Field24"       : "'. (isset($data->extra_6)          ? $data->extra_6          : '')  . '",

                    "EmailPerm"     : "1"
                }
            }';

        $updateRecordEndpoint = "https://clientapi.benchmarkemail.com/Contact/{$listId}/ContactDetails/{$id}";

        return  HttpHelper::request($updateRecordEndpoint, 'PATCH', $body, $headers);
    }

    //Check if a contact exists through email.
    private function existContact($email)
    {
        $queries = http_build_query([
            'Search' => $email,
        ]);

        $apiEndpoint = "https://clientapi.benchmarkemail.com/Contact/ContactDetails?".$queries;

        $authorizationHeader['AuthToken'] = $this->_defaultHeader;
        return HttpHelper::get($apiEndpoint, null, $authorizationHeader);
    }


    public function execute($fieldValues, $fieldMap, $actions, $listId)
    {
        $fieldData = [];
        $customFields = [];

        foreach ($fieldMap as $fieldKey => $fieldPair) {
            if (!empty($fieldPair->benchMarkField)) {
                if ($fieldPair->formField === 'custom' && isset($fieldPair->customValue) && !is_numeric($fieldPair->benchMarkField)) {
                    $fieldData[$fieldPair->benchMarkField] = $fieldPair->customValue;
                } elseif (is_numeric($fieldPair->benchMarkField) && $fieldPair->formField === 'custom' && isset($fieldPair->customValue)) {
                    array_push($customFields, ['field' => (int) $fieldPair->benchMarkField, 'value' => $fieldPair->customValue]);
                } elseif (is_numeric($fieldPair->benchMarkField)) {
                    array_push($customFields, ['field' => (int) $fieldPair->benchMarkField, 'value' => $fieldValues[$fieldPair->formField]]);
                } else {
                    $fieldData[$fieldPair->benchMarkField] = $fieldValues[$fieldPair->formField];
                }
            }
        }

        if (!empty($customFields)) {
            $fieldData['fieldValues'] = $customFields;
        }
        $benchMark = (object) $fieldData;

        $existContact = $this->existContact($benchMark->email);

        if (($existContact->Response->Count == 0) || ($existContact->Response->Count == null)) {
            $recordApiResponse = $this->storeOrModifyRecord('Contact', $listId, $benchMark);
            
            $type = 'insert';
        } else {
            if ($actions->update == 'true') {
                $this->updateRecord($benchMark, $existContact);
                $type = 'update';
            } else {
                LogHandler::save($this->_integrationID, ['type' => 'record', 'type_name' => 'insert'], 'error', 'Email address already exists in the system');

                wp_send_json_error(
                    __(
                        $this->_errorMessage,
                        'bit-integrations'
                    ),
                    400
                );
            }
        }

        if (($recordApiResponse && isset($recordApiResponse->errors)) || isset($this->_errorMessage)) {
            LogHandler::save($this->_integrationID, ['type' => 'record', 'type_name' => $type], 'error', $recordApiResponse->errors);
        } else {
            LogHandler::save($this->_integrationID, ['type' => 'record', 'type_name' => $type], 'success', $recordApiResponse);
        }
        return $recordApiResponse;
    }
}
