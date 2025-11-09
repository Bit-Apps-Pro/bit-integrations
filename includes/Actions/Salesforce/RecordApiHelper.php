<?php

namespace BitCode\FI\Actions\Salesforce;

use BitCode\FI\Core\Util\Common;
use BitCode\FI\Core\Util\HttpHelper;
use BitCode\FI\Log\LogHandler;

/**
 * Provide functionality for Record insert,upsert
 */
class RecordApiHelper
{
    private $_defaultHeader;

    private $_apiDomain;

    private $_integrationID;

    public function __construct($tokenDetails, $_integrationID)
    {
        $this->_defaultHeader['Authorization'] = "Bearer {$tokenDetails->access_token}";
        $this->_defaultHeader['Content-Type'] = 'application/json';
        $this->_apiDomain = $tokenDetails->instance_url;
        $this->_integrationID = $_integrationID;
    }

    public function generateReqDataFromFieldMap($data, $fieldMap)
    {
        $dataFinal = [];
        foreach ($fieldMap as $key => $value) {
            $triggerValue = $value->formField;
            $actionValue = $value->selesforceField;
            if ($triggerValue === 'custom') {
                $dataFinal[$actionValue] = Common::replaceFieldWithValue($value->customValue, $data);
            } elseif (!\is_null($data[$triggerValue])) {
                $dataFinal[$actionValue] = $data[$triggerValue];
            }
        }

        return $dataFinal;
    }

    public function insertContact($finalData, $update = false)
    {
        $apiEndpoint = $this->_apiDomain . '/services/data/v37.0/sobjects/Contact';

        $response = HttpHelper::post($apiEndpoint, wp_json_encode($finalData), $this->_defaultHeader);

        $duplicateRecordId = isset($response[0]->duplicateResult->matchResults[0]->matchRecords[0]->record->Id)
        ? $response[0]->duplicateResult->matchResults[0]->matchRecords[0]->record->Id
        : null;

        if (!$update || !$duplicateRecordId) {
            return $response;
        }

        $apiEndpoint = $apiEndpoint . '/' . $duplicateRecordId;

        return apply_filters('btcbi_salesforce_update_record', $response, $apiEndpoint, $finalData, $this->_defaultHeader);
    }

    public function insertRecord($finalData, $action)
    {
        $apiEndpoint = $this->_apiDomain . '/services/data/v37.0/sobjects/' . $action;

        return HttpHelper::post($apiEndpoint, wp_json_encode($finalData), $this->_defaultHeader);
    }

    public function insertLead($finalData)
    {
        $apiEndpoint = $this->_apiDomain . '/services/data/v37.0/sobjects/Lead';

        return HttpHelper::post($apiEndpoint, wp_json_encode($finalData), $this->_defaultHeader);
    }

    public function createAccount($finalData)
    {
        $apiEndpoint = $this->_apiDomain . '/services/data/v37.0/sobjects/Account';

        return HttpHelper::post($apiEndpoint, wp_json_encode($finalData), $this->_defaultHeader);
    }

    public function createCampaign($finalData)
    {
        $apiEndpoint = $this->_apiDomain . '/services/data/v37.0/sobjects/Campaign';

        return HttpHelper::post($apiEndpoint, wp_json_encode($finalData), $this->_defaultHeader);
    }

    public function insertCampaignMember($campaignId, $leadId, $contactId, $statusId)
    {
        $apiEndpoint = $this->_apiDomain . '/services/data/v37.0/sobjects/CampaignMember';
        $finalData = [
            'CampaignId' => $campaignId,
            'LeadId'     => $leadId,
            'ContactId'  => $contactId,
            'Status'     => $statusId
        ];

        return HttpHelper::post($apiEndpoint, wp_json_encode($finalData), $this->_defaultHeader);
    }

    public function createTask($contactId, $accountId, $subjectId, $priorityId, $statusId)
    {
        $apiEndpoint = $this->_apiDomain . '/services/data/v37.0/sobjects/Task';
        $finalData = [
            'Subject'  => $subjectId,
            'Priority' => $priorityId,
            'WhoId'    => $contactId,
            'WhatId'   => $accountId,
            'Status'   => $statusId
        ];

        return HttpHelper::post($apiEndpoint, wp_json_encode($finalData), $this->_defaultHeader);
    }

