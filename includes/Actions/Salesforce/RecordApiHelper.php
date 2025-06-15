<?php

namespace BitCode\FI\Actions\Salesforce;

use BitCode\FI\Log\LogHandler;
use BitCode\FI\Core\Util\Common;
use BitCode\FI\Core\Util\HttpHelper;
use BitCode\FI\Core\Util\DateTimeHelper;

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
            } elseif (!is_null($data[$triggerValue])) {
                $dataFinal[$actionValue] = $data[$triggerValue];
            }
        }
        return $dataFinal;
    }

    public function insertContact($finalData)
    {
        $apiEndpoint = $this->_apiDomain . '/services/data/v37.0/sobjects/Contact';
        return HttpHelper::post($apiEndpoint, json_encode($finalData), $this->_defaultHeader);
    }

    public function insertLead($finalData)
    {
        $apiEndpoint = $this->_apiDomain . '/services/data/v37.0/sobjects/Lead';
        return HttpHelper::post($apiEndpoint, json_encode($finalData), $this->_defaultHeader);
    }

    public function createAccount($finalData)
    {
        $apiEndpoint = $this->_apiDomain . '/services/data/v37.0/sobjects/Account';
        return HttpHelper::post($apiEndpoint, json_encode($finalData), $this->_defaultHeader);
    }

    public function createCampaign($finalData)
    {
        $apiEndpoint = $this->_apiDomain . '/services/data/v37.0/sobjects/Campaign';
        return HttpHelper::post($apiEndpoint, json_encode($finalData), $this->_defaultHeader);
    }

    public function insertCampaignMember($campaignId, $leadId, $contactId, $statusId)
    {
        $apiEndpoint = $this->_apiDomain . '/services/data/v37.0/sobjects/CampaignMember';
        $finalData = [
            'CampaignId' => $campaignId,
            'LeadId' => $leadId,
            'ContactId' => $contactId,
            'Status' => $statusId
        ];
        return HttpHelper::post($apiEndpoint, json_encode($finalData), $this->_defaultHeader);
    }

    public function createTask($contactId, $accountId, $subjectId, $priorityId, $statusId)
    {
        $apiEndpoint = $this->_apiDomain . '/services/data/v37.0/sobjects/Task';
        $finalData = [
            'Subject' => $subjectId,
            'Priority' => $priorityId,
            'WhoId' => $contactId,
            'WhatId' => $accountId,
            'Status' => $statusId
        ];
        return HttpHelper::post($apiEndpoint, json_encode($finalData), $this->_defaultHeader);
    }

    public function createOpportunity($finalData, $opportunityTypeId, $opportunityStageId, $opportunityLeadSourceId, $accountId, $campaignId)
    {
        $apiEndpoint = $this->_apiDomain . '/services/data/v37.0/sobjects/Opportunity';
        $finalData['AccountId'] = $accountId;
        $finalData['CampaignId'] = $campaignId;
        $finalData['Type'] = $opportunityTypeId;
        $finalData['StageName'] = $opportunityStageId;
        $finalData['LeadSource'] = $opportunityLeadSourceId;
        return HttpHelper::post($apiEndpoint, json_encode($finalData), $this->_defaultHeader);
    }

    public function createEvent($finalData, $contactId, $accountId, $eventSubjectId)
    {
        $apiEndpoint = $this->_apiDomain . '/services/data/v37.0/sobjects/Event';
        $finalData['WhoId'] = $contactId;
        $finalData['WhatId'] = $accountId;
        $finalData['Subject'] = $eventSubjectId;
        return HttpHelper::post($apiEndpoint, json_encode($finalData), $this->_defaultHeader);
    }

    public function createCase($finalData, $contactId, $accountId, $caseStatusId, $caseOriginId, $casePriorityId, $potentialLiabilityId, $slaViolationId)
    {
        $apiEndpoint = $this->_apiDomain . '/services/data/v37.0/sobjects/Case';
        $finalData['ContactId'] = $contactId;
        $finalData['AccountId'] = $accountId;
        $finalData['Status'] = $caseStatusId;
        $finalData['Origin'] = $caseOriginId;
        $finalData['Priority'] = $casePriorityId;
        $finalData['PotentialLiability__c'] = $potentialLiabilityId;
        $finalData['SLAViolation__c'] = $slaViolationId;
        return HttpHelper::post($apiEndpoint, json_encode($finalData), $this->_defaultHeader);
    }

    public function execute(
        $integrationDetails,
        $fieldValues,
        $fieldMap,
        $actions,
        $tokenDetails
    ) {
        $actionName = $integrationDetails->actionName;
        if ($actionName === 'contact-create') {
            $finalData = $this->generateReqDataFromFieldMap($fieldValues, $fieldMap);
            $insertContactResponse = $this->insertContact($finalData);
            if (is_object($insertContactResponse) && property_exists($insertContactResponse, 'id')) {
                LogHandler::save($this->_integrationID, wp_json_encode(['type' => $actionName, 'type_name' => 'Contact-create']), 'success', wp_json_encode("Created contact id is : $insertContactResponse->id"));
            } else {
                LogHandler::save($this->_integrationID, wp_json_encode(['type' => 'Contact', 'type_name' => 'Contact-create']), 'error', wp_json_encode($insertContactResponse));
            }
        }
        if ($actionName === 'lead-create') {
            $finalData = $this->generateReqDataFromFieldMap($fieldValues, $fieldMap);
            $insertLeadResponse = $this->insertLead($finalData);
            if (is_object($insertLeadResponse) && property_exists($insertLeadResponse, 'id')) {
                LogHandler::save($this->_integrationID, wp_json_encode(['type' => $actionName, 'type_name' => 'Lead-create']), 'success', wp_json_encode("Created lead id is : $insertLeadResponse->id"));
            } else {
                LogHandler::save($this->_integrationID, wp_json_encode(['type' => 'Lead', 'type_name' => 'Lead-create']), 'error', wp_json_encode($insertLeadResponse));
            }
        }
        if ($actionName === 'account-create') {
            $finalData = $this->generateReqDataFromFieldMap($fieldValues, $fieldMap);

            if (!empty($integrationDetails->actions->selectedAccType)) {
                $finalData['Type'] = $integrationDetails->actions->selectedAccType;
            }
            if (!empty($integrationDetails->actions->selectedOwnership)) {
                $finalData['Ownership'] = $integrationDetails->actions->selectedOwnership;
            }

            $createAccountResponse = $this->createAccount($finalData);
            if (is_object($createAccountResponse) && property_exists($createAccountResponse, 'id')) {
                LogHandler::save($this->_integrationID, wp_json_encode(['type' => 'Account', 'type_name' => 'Account-create']), 'success', wp_json_encode("Created account id is : $createAccountResponse->id"));
            } else {
                LogHandler::save($this->_integrationID, wp_json_encode(['type' => 'Account', 'type_name' => 'Account-create']), 'error', wp_json_encode($createAccountResponse));
            }
        }
        if ($actionName === 'campaign-create') {
            $finalData = $this->generateReqDataFromFieldMap($fieldValues, $fieldMap);
            $insertCampaignResponse = $this->createCampaign($finalData);
            if (is_object($insertCampaignResponse) && property_exists($insertCampaignResponse, 'id')) {
                LogHandler::save($this->_integrationID, wp_json_encode(['type' => 'Campaign', 'type_name' => 'Campaign-create']), 'success', wp_json_encode("Created campaign id is : $insertCampaignResponse->id"));
            } else {
                LogHandler::save($this->_integrationID, wp_json_encode(['type' => 'Campaign', 'type_name' => 'Campaign-create']), 'error', wp_json_encode($insertCampaignResponse));
            }
        }
        if ($actionName === 'add-campaign-member') {
            $campaignId = $integrationDetails->campaignId;
            $leadId = empty($integrationDetails->leadId) ? null : $integrationDetails->leadId;
            $contactId = empty($integrationDetails->contactId) ? null : $integrationDetails->contactId;
            $statusId = empty($integrationDetails->statusId) ? null : $integrationDetails->statusId;
            $insertCampaignMember = $this->insertCampaignMember($campaignId, $leadId, $contactId, $statusId);
            if (is_object($insertCampaignMember) && property_exists($insertCampaignMember, 'id')) {
                LogHandler::save($this->_integrationID, wp_json_encode(['type' => 'CampaignMember', 'type_name' => 'CampaignMember-create']), 'success', wp_json_encode("Created campaign member id is : $insertCampaignMember->id"));
            } else {
                LogHandler::save($this->_integrationID, wp_json_encode(['type' => 'CampaignMember', 'type_name' => 'CampaignMember-create']), 'error', wp_json_encode($insertCampaignMember));
            }
        }
        if ($actionName === 'task-create') {
            $contactId = empty($integrationDetails->contactId) ? null : $integrationDetails->contactId;
            $accountId = empty($integrationDetails->accountId) ? null : $integrationDetails->accountId;
            $subjectId = $integrationDetails->subjectId;
            $priorityId = $integrationDetails->priorityId;
            $statusId = empty($integrationDetails->statusId) ? null : $integrationDetails->statusId;
            $apiResponse = $this->createTask($contactId, $accountId, $subjectId, $priorityId, $statusId);
            if (is_object($apiResponse) && property_exists($apiResponse, 'id')) {
                LogHandler::save($this->_integrationID, wp_json_encode(['type' => 'Task', 'type_name' => 'Task-create']), 'success', wp_json_encode("Created task id is : $apiResponse->id"));
            } else {
                LogHandler::save($this->_integrationID, wp_json_encode(['type' => 'Task', 'type_name' => 'Task-create']), 'error', wp_json_encode($apiResponse));
            }
        }
        if ($actionName === 'opportunity-create') {
            $opportunityTypeId = empty($integrationDetails->actions->opportunityTypeId) ? null : $integrationDetails->actions->opportunityTypeId;
            $opportunityStageId = empty($integrationDetails->actions->opportunityStageId) ? null : $integrationDetails->actions->opportunityStageId;
            $opportunityLeadSourceId = empty($integrationDetails->actions->opportunityLeadSourceId) ? null : $integrationDetails->actions->opportunityLeadSourceId;
            $accountId = empty($integrationDetails->actions->accountId) ? null : $integrationDetails->actions->accountId;
            $campaignId = empty($integrationDetails->actions->campaignId) ? null : $integrationDetails->actions->campaignId;
            $finalData = $this->generateReqDataFromFieldMap($fieldValues, $fieldMap);
            $opportunityResponse = $this->createOpportunity($finalData, $opportunityTypeId, $opportunityStageId, $opportunityLeadSourceId, $accountId, $campaignId);
            if (is_object($opportunityResponse) && property_exists($opportunityResponse, 'id')) {
                LogHandler::save($this->_integrationID, wp_json_encode(['type' => 'Opportunity', 'type_name' => 'Opportunity-create']), 'success', wp_json_encode("Created opportunity id is : $opportunityResponse->id"));
            } else {
                LogHandler::save($this->_integrationID, wp_json_encode(['type' => 'Opportunity', 'type_name' => 'Opportunity-create']), 'error', wp_json_encode($opportunityResponse));
            }
        }
        if ($actionName === 'event-create') {
            $contactId = empty($integrationDetails->actions->contactId) ? null : $integrationDetails->actions->contactId;
            $accountId = empty($integrationDetails->actions->accountId) ? null : $integrationDetails->actions->accountId;
            $eventSubjectId = empty($integrationDetails->actions->eventSubjectId) ? null : $integrationDetails->actions->eventSubjectId;
            $finalData = $this->generateReqDataFromFieldMap($fieldValues, $fieldMap);
            $createEventResponse = $this->createEvent($finalData, $contactId, $accountId, $eventSubjectId);
            if (is_object($createEventResponse) && property_exists($createEventResponse, 'id')) {
                LogHandler::save($this->_integrationID, wp_json_encode(['type' => 'Event', 'type_name' => 'Event-create']), 'success', wp_json_encode("Created event id is : $createEventResponse->id"));
            } else {
                LogHandler::save($this->_integrationID, wp_json_encode(['type' => 'Event', 'type_name' => 'Event-create']), 'error', wp_json_encode($createEventResponse));
            }
        }
        if ($actionName === 'case-create') {
            $contactId = empty($integrationDetails->actions->contactId) ? null : $integrationDetails->actions->contactId;
            $accountId = empty($integrationDetails->actions->accountId) ? null : $integrationDetails->actions->accountId;
            $caseStatusId = empty($integrationDetails->actions->caseStatusId) ? null : $integrationDetails->actions->caseStatusId;
            $caseOriginId = empty($integrationDetails->actions->caseOriginId) ? null : $integrationDetails->actions->caseOriginId;
            $casePriorityId = empty($integrationDetails->actions->casePriorityId) ? null : $integrationDetails->actions->casePriorityId;
            $potentialLiabilityId = empty($integrationDetails->actions->potentialLiabilityId) ? null : $integrationDetails->actions->potentialLiabilityId;
            $slaViolationId = empty($integrationDetails->actions->slaViolationId) ? null : $integrationDetails->actions->slaViolationId;
            $finalData = $this->generateReqDataFromFieldMap($fieldValues, $fieldMap);

            if (!empty($integrationDetails->actions->caseReason)) {
                $finalData['Reason'] = $integrationDetails->actions->caseReason;
            }
            if (!empty($integrationDetails->actions->caseType)) {
                $finalData['Type'] = $integrationDetails->actions->caseType;
            }

            $createCaseResponse = $this->createCase($finalData, $contactId, $accountId, $caseStatusId, $caseOriginId, $casePriorityId, $potentialLiabilityId, $slaViolationId);
            if (is_object($createCaseResponse) && property_exists($createCaseResponse, 'id')) {
                LogHandler::save($this->_integrationID, wp_json_encode(['type' => 'Case', 'type_name' => 'Case-create']), 'success', wp_json_encode("Created case id is : $createCaseResponse->id"));
            } else {
                LogHandler::save($this->_integrationID, wp_json_encode(['type' => 'Case', 'type_name' => 'Case-create']), 'error', wp_json_encode($createCaseResponse));
            }
        }
        return true;
    }
}
