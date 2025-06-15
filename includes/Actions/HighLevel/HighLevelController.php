<?php

/**
 * HighLevel Integration
 */

namespace BitCode\FI\Actions\HighLevel;

use BitCode\FI\Core\Util\HttpHelper;
use WP_Error;

/**
 * Provide functionality for HighLevel integration
 */
class HighLevelController
{
    private $_integrationID;

    public function __construct($integrationID)
    {
        $this->_integrationID = $integrationID;
    }

    public static function highLevelAuthorization($requestsParams)
    {
        if (empty($requestsParams->api_key)) {
            wp_send_json_error(__('Requested parameter is empty', 'bit-integrations'), 400);
        }

        $header['Authorization'] = 'Bearer ' . $requestsParams->api_key;

        $apiEndpoint = 'https://rest.gohighlevel.com/v1/contacts/?limit=1';

        $response = HttpHelper::get($apiEndpoint, null, $header);

        if (!isset($response->contacts)) {
            wp_send_json_error(empty($response) ? 'Unknown' : $response, 400);
        }

        wp_send_json_success($response);
    }

    public static function getCustomFields($requestsParams)
    {
        if (empty($requestsParams->api_key)) {
            wp_send_json_error(__('Requested parameter is empty', 'bit-integrations'), 400);
        }

        $api_key = $requestsParams->api_key;
        $apiEndpoint = 'https://rest.gohighlevel.com/v1/custom-fields';
        $header = ['Authorization' => 'Bearer ' . $api_key];

        $response = HttpHelper::get($apiEndpoint, null, $header);

        if (!isset($response->customFields)) {
            wp_send_json_error(__('Custom fields fetching failed', 'bit-integrations'), 400);
        }

        $rawCustomFields = $response->customFields;
        $customFields = [];

        if (!empty($rawCustomFields)) {
            foreach ($rawCustomFields as $item) {
                $customFields[] = (object) [
                    'key'      => $item->id . '_bihl_' . $item->dataType,
                    'label'    => $item->name,
                    'required' => false,
                ];
            }
        }

        wp_send_json_success($customFields, 200);
    }

    public static function getAllTags($fieldsRequestParams)
    {
        if (empty($fieldsRequestParams->api_key)) {
            wp_send_json_error(__('Requested parameter is empty', 'bit-integrations'), 400);
        }

        $apiKey = $fieldsRequestParams->api_key;
        $apiEndpoint = 'https://rest.gohighlevel.com/v1/tags/';
        $header = ['Authorization' => 'Bearer ' . $apiKey];

        $response = HttpHelper::get($apiEndpoint, null, $header);

        if (!isset($response->tags)) {
            wp_send_json_error(__('Tags fetching failed', 'bit-integrations'), 400);
        }

        $tags = $response->tags;
        $tagList = [];

        if (!empty($tags)) {
            foreach ($tags as $tag) {
                $tagList[] = (object) [
                    'label' => $tag->name,
                    'value' => $tag->name
                ];
            }
        }

        wp_send_json_success($tagList, 200);
    }

    public static function getContacts($requestsParams)
    {
        if (empty($requestsParams->api_key)) {
            wp_send_json_error(__('Requested parameter is empty', 'bit-integrations'), 400);
        }

        $apiKey = $requestsParams->api_key;
        $apiEndpoint = 'https://rest.gohighlevel.com/v1/contacts/?limit=100';
        $header = ['Authorization' => 'Bearer ' . $apiKey];
        $response = HttpHelper::get($apiEndpoint, null, $header);

        if (!isset($response->contacts)) {
            wp_send_json_error(__('Contacts fetching failed', 'bit-integrations'), 400);
        }

        $contacts = $response->contacts;
        $contactList = [];

        if (!empty($contacts)) {
            foreach ($contacts as $contact) {
                $contactList[] = (object) [
                    'label' => !empty($contact->contactName)
                    ? $contact->contactName . ' (' . $contact->email . ')' : $contact->email,
                    'value' => $contact->id
                ];
            }
        }

        wp_send_json_success($contactList, 200);
    }

    public static function getUsers($requestsParams)
    {
        if (empty($requestsParams->api_key)) {
            wp_send_json_error(__('Requested parameter is empty', 'bit-integrations'), 400);
        }

        $apiKey = $requestsParams->api_key;
        $apiEndpoint = 'https://rest.gohighlevel.com/v1/users';
        $header = ['Authorization' => 'Bearer ' . $apiKey];
        $response = HttpHelper::get($apiEndpoint, null, $header);

        if (!isset($response->users)) {
            wp_send_json_error(__('Contacts fetching failed', 'bit-integrations'), 400);
        }

        $users = $response->users;
        $userList = [];

        if (!empty($users)) {
            foreach ($users as $user) {
                $userList[] = (object) [
                    'label' => !empty($user->name) ? $user->name . ' (' . $user->email . ')' : $user->email,
                    'value' => $user->id
                ];
            }
        }

        wp_send_json_success($userList, 200);
    }