    public function createOpportunity($finalData, $opportunityTypeId, $opportunityStageId, $opportunityLeadSourceId, $accountId, $campaignId)
    {
        $apiEndpoint = $this->_apiDomain . '/services/data/v37.0/sobjects/Opportunity';
        $finalData['AccountId'] = $accountId;
        $finalData['CampaignId'] = $campaignId;
        $finalData['Type'] = $opportunityTypeId;
        $finalData['StageName'] = $opportunityStageId;
        $finalData['LeadSource'] = $opportunityLeadSourceId;

        return HttpHelper::post($apiEndpoint, wp_json_encode($finalData), $this->_defaultHeader);
    }

    public function createEvent($finalData, $contactId, $accountId, $eventSubjectId)
    {
        $apiEndpoint = $this->_apiDomain . '/services/data/v37.0/sobjects/Event';
        $finalData['WhoId'] = $contactId;
        $finalData['WhatId'] = $accountId;
        $finalData['Subject'] = $eventSubjectId;

        return HttpHelper::post($apiEndpoint, wp_json_encode($finalData), $this->_defaultHeader);
    }

    public function createCase($finalData, $actionsData)
    {
        $apiEndpoint = $this->_apiDomain . '/services/data/v37.0/sobjects/Case';

        foreach ($actionsData as $key => $value) {
            if (!empty($value)) {
                $finalData[$key] = $value;
            }
        }

        return HttpHelper::post($apiEndpoint, wp_json_encode($finalData), $this->_defaultHeader);
    }

