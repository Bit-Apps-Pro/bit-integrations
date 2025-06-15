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

    public function insertContact($finalData)
    {
        $apiEndpoint = $this->_apiDomain . '/services/data/v37.0/sobjects/Contact';

        return HttpHelper::post($apiEndpoint, wp_json_encode($finalData), $this->_defaultHeader);
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
            if (\is_object($insertContactResponse) && property_exists($insertContactResponse, 'id')) {
                LogHandler::save($this->_integrationID, wp_json_encode(['type' => $actionName, 'type_name' => 'Contact-create']), 'success', wp_json_encode(wp_sprintf(__('Created contact id is : %s', 'bit-integrations'), $insertContactResponse->id)));
            } else {
                LogHandler::save($this->_integrationID, wp_json_encode(['type' => 'Contact', 'type_name' => 'Contact-create']), 'error', wp_json_encode($insertContactResponse));
            }
        } elseif ($actionName === 'lead-create') {
            $finalData = $this->generateReqDataFromFieldMap($fieldValues, $fieldMap);
            $insertLeadResponse = $this->insertLead($finalData);
            if (\is_object($insertLeadResponse) && property_exists($insertLeadResponse, 'id')) {
                LogHandler::save($this->_integrationID, wp_json_encode(['type' => $actionName, 'type_name' => 'Lead-create']), 'success', wp_json_encode(wp_sprintf(__('Created lead id is : %s', 'bit-integrations'), $insertLeadResponse->id)));
            } else {
                LogHandler::save($this->_integrationID, wp_json_encode(['type' => 'Lead', 'type_name' => 'Lead-create']), 'error', wp_json_encode($insertLeadResponse));
            }
        } elseif ($actionName === 'account-create') {
            $finalData = $this->generateReqDataFromFieldMap($fieldValues, $fieldMap);

            if (!empty($integrationDetails->actions->selectedAccType)) {
                $finalData['Type'] = $integrationDetails->actions->selectedAccType;
            }
            if (!empty($integrationDetails->actions->selectedOwnership)) {
                $finalData['Ownership'] = $integrationDetails->actions->selectedOwnership;
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
            $opportunityTypeId = empty($integrationDetails->actions->opportunityTypeId) ? null : $integrationDetails->actions->opportunityTypeId;
            $opportunityStageId = empty($integrationDetails->actions->opportunityStageId) ? null : $integrationDetails->actions->opportunityStageId;
            $opportunityLeadSourceId = empty($integrationDetails->actions->opportunityLeadSourceId) ? null : $integrationDetails->actions->opportunityLeadSourceId;
            $accountId = empty($integrationDetails->actions->accountId) ? null : $integrationDetails->actions->accountId;
            $campaignId = empty($integrationDetails->actions->campaignId) ? null : $integrationDetails->actions->campaignId;
            $finalData = $this->generateReqDataFromFieldMap($fieldValues, $fieldMap);
            $opportunityResponse = $this->createOpportunity($finalData, $opportunityTypeId, $opportunityStageId, $opportunityLeadSourceId, $accountId, $campaignId);
            if (\is_object($opportunityResponse) && property_exists($opportunityResponse, 'id')) {
                LogHandler::save($this->_integrationID, wp_json_encode(['type' => 'Opportunity', 'type_name' => 'Opportunity-create']), 'success', wp_json_encode(wp_sprintf(__('Created opportunity id is : %s', 'bit-integrations'), $opportunityResponse->id)));
            } else {
                LogHandler::save($this->_integrationID, wp_json_encode(['type' => 'Opportunity', 'type_name' => 'Opportunity-create']), 'error', wp_json_encode($opportunityResponse));
            }
        } elseif ($actionName === 'event-create') {
            $contactId = empty($integrationDetails->actions->contactId) ? null : $integrationDetails->actions->contactId;
            $accountId = empty($integrationDetails->actions->accountId) ? null : $integrationDetails->actions->accountId;
            $eventSubjectId = empty($integrationDetails->actions->eventSubjectId) ? null : $integrationDetails->actions->eventSubjectId;
            $finalData = $this->generateReqDataFromFieldMap($fieldValues, $fieldMap);
            $createEventResponse = $this->createEvent($finalData, $contactId, $accountId, $eventSubjectId);
            if (\is_object($createEventResponse) && property_exists($createEventResponse, 'id')) {
                LogHandler::save($this->_integrationID, wp_json_encode(['type' => 'Event', 'type_name' => 'Event-create']), 'success', wp_json_encode(wp_sprintf(__('Created event id is : %s', 'bit-integrations'), $createEventResponse->id)));
            } else {
                LogHandler::save($this->_integrationID, wp_json_encode(['type' => 'Event', 'type_name' => 'Event-create']), 'error', wp_json_encode($createEventResponse));
            }
        } elseif ($actionName === 'case-create') {
            $actionsData['ContactId'] = empty($integrationDetails->actions->contactId) ? null : $integrationDetails->actions->contactId;
            $actionsData['AccountId'] = empty($integrationDetails->actions->accountId) ? null : $integrationDetails->actions->accountId;
            $actionsData['Status'] = empty($integrationDetails->actions->caseStatusId) ? null : $integrationDetails->actions->caseStatusId;
            $actionsData['Origin'] = empty($integrationDetails->actions->caseOriginId) ? null : $integrationDetails->actions->caseOriginId;
            $actionsData['Priority'] = empty($integrationDetails->actions->casePriorityId) ? null : $integrationDetails->actions->casePriorityId;
            $actionsData['Reason'] = empty($integrationDetails->actions->caseReason) ? null : $integrationDetails->actions->caseReason;
            $actionsData['Type'] = empty($integrationDetails->actions->caseType) ? null : $integrationDetails->actions->caseType;
            $actionsData['PotentialLiability__c'] = empty($integrationDetails->actions->potentialLiabilityId) ? null : $integrationDetails->actions->potentialLiabilityId;
            $actionsData['SLAViolation__c'] = empty($integrationDetails->actions->slaViolationId) ? null : $integrationDetails->actions->slaViolationId;

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
