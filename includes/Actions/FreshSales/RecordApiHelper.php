<?php

/**
 * FreshSales    Record Api
 */

namespace BitCode\FI\Actions\FreshSales;

use BitCode\FI\Core\Util\Common;
use BitCode\FI\Core\Util\HttpHelper;
use BitCode\FI\Log\LogHandler;

/**
 * Provide functionality for Record insert, upsert
 */
class RecordApiHelper
{
    private $_integrationDetails;

    private $_integrationID;

    private $_defaultHeader;

    private $baseUrl;

    public function __construct($integrationDetails, $integId)
    {
        $this->_integrationDetails = $integrationDetails;
        $this->_integrationID = $integId;
        $this->baseUrl = $this->_integrationDetails->bundle_alias;
        $this->_defaultHeader = [
            'Content-Type'  => 'application/json',
            'Authorization' => 'Token token=' . $this->_integrationDetails->api_key
        ];
    }

    public function insertRecord(
        $module,
        $finalData
    ) {
        if ($module === 'contact') {
            $finalData['sales_accounts'] = [(object) ['id' => $this->_integrationDetails->moduleData->account_id, 'is_primary' => true]];
        }

        if ($module === 'deal') {
            $finalData['contacts_added_list'] = [$this->_integrationDetails->moduleData->contact_id];
        }

        if ($module === 'account') {
            $module = 'sales_account';
        }

        if ($module === 'product') {
            $apiEndpoints = 'https://' . $this->baseUrl . '/api/cpq/' . $module . 's';
        } else {
            $apiEndpoints = 'https://' . $this->baseUrl . '/api/' . $module . 's';
        }

        $actions = $this->_integrationDetails->actions;
        $body = wp_json_encode([$module => $finalData]);

        return HttpHelper::post($apiEndpoints, $body, $this->_defaultHeader);
    }

    public function upsertRecord($module, $finalData)
    {
        if ($module === 'contact') {
            $finalData['sales_accounts'] = [(object) ['id' => $this->_integrationDetails->moduleData->account_id, 'is_primary' => true]];
            $identifier = (object) ['emails' => $finalData['emails']];
        }

        if ($module === 'deal') {
            $finalData['contacts_added_list'] = [$this->_integrationDetails->moduleData->contact_id];
            $identifier = (object) ['emails' => $finalData['emails']];
        }

        if ($module === 'account') {
            $module = 'sales_account';
            $identifier = (object) ['name' => $finalData['name']];
        }

        $apiEndpoints = 'https://' . $this->baseUrl . '/api/' . $module . 's/upsert';
        $body = wp_json_encode(['unique_identifier' => $identifier, 'contact' => $finalData]);

        return HttpHelper::post($apiEndpoints, $body, $this->_defaultHeader);
    }

    public function addRelatedList($freshSalesApiResponse, $integrationDetails, $fieldValues, $parentModule)
    {
        $parendId = $freshSalesApiResponse->data->id;

        foreach ($integrationDetails->relatedlists as $item) {
            $fieldMap = $item->field_map;
            $module = strtolower($item->module);
            $moduleData = $item->moduleData;
            $actions = $item->actions;
            $finalData = $this->generateReqDataFromFieldMap($fieldValues, $fieldMap);
            if (isset($moduleData->activities_type) && !empty($moduleData->activities_type)) {
                $finalData['type'] = $moduleData->activities_type;
            }
            if (isset($actions->busy_flag) && !empty($actions->busy_flag)) {
                $finalData['busy_flag'] = true;
            }
            if (isset($actions->active_flag) && !empty($actions->active_flag)) {
                $finalData['active_flag'] = 0;
            }
            if (isset($actions->activities_participants) && !empty($actions->activities_participants)) {
                $participants = explode(',', $moduleData->activities_participants);
                $allParticipants = [];
                foreach ($participants as $participant) {
                    $allParticipants[] = (object) [
                        'contact_id'   => (int) $participant,
                        'primary_flag' => false
                    ];
                }
                $finalData['participants'] = $allParticipants;
            }
            $apiEndpoints = $this->baseUrl . $module . '?api_token=' . $this->_integrationDetails->api_key;

            if ($parentModule === 'leads') {
                $finalData['lead_id'] = $parendId;
            } else {
                $finalData['deal_id'] = (int) $parendId;
            }

            return HttpHelper::post($apiEndpoints, wp_json_encode($finalData), $this->_defaultHeader);
        }
    }

    public function generateReqDataFromFieldMap($data, $fieldMap)
    {
        $dataFinal = [];
        $customFields = [];

        foreach ($fieldMap as $key => $value) {
            $triggerValue = $value->formField;
            $actionValue = $value->freshSalesFormField;
            if (strpos($actionValue, 'cf_') === 0) {
                $customFields[$actionValue] = $data[$triggerValue];
            } elseif (strpos($actionValue, 'cf_') === 0 && $triggerValue === 'custom') {
                $customFields[$actionValue] = Common::replaceFieldWithValue($value->customValue, $data);
            } elseif ($triggerValue === 'custom') {
                $dataFinal[$actionValue] = Common::replaceFieldWithValue($value->customValue, $data);
            } elseif (!\is_null($data[$triggerValue])) {
                $dataFinal[$actionValue] = $data[$triggerValue];
            }
        }

        if (!empty($customFields)) {
            $dataFinal['custom_field'] = $customFields;
        }

        return $dataFinal;
    }

    public function execute(
        $fieldValues,
        $fieldMap,
        $module,
        $actions
    ) {
        $finalData = $this->generateReqDataFromFieldMap($fieldValues, $fieldMap);
        if (isset($actions->upsert) && $actions->upsert && $module === 'contact') {
            $apiResponse = $this->upsertRecord($module, $finalData);
        } else {
            $apiResponse = $this->insertRecord($module, $finalData);
        }

        if (isset($apiResponse->errors)) {
            LogHandler::save($this->_integrationID, wp_json_encode(['type' => $module, 'type_name' => 'add-' . $module]), 'error', wp_json_encode($apiResponse));
        } else {
            LogHandler::save($this->_integrationID, wp_json_encode(['type' => $module, 'type_name' => 'add-' . $module]), 'success', wp_json_encode($apiResponse));
        }

        return $apiResponse;
    }
}