    public static function getHLTasks($requestsParams)
    {
        if (empty($requestsParams->api_key) || empty($requestsParams->contact_id)) {
            wp_send_json_error(__('Requested parameter(s) empty', 'bit-integrations'), 400);
        }

        $apiKey = $requestsParams->api_key;
        $contactId = $requestsParams->contact_id;
        $apiEndpoint = 'https://rest.gohighlevel.com/v1/contacts/' . $contactId . '/tasks';
        $header = ['Authorization' => 'Bearer ' . $apiKey];
        $response = HttpHelper::get($apiEndpoint, null, $header);

        if (!isset($response->tasks)) {
            wp_send_json_error(__('Tasks fetching failed', 'bit-integrations'), 400);
        }

        $tasks = $response->tasks;
        $taskList = [];

        if (!empty($tasks)) {
            foreach ($tasks as $task) {
                $taskList[] = (object) [
                    'label' => $task->title,
                    'value' => $task->id
                ];
            }
        }

        wp_send_json_success($taskList, 200);
    }

    public static function getPipelines($requestsParams)
    {
        if (empty($requestsParams->api_key)) {
            wp_send_json_error(__('Requested parameter is empty', 'bit-integrations'), 400);
        }

        $apiKey = $requestsParams->api_key;
        $apiEndpoint = 'https://rest.gohighlevel.com/v1/pipelines';
        $header = ['Authorization' => 'Bearer ' . $apiKey];
        $response = HttpHelper::get($apiEndpoint, null, $header);

        if (!isset($response->pipelines)) {
            wp_send_json_error(__('Pipelines fetching failed', 'bit-integrations'), 400);
        }

        $pipelines = $response->pipelines;
        $pipelineList = $stages = [];

        if (!empty($pipelines)) {
            foreach ($pipelines as $pipeline) {
                $pipelineList[] = (object) [
                    'label' => $pipeline->name,
                    'value' => $pipeline->id
                ];
                $stages[$pipeline->id] = $pipeline->stages;
            }
        }

        wp_send_json_success(['pipelineList' => $pipelineList, 'stages' => $stages], 200);
    }

    public static function getOpportunities($requestsParams)
    {
        if (empty($requestsParams->api_key) || empty($requestsParams->pipeline_id)) {
            wp_send_json_error(__('Requested parameter(s) empty', 'bit-integrations'), 400);
        }

        $apiKey = $requestsParams->api_key;
        $pipelineId = $requestsParams->pipeline_id;
        $apiEndpoint = 'https://rest.gohighlevel.com/v1/pipelines/' . $pipelineId . '/opportunities?limit=100';
        $header = ['Authorization' => 'Bearer ' . $apiKey];
        $response = HttpHelper::get($apiEndpoint, null, $header);

        if (!isset($response->opportunities)) {
            wp_send_json_error(__('Opportunities fetching failed', 'bit-integrations'), 400);
        }

        $opportunities = $response->opportunities;
        $opportunityList = [];

        if (!empty($opportunities)) {
            foreach ($opportunities as $opportunity) {
                $opportunityList[] = (object) [
                    'label' => $opportunity->name,
                    'value' => $opportunity->id
                ];
            }
        }

        wp_send_json_success($opportunityList, 200);
    }

    public function execute($integrationData, $fieldValues)
    {
        $integrationDetails = $integrationData->flow_details;
        $apiKey = $integrationDetails->api_key;
        $fieldMap = $integrationDetails->field_map;
        $selectedTask = $integrationDetails->selectedTask;
        $actions = (array) $integrationDetails->actions;

        if (empty($apiKey) || empty($fieldMap)) {
            return new WP_Error('REQ_FIELD_EMPTY', sprintf(__('module, fields are required for %s api', 'bit-integrations'), 'HighLevel'));
        }

        $selectedOptions = [
            'selectedTags'        => $integrationDetails->selectedTags,
            'selectedContact'     => $integrationDetails->selectedContact,
            'selectedTaskStatus'  => $integrationDetails->selectedTaskStatus,
            'selectedUser'        => $integrationDetails->selectedUser,
            'updateTaskId'        => $integrationDetails->updateTaskId,
            'selectedPipeline'    => $integrationDetails->selectedPipeline,
            'selectedStage'       => $integrationDetails->selectedStage,
            'selectedOpportunity' => $integrationDetails->selectedOpportunity,
        ];

        $recordApiHelper = new RecordApiHelper($apiKey, $this->_integrationID);

        $highLevelApiResponse = $recordApiHelper->execute($fieldValues, $fieldMap, $selectedTask, $selectedOptions, $actions);

        if (is_wp_error($highLevelApiResponse)) {
            return $highLevelApiResponse;
        }

        return $highLevelApiResponse;
    }
}
