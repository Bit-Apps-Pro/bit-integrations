<?php

/**
 * HubSpot Record Api
 */

namespace BitCode\FI\Actions\Hubspot;

use BitCode\FI\Core\Util\Common;
use BitCode\FI\Core\Util\DateTimeHelper;
use BitCode\FI\Core\Util\HttpHelper;
use BitCode\FI\Log\LogHandler;

/**
 * Provide functionality for Record insert,upsert
 */

class HubspotRecordApiHelper
{
    private $defaultHeader;

    public function __construct($accessToken)
    {
        $this->defaultHeader = [
            'Content-Type'  => 'application/json',
            'authorization' => "Bearer $accessToken"
        ];
    }

    public function insertContact($data)
    {
        $finalData['properties'] = $data;
        $apiEndpoint             = 'https://api.hubapi.com/crm/v3/objects/contacts';

        return HttpHelper::post($apiEndpoint, json_encode($finalData), $this->defaultHeader);
    }

    public function insertDeal($finalData)
    {
        foreach ($finalData['associations'] as $key => $association) {
            $associations[$key] = $association;
        }

        foreach ($finalData['properties'] as $key => $property) {
            $properties[] = (object) [
                'name'  => $key,
                'value' => $property
            ];
        }

        $data = [
            'properties'   => $properties,
            'associations' => (object) $associations
        ];

        $apiEndpoint = 'https://api.hubapi.com/deals/v1/deal';

        return HttpHelper::post($apiEndpoint, json_encode($data), $this->defaultHeader);
    }

    public function insertTicket($finalData)
    {
        $data        = json_encode(['properties' => $finalData]);
        $apiEndpoint = 'https://api.hubapi.com/crm/v3/objects/tickets';

        return HttpHelper::post($apiEndpoint, $data, $this->defaultHeader);
    }

    public function generateReqDataFromFieldMap($data, $fieldMap, $integrationDetails)
    {
        $dataFinal = [];

        foreach ($fieldMap as $value) {
            $triggerValue = $value->formField;
            $actionValue  = $value->hubspotField;
            if ($triggerValue === 'custom') {
                $dataFinal[$actionValue] = Common::replaceFieldWithValue($value->customValue, $data);
            } elseif (!is_null($data[$triggerValue])) {
                $dataFinal[$actionValue] = $data[$triggerValue];
            }
        }

        $action = $integrationDetails->actions;

        if (property_exists($action, 'lead_status')) {
            $status = $integrationDetails->lead_status;
            $dataFinal['hs_lead_status'] = $status;
        }

        if (property_exists($action, 'lifecycle_stage')) {
            $stage = $integrationDetails->lifecycle_stage;
            $dataFinal['lifecyclestage'] = $stage;
        }

        if (property_exists($action, 'contact_owner')) {
            $owner = $integrationDetails->contact_owner;
            $dataFinal['hubspot_owner_id'] = $owner;
        }

        return $dataFinal;
    }