    public function execute($integrationDetails, $fieldValues, $fieldMap, $actions)
    {
        $actionName = $integrationDetails->actionName;
        $update = isset($actions->update) ? $actions->update : false;

        if ($actionName === 'contact-create') {
            $finalData = $this->generateReqDataFromFieldMap($fieldValues, $fieldMap);
            $response = $this->insertContact($finalData, $update);

            $responseType = empty($response) || isset($response->id) ? 'success' : 'error';
            $typeName = !$update || isset($response->id) ? 'Contact-create' : 'Contact-update';
            $message = $responseType === 'success' ? wp_json_encode(wp_sprintf(__('Created contact id is : %s', 'bit-integrations'), $response->id)) : wp_json_encode($response);

            if ($responseType === 'success' && $update) {
                $message = __('Contact Updated Successfully', 'bit-integrations');
            }

            LogHandler::save($this->_integrationID, wp_json_encode(['type' => 'Contact', 'type_name' => $typeName]), $responseType, $message);
        } elseif ($actionName === 'lead-create') {
            $finalData = $this->generateReqDataFromFieldMap($fieldValues, $fieldMap);

            $finalData = apply_filters('btcbi_salesforce_add_lead_utilities', $finalData, $actions);

            $insertLeadResponse = $this->insertLead($finalData);

            if (\is_object($insertLeadResponse) && property_exists($insertLeadResponse, 'id')) {
                LogHandler::save($this->_integrationID, wp_json_encode(['type' => $actionName, 'type_name' => 'Lead-create']), 'success', wp_json_encode(wp_sprintf(__('Created lead id is : %s', 'bit-integrations'), $insertLeadResponse->id)));
            } else {
                LogHandler::save($this->_integrationID, wp_json_encode(['type' => 'Lead', 'type_name' => 'Lead-create']), 'error', wp_json_encode($insertLeadResponse));
            }
        } elseif ($actionName === 'account-create') {
            $finalData = $this->generateReqDataFromFieldMap($fieldValues, $fieldMap);

            if (!empty($actions->selectedAccType)) {
                $finalData['Type'] = $actions->selectedAccType;
            }
            if (!empty($actions->selectedOwnership)) {
                $finalData['Ownership'] = $actions->selectedOwnership;
            }

            $createAccountResponse = $this->createAccount($finalData);

            if (\is_object($createAccountResponse) && property_exists($createAccountResponse, 'id')) {
                LogHandler::save($this->_integrationID, wp_json_encode(['type' => 'Account', 'type_name' => 'Account-create']), 'success', wp_json_encode(wp_sprintf(__('Created account id is : %s', 'bit-integrations'), $createAccountResponse->id)));
            } else {
                LogHandler::save($this->_integrationID, wp_json_encode(['type' => 'Account', 'type_name' => 'Account-create']), 'error', wp_json_encode($createAccountResponse));
            }
        } elseif ($actionName === 'campaign-create') {
            $finalData = $this->generateReqDataFromFieldMap($fieldValues, $fieldMap);
            $insertCampaignResponse = $this->createCampaign($finalData);
            if (\is_object($insertCampaignResponse) && property_exists($insertCampaignResponse, 'id')) {
                LogHandler::save($this->_integrationID, wp_json_encode(['type' => 'Campaign', 'type_name' => 'Campaign-create']), 'success', wp_json_encode(wp_sprintf(__('Created campaign id is : %s', 'bit-integrations'), $insertCampaignResponse->id)));
            } else {
                LogHandler::save($this->_integrationID, wp_json_encode(['type' => 'Campaign', 'type_name' => 'Campaign-create']), 'error', wp_json_encode($insertCampaignResponse));
            }
        } elseif ($actionName === 'add-campaign-member') {
            $campaignId = $integrationDetails->campaignId;
            $leadId = empty($integrationDetails->leadId) ? null : $integrationDetails->leadId;
            $contactId = empty($integrationDetails->contactId) ? null : $integrationDetails->contactId;
            $statusId = empty($integrationDetails->statusId) ? null : $integrationDetails->statusId;
            $insertCampaignMember = $this->insertCampaignMember($campaignId, $leadId, $contactId, $statusId);
            if (\is_object($insertCampaignMember) && property_exists($insertCampaignMember, 'id')) {
                LogHandler::save($this->_integrationID, wp_json_encode(['type' => 'CampaignMember', 'type_name' => 'CampaignMember-create']), 'success', wp_json_encode(wp_sprintf(__('Created campaign member id is : %s', 'bit-integrations'), $insertCampaignMember->id)));
            } else {
                LogHandler::save($this->_integrationID, wp_json_encode(['type' => 'CampaignMember', 'type_name' => 'CampaignMember-create']), 'error', wp_json_encode($insertCampaignMember));
            }
        } elseif ($actionName === 'task-create') {
            $contactId = empty($integrationDetails->contactId) ? null : $integrationDetails->contactId;
            $accountId = empty($integrationDetails->accountId) ? null : $integrationDetails->accountId;
            $subjectId = $integrationDetails->subjectId;
            $priorityId = $integrationDetails->priorityId;
            $statusId = empty($integrationDetails->statusId) ? null : $integrationDetails->statusId;
            $apiResponse = $this->createTask($contactId, $accountId, $subjectId, $priorityId, $statusId);
            if (\is_object($apiResponse) && property_exists($apiResponse, 'id')) {
                LogHandler::save($this->_integrationID, wp_json_encode(['type' => 'Task', 'type_name' => 'Task-create']), 'success', wp_json_encode(wp_sprintf(__('Created task id is : %s', 'bit-integrations'), $apiResponse->id)));
            } else {
                LogHandler::save($this->_integrationID, wp_json_encode(['type' => 'Task', 'type_name' => 'Task-create']), 'error', wp_json_encode($apiResponse));
            }
        } elseif ($actionName === 'opportunity-create') {
            $opportunityTypeId = empty($actions->opportunityTypeId) ? null : $actions->opportunityTypeId;
            $opportunityStageId = empty($actions->opportunityStageId) ? null : $actions->opportunityStageId;
            $opportunityLeadSourceId = empty($actions->opportunityLeadSourceId) ? null : $actions->opportunityLeadSourceId;
            $accountId = empty($actions->accountId) ? null : $actions->accountId;
            $campaignId = empty($actions->campaignId) ? null : $actions->campaignId;
            $finalData = $this->generateReqDataFromFieldMap($fieldValues, $fieldMap);
            $opportunityResponse = $this->createOpportunity($finalData, $opportunityTypeId, $opportunityStageId, $opportunityLeadSourceId, $accountId, $campaignId);
            if (\is_object($opportunityResponse) && property_exists($opportunityResponse, 'id')) {
                LogHandler::save($this->_integrationID, wp_json_encode(['type' => 'Opportunity', 'type_name' => 'Opportunity-create']), 'success', wp_json_encode(wp_sprintf(__('Created opportunity id is : %s', 'bit-integrations'), $opportunityResponse->id)));
            } else {
                LogHandler::save($this->_integrationID, wp_json_encode(['type' => 'Opportunity', 'type_name' => 'Opportunity-create']), 'error', wp_json_encode($opportunityResponse));
            }
        } elseif ($actionName === 'event-create') {
            $contactId = empty($actions->contactId) ? null : $actions->contactId;
            $accountId = empty($actions->accountId) ? null : $actions->accountId;
            $eventSubjectId = empty($actions->eventSubjectId) ? null : $actions->eventSubjectId;
            $finalData = $this->generateReqDataFromFieldMap($fieldValues, $fieldMap);
            $createEventResponse = $this->createEvent($finalData, $contactId, $accountId, $eventSubjectId);
            if (\is_object($createEventResponse) && property_exists($createEventResponse, 'id')) {
                LogHandler::save($this->_integrationID, wp_json_encode(['type' => 'Event', 'type_name' => 'Event-create']), 'success', wp_json_encode(wp_sprintf(__('Created event id is : %s', 'bit-integrations'), $createEventResponse->id)));
            } else {
                LogHandler::save($this->_integrationID, wp_json_encode(['type' => 'Event', 'type_name' => 'Event-create']), 'error', wp_json_encode($createEventResponse));
            }
        } elseif ($actionName === 'case-create') {
            $actionsData['ContactId'] = empty($actions->contactId) ? null : $actions->contactId;
            $actionsData['AccountId'] = empty($actions->accountId) ? null : $actions->accountId;
            $actionsData['Status'] = empty($actions->caseStatusId) ? null : $actions->caseStatusId;
            $actionsData['Origin'] = empty($actions->caseOriginId) ? null : $actions->caseOriginId;
            $actionsData['Priority'] = empty($actions->casePriorityId) ? null : $actions->casePriorityId;
            $actionsData['Reason'] = empty($actions->caseReason) ? null : $actions->caseReason;
            $actionsData['Type'] = empty($actions->caseType) ? null : $actions->caseType;
            $actionsData['PotentialLiability__c'] = empty($actions->potentialLiabilityId) ? null : $actions->potentialLiabilityId;
            $actionsData['SLAViolation__c'] = empty($actions->slaViolationId) ? null : $actions->slaViolationId;

            $finalData = $this->generateReqDataFromFieldMap($fieldValues, $fieldMap);
            $createCaseResponse = $this->createCase($finalData, $actionsData);

            if (\is_object($createCaseResponse) && property_exists($createCaseResponse, 'id')) {
                LogHandler::save($this->_integrationID, wp_json_encode(['type' => 'Case', 'type_name' => 'Case-create']), 'success', wp_json_encode(wp_sprintf(__('Created case id is : %s', 'bit-integrations'), $createCaseResponse->id)));
            } else {
                LogHandler::save($this->_integrationID, wp_json_encode(['type' => 'Case', 'type_name' => 'Case-create']), 'error', wp_json_encode($createCaseResponse));
            }
        } else {
            $finalData = $this->generateReqDataFromFieldMap($fieldValues, $fieldMap);
            $insertContactResponse = $this->insertRecord($finalData, $actionName);
            if (\is_object($insertContactResponse) && property_exists($insertContactResponse, 'id')) {
                LogHandler::save($this->_integrationID, wp_json_encode(['type' => $actionName, 'type_name' => $actionName . '-create']), 'success', wp_json_encode("{$actionName} id is : {$insertContactResponse->id}"));
            } else {
                LogHandler::save($this->_integrationID, wp_json_encode(['type' => $actionName, 'type_name' => $actionName . '-create']), 'error', wp_json_encode($insertContactResponse));
            }
        }

        return true;
    }
}