    public function formatDealFieldMap($data, $fieldMap, $integrationDetails)
    {
        $dataFinal = [];

        foreach ($fieldMap as $value) {
            $triggerValue = $value->formField;
            $actionValue  = $value->hubspotField;
            if ($triggerValue === 'custom') {
                $dataFinal[$actionValue] = Common::replaceFieldWithValue($value->customValue, $data);
            } elseif (!is_null($data[$triggerValue])) {
                if (strtotime($data[$triggerValue])) {
                    $formated = strtotime($data[$triggerValue]);
                    $dataFinal[$actionValue] = $formated;
                } else {
                    $dataFinal[$actionValue] = $data[$triggerValue];
                }
            }
        }

        $pipeline = $integrationDetails->pipeline;
        $stage    = $integrationDetails->stage;
        $action   = $integrationDetails->actions;

        if (!empty($pipeline)) $dataFinal['pipeline'] = $pipeline;
        if (!empty($stage)) $dataFinal['dealstage']   = $stage;

        $dataForAssosciations = [];

        if (property_exists($action, 'contact_owner')) {
            $owner = $integrationDetails->contact_owner;
            $dataFinal['hubspot_owner_id'] = $owner;
        }

        if (property_exists($action, 'deal_type')) {
            $dealType = $integrationDetails->deal_type;
            $dataFinal['dealtype'] = $dealType;
        }

        if (property_exists($action, 'priority')) {
            $priority = $integrationDetails->priority;
            $dataFinal['hs_priority'] = $priority;
        }

        if (property_exists($action, 'company')) {
            $companyIds = explode(',', $integrationDetails->company);
            $dataForAssosciations['associatedCompanyIds'] = $companyIds;
        }

        if (property_exists($action, 'contact')) {
            $contactIds = explode(',', $integrationDetails->contact);
            $dataForAssosciations['associatedVids'] = $contactIds;
        }

        $finalData = [];
        $finalData['properties'] = $dataFinal;

        if (!empty($dataForAssosciations)) $finalData['associations'] = $dataForAssosciations;

        return $finalData;
    }

    public function formatTicketFieldMap($data, $fieldMap, $integrationDetails)
    {
        $dataFinal = [];

        foreach ($fieldMap as $value) {
            $triggerValue = $value->formField;
            $actionValue  = $value->hubspotField;
            if ($triggerValue === 'custom') {
                $dataFinal[$actionValue] = Common::replaceFieldWithValue($value->customValue, $data);
            } elseif (!is_null($data[$triggerValue])) {
                $dataFinal[$actionValue] = $data[$triggerValue];
            }
        }

        $pipeline = $integrationDetails->pipeline;
        $stage    = $integrationDetails->stage;
        $action   = $integrationDetails->actions;

        $dataFinal['hs_pipeline']       = $pipeline;
        $dataFinal['hs_pipeline_stage'] = $stage;

        if (property_exists($action, 'contact_owner')) {
            $owner = $integrationDetails->contact_owner;
            $dataFinal['hubspot_owner_id'] = $owner;
        }

        if (property_exists($action, 'priority')) {
            $priority = $integrationDetails->priority;
            if ($priority == 'low') {
                $priority = 'LOW';
            } elseif ($priority == 'medium') {
                $priority = 'MEDIUM';
            } else {
                $priority = 'HIGH';
            }
            $dataFinal['hs_ticket_priority'] = $priority;
        }

        return $dataFinal;
    }

    public function executeRecordApi($integId, $integrationDetails, $fieldValues, $fieldMap)
    {
        $actionName = $integrationDetails->actionName;
        $type       = '';
        $typeName   = '';

        if ($actionName === 'contact') {
            $finalData   = $this->generateReqDataFromFieldMap($fieldValues, $fieldMap, $integrationDetails);
            $apiResponse = $this->insertContact($finalData);
            $type        = 'contact';
            $typeName    = 'contact-add';
        } elseif ($actionName === 'deal') {
            $finalData   = $this->formatDealFieldMap($fieldValues, $fieldMap, $integrationDetails);
            $apiResponse = $this->insertDeal($finalData);
            $type        = 'deal';
            $typeName    = 'deal-add';
        } elseif ($actionName === 'ticket') {
            $finalData   = $this->formatTicketFieldMap($fieldValues, $fieldMap, $integrationDetails);
            $apiResponse = $this->insertTicket($finalData);
            $type        = 'ticket';
            $typeName    = 'ticket-add';
        }

        if (!isset($apiResponse->properties)) {
            LogHandler::save($integId, wp_json_encode(['type' => $type, 'type_name' => $typeName]), 'error', wp_json_encode($apiResponse));
        } else {
            LogHandler::save($integId, wp_json_encode(['type' => $type, 'type_name' => $typeName]), 'success', wp_json_encode($apiResponse));
        }

        return $apiResponse;
    }
}
