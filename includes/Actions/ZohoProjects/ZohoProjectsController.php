<?php

/**
 * ZohoProjects Integration
 */

namespace BitCode\FI\Actions\ZohoProjects;

use BitCode\FI\Core\Util\IpTool;
use BitCode\FI\Core\Util\HttpHelper;

/**
 * Provide functionality for ZohoCrm integration
 */
class ZohoProjectsController
{
    private $_integrationID;

    public function __construct($integrationID)
    {
        $this->_integrationID = $integrationID;
    }

    /**
     * Process ajax request for generate_token
     *
     * @param mixed $requestsParams
     *
     * @return JSON zoho crm api response and status
     */
    public static function generateTokens($requestsParams)
    {
        if (empty($requestsParams->{'accounts-server'})
                || empty($requestsParams->dataCenter)
                || empty($requestsParams->clientId)
                || empty($requestsParams->clientSecret)
                || empty($requestsParams->redirectURI)
                || empty($requestsParams->code)
        ) {
            wp_send_json_error(
                __(
                    'Requested parameter is empty',
                    'bit-integrations'
                ),
                400
            );
        }

        $apiEndpoint = urldecode($requestsParams->{'accounts-server'}) . '/oauth/v2/token';
        $requestParams = [
            'grant_type'    => 'authorization_code',
            'client_id'     => $requestsParams->clientId,
            'client_secret' => $requestsParams->clientSecret,
            'redirect_uri'  => urldecode($requestsParams->redirectURI),
            'code'          => $requestsParams->code
        ];
        $apiResponse = HttpHelper::post($apiEndpoint, $requestParams);

        if (is_wp_error($apiResponse) || !empty($apiResponse->error)) {
            wp_send_json_error(
                empty($apiResponse->error) ? 'Unknown' : $apiResponse->error,
                400
            );
        }
        $apiResponse->generates_on = time();
        wp_send_json_success($apiResponse, 200);
    }

    public static function refreshPortalsAjaxHelper($queryParams)
    {
        if (empty($queryParams->tokenDetails)
                || empty($queryParams->dataCenter)
                || empty($queryParams->clientId)
                || empty($queryParams->clientSecret)
        ) {
            wp_send_json_error(
                __(
                    'Requested parameter is empty',
                    'bit-integrations'
                ),
                400
            );
        }
        $response = [];
        if ((\intval($queryParams->tokenDetails->generates_on) + (55 * 60)) < time()) {
            $response['tokenDetails'] = self::refreshAccessToken($queryParams);
        }

        $portalsMetaApiEndpoint = "https://projectsapi.zoho.{$queryParams->dataCenter}/restapi/portals/";

        $authorizationHeader['Authorization'] = "Zoho-oauthtoken {$queryParams->tokenDetails->access_token}";
        $portalsMetaResponse = HttpHelper::get($portalsMetaApiEndpoint, null, $authorizationHeader);

        if (!is_wp_error($portalsMetaResponse)) {
            $allPortals = [];
            $portals = $portalsMetaResponse->portals;

            if (\count($portals) > 0) {
                foreach ($portals as $portal) {
                    $allPortals[$portal->name] = (object) [
                        'portalId'   => $portal->id,
                        'portalName' => $portal->name
                    ];
                }
            }
            uksort($allPortals, 'strnatcasecmp');
            $response['portals'] = $allPortals;
        } else {
            wp_send_json_error(
                empty($portalsMetaResponse->data) ? 'Unknown' : $portalsMetaResponse->error,
                400
            );
        }
        if (!empty($response['tokenDetails']) && !empty($queryParams->id)) {
            self::saveRefreshedToken($queryParams->formID, $queryParams->id, $response['tokenDetails'], $response['lists']);
        }
        wp_send_json_success($response, 200);
    }

    public static function refreshProjectsAjaxHelper($queryParams)
    {
        if (empty($queryParams->tokenDetails)
                || empty($queryParams->dataCenter)
                || empty($queryParams->clientId)
                || empty($queryParams->clientSecret)
                || empty($queryParams->portalId)
        ) {
            wp_send_json_error(
                __(
                    'Requested parameter is empty',
                    'bit-integrations'
                ),
                400
            );
        }
        $response = [];
        if ((\intval($queryParams->tokenDetails->generates_on) + (55 * 60)) < time()) {
            $response['tokenDetails'] = self::refreshAccessToken($queryParams);
        }

        $projectsMetaApiEndpoint = "https://projectsapi.zoho.{$queryParams->dataCenter}/restapi/portal/{$queryParams->portalId}/projects/?range=1000&status=active";

        $authorizationHeader['Authorization'] = "Zoho-oauthtoken {$queryParams->tokenDetails->access_token}";
        $projectsMetaResponse = HttpHelper::get($projectsMetaApiEndpoint, null, $authorizationHeader);

        // wp_send_json_success($projectsMetaResponse, 200);

        if (!is_wp_error($projectsMetaResponse)) {
            $allProjects = [];
            $projects = $projectsMetaResponse->projects;

            if (\count($projects) > 0) {
                foreach ($projects as $project) {
                    $allProjects[$project->name] = (object) [
                        'projectId'   => $project->id_string,
                        'projectName' => $project->name
                    ];
                }
            }
            uksort($allProjects, 'strnatcasecmp');
            $response['projects'] = $allProjects;
        } else {
            wp_send_json_error(
                empty($projectsMetaResponse->data) ? 'Unknown' : $projectsMetaResponse->error,
                400
            );
        }
        if (!empty($response['tokenDetails']) && !empty($queryParams->id)) {
            self::saveRefreshedToken($queryParams->formID, $queryParams->id, $response['tokenDetails'], $response['lists']);
        }
        wp_send_json_success($response, 200);
    }

    public static function refreshMilestonesAjaxHelper($queryParams)
    {
        if (empty($queryParams->tokenDetails)
                || empty($queryParams->dataCenter)
                || empty($queryParams->clientId)
                || empty($queryParams->clientSecret)
                || empty($queryParams->portalId)
                || empty($queryParams->projectId)
        ) {
            wp_send_json_error(
                __(
                    'Requested parameter is empty',
                    'bit-integrations'
                ),
                400
            );
        }
        $response = [];
        if ((\intval($queryParams->tokenDetails->generates_on) + (55 * 60)) < time()) {
            $response['tokenDetails'] = self::refreshAccessToken($queryParams);
        }

        $milestonesMetaApiEndpoint = "https://projectsapi.zoho.{$queryParams->dataCenter}/restapi/portal/{$queryParams->portalId}/projects/{$queryParams->projectId}/milestones/?range=1000";

        $authorizationHeader['Authorization'] = "Zoho-oauthtoken {$queryParams->tokenDetails->access_token}";
        $milestonesMetaResponse = HttpHelper::get($milestonesMetaApiEndpoint, null, $authorizationHeader);

        if (!is_wp_error($milestonesMetaResponse)) {
            $allMilestones = [];
            $milestones = $milestonesMetaResponse->milestones;

            if (\count($milestones) > 0) {
                foreach ($milestones as $milestone) {
                    $allMilestones[$milestone->name] = (object) [
                        'milestoneId'   => $milestone->id_string,
                        'milestoneName' => $milestone->name
                    ];
                }
            }
            uksort($allMilestones, 'strnatcasecmp');
            $response['milestones'] = $allMilestones;
        } else {
            wp_send_json_error(
                empty($milestonesMetaResponse->data) ? 'Unknown' : $milestonesMetaResponse->error,
                400
            );
        }
        if (!empty($response['tokenDetails']) && !empty($queryParams->id)) {
            self::saveRefreshedToken($queryParams->formID, $queryParams->id, $response['tokenDetails'], $response['lists']);
        }
        wp_send_json_success($response, 200);
    }

    public static function refreshTasklistsAjaxHelper($queryParams)
    {
        if (empty($queryParams->tokenDetails)
                || empty($queryParams->dataCenter)
                || empty($queryParams->clientId)
                || empty($queryParams->clientSecret)
                || empty($queryParams->portalId)
                || empty($queryParams->projectId)
                || empty($queryParams->tasklistFlag)
        ) {
            wp_send_json_error(
                __(
                    'Requested parameter is empty',
                    'bit-integrations'
                ),
                400
            );
        }
        $response = [];
        if ((\intval($queryParams->tokenDetails->generates_on) + (55 * 60)) < time()) {
            $response['tokenDetails'] = self::refreshAccessToken($queryParams);
        }

        $tasklistsMetaApiEndpoint = "https://projectsapi.zoho.{$queryParams->dataCenter}/restapi/portal/{$queryParams->portalId}/projects/{$queryParams->projectId}/tasklists/?range=1000&flag={$queryParams->tasklistFlag}";

        if ($queryParams->milestoneId) {
            $tasklistsMetaApiEndpoint .= "&milestone_id={$queryParams->milestoneId}";
        }

        $authorizationHeader['Authorization'] = "Zoho-oauthtoken {$queryParams->tokenDetails->access_token}";
        $tasklistsMetaResponse = HttpHelper::get($tasklistsMetaApiEndpoint, null, $authorizationHeader);

        if (!is_wp_error($tasklistsMetaResponse)) {
            $allTasklists = [];
            $tasklists = $tasklistsMetaResponse->tasklists;

            if (\count($tasklists) > 0) {
                foreach ($tasklists as $tasklist) {
                    $allTasklists[$tasklist->name] = (object) [
                        'tasklistId'   => $tasklist->id_string,
                        'tasklistName' => $tasklist->name
                    ];
                }
            }
            uksort($allTasklists, 'strnatcasecmp');
            $response['tasklists'] = $allTasklists;
        } else {
            wp_send_json_error(
                empty($tasklistsMetaResponse->data) ? 'Unknown' : $tasklistsMetaResponse->error,
                400
            );
        }
        if (!empty($response['tokenDetails']) && !empty($queryParams->id)) {
            self::saveRefreshedToken($queryParams->formID, $queryParams->id, $response['tokenDetails'], $response['lists']);
        }
        wp_send_json_success($response, 200);
    }

    public static function refreshTasksAjaxHelper($queryParams)
    {
        if (empty($queryParams->tokenDetails)
                || empty($queryParams->dataCenter)
                || empty($queryParams->clientId)
                || empty($queryParams->clientSecret)
                || empty($queryParams->portalId)
                || empty($queryParams->projectId)
        ) {
            wp_send_json_error(
                __(
                    'Requested parameter is empty',
                    'bit-integrations'
                ),
                400
            );
        }
        $response = [];
        if ((\intval($queryParams->tokenDetails->generates_on) + (55 * 60)) < time()) {
            $response['tokenDetails'] = self::refreshAccessToken($queryParams);
        }

        $tasksMetaApiEndpoint = "https://projectsapi.zoho.{$queryParams->dataCenter}/restapi/portal/{$queryParams->portalId}/projects/{$queryParams->projectId}/tasks/?range=1000";

        if ($queryParams->milestoneId) {
            $tasksMetaApiEndpoint .= "&milestone_id={$queryParams->milestoneId}";
        }
        if ($queryParams->tasklistId) {
            $tasksMetaApiEndpoint .= "&tasklist_id={$queryParams->tasklistId}";
        }

        $authorizationHeader['Authorization'] = "Zoho-oauthtoken {$queryParams->tokenDetails->access_token}";
        $tasksMetaResponse = HttpHelper::get($tasksMetaApiEndpoint, null, $authorizationHeader);

        if (!is_wp_error($tasksMetaResponse)) {
            $allTasks = [];
            $tasks = $tasksMetaResponse->tasks;

            if (\count($tasks) > 0) {
                foreach ($tasks as $task) {
                    $allTasks[$task->name] = (object) [
                        'taskId'   => $task->id_string,
                        'taskName' => $task->name
                    ];
                }
            }
            uksort($allTasks, 'strnatcasecmp');
            $response['tasks'] = $allTasks;
        } else {
            wp_send_json_error(
                empty($tasksMetaResponse->data) ? 'Unknown' : $tasksMetaResponse->error,
                400
            );
        }
        if (!empty($response['tokenDetails']) && !empty($queryParams->id)) {
            self::saveRefreshedToken($queryParams->formID, $queryParams->id, $response['tokenDetails'], $response['lists']);
        }
        wp_send_json_success($response, 200);
    }

    public static function refreshFieldsAjaxHelper($queryParams)
    {
        if (empty($queryParams->tokenDetails)
                || empty($queryParams->dataCenter)
                || empty($queryParams->clientId)
                || empty($queryParams->clientSecret)
                || empty($queryParams->portalId)
                || empty($queryParams->event)
        ) {
            wp_send_json_error(
                __(
                    'Requested parameter is empty',
                    'bit-integrations'
                ),
                400
            );
        }
        $response = [];
        if ((\intval($queryParams->tokenDetails->generates_on) + (55 * 60)) < time()) {
            $response['tokenDetails'] = self::refreshAccessToken($queryParams);
        }

        if ($queryParams->event === 'project') {
            $response = self::getProjectFields($queryParams->dataCenter, $queryParams->portalId, $queryParams->tokenDetails->access_token);
        } elseif ($queryParams->event === 'milestone') {
            $response = self::getMilestoneFields();
        } elseif ($queryParams->event === 'tasklist') {
            $response = self::getTasklistFields();
        } elseif ($queryParams->event === 'task' || $queryParams->event === 'subtask') {
            $response = self::getTaskFields($queryParams->dataCenter, $queryParams->portalId, $queryParams->tokenDetails->access_token, $queryParams->projectId);
        } elseif ($queryParams->event === 'issue') {
            $response = self::getIssueFields($queryParams->dataCenter, $queryParams->portalId, $queryParams->tokenDetails->access_token, $queryParams->projectId);
        }

        if (!empty($response['tokenDetails']) && $response['tokenDetails'] && !empty($queryParams->id)) {
            $response['queryModule'] = $queryParams->module;
            self::saveRefreshedToken($queryParams->formID, $queryParams->id, $response['tokenDetails'], $response);
        }
        wp_send_json_success($response, 200);
    }

    public static function refreshUsersAjaxHelper($queryParams)
    {
        if (empty($queryParams->tokenDetails)
                || empty($queryParams->dataCenter)
                || empty($queryParams->clientId)
                || empty($queryParams->clientSecret)
                || empty($queryParams->portalId)
        ) {
            wp_send_json_error(
                __(
                    'Requested parameter is empty',
                    'bit-integrations'
                ),
                400
            );
        }
        $response = [];
        if ((\intval($queryParams->tokenDetails->generates_on) + (55 * 60)) < time()) {
            $response['tokenDetails'] = self::refreshAccessToken($queryParams);
        }

        $usersMetaApiEndpoint = '';

        if ($queryParams->projectId) {
            $usersMetaApiEndpoint = "https://projectsapi.zoho.{$queryParams->dataCenter}/restapi/portal/{$queryParams->portalId}/projects/{$queryParams->projectId}/users/";
        } else {
            $usersMetaApiEndpoint = "https://projectsapi.zoho.{$queryParams->dataCenter}/restapi/portal/{$queryParams->portalId}/users/";
        }

        $authorizationHeader['Authorization'] = "Zoho-oauthtoken {$queryParams->tokenDetails->access_token}";
        $usersMetaResponse = HttpHelper::get($usersMetaApiEndpoint, null, $authorizationHeader);

        // wp_send_json_success($usersMetaResponse, 200);

        if (!is_wp_error($usersMetaResponse)) {
            $users = $usersMetaResponse->users;

            if (\count($users) > 0) {
                foreach ($users as $user) {
                    $response['users'][] = (object) [
                        'userId'    => $user->id,
                        'userName'  => $user->name,
                        'userEmail' => $user->email,
                    ];
                }
            }
        } else {
            wp_send_json_error(
                empty($usersMetaResponse->data) ? 'Unknown' : $usersMetaResponse->error,
                400
            );
        }
        if (!empty($response['tokenDetails']) && !empty($queryParams->id)) {
            self::saveRefreshedToken($queryParams->formID, $queryParams->id, $response['tokenDetails'], $response['lists']);
        }
        wp_send_json_success($response, 200);
    }

    public static function refreshTaskLaysAjaxHelper($queryParams)
    {
        if (empty($queryParams->tokenDetails)
                || empty($queryParams->dataCenter)
                || empty($queryParams->clientId)
                || empty($queryParams->clientSecret)
                || empty($queryParams->portalId)
        ) {
            wp_send_json_error(
                __(
                    'Requested parameter is empty',
                    'bit-integrations'
                ),
                400
            );
        }
        $response = [];
        if ((\intval($queryParams->tokenDetails->generates_on) + (55 * 60)) < time()) {
            $response['tokenDetails'] = self::refreshAccessToken($queryParams);
        }

        $taskLaysMetaApiEndpoint = "https://projectsapi.zoho.{$queryParams->dataCenter}/restapi/portal/{$queryParams->portalId}/tasklayouts";

        $authorizationHeader['Authorization'] = "Zoho-oauthtoken {$queryParams->tokenDetails->access_token}";
        $taskLaysMetaResponse = HttpHelper::get($taskLaysMetaApiEndpoint, null, $authorizationHeader);

        // wp_send_json_success($taskLaysMetaResponse, 200);

        if (!is_wp_error($taskLaysMetaResponse)) {
            $taskLays = $taskLaysMetaResponse->layouts;

            if (\count($taskLays) > 0) {
                foreach ($taskLays as $taskLay) {
                    $response['taskLays'][] = (object) [
                        'taskLayId'   => $taskLay->layout_id,
                        'taskLayName' => $taskLay->layout_name
                    ];
                }
            }
        } else {
            wp_send_json_error(
                empty($taskLaysMetaResponse->data) ? 'Unknown' : $taskLaysMetaResponse->error,
                400
            );
        }
        if (!empty($response['tokenDetails']) && !empty($queryParams->id)) {
            self::saveRefreshedToken($queryParams->formID, $queryParams->id, $response['tokenDetails'], $response['lists']);
        }
        wp_send_json_success($response, 200);
    }

    public static function refreshGroupsAjaxHelper($queryParams)
    {
        if (empty($queryParams->tokenDetails)
                || empty($queryParams->dataCenter)
                || empty($queryParams->clientId)
                || empty($queryParams->clientSecret)
                || empty($queryParams->portalId)
        ) {
            wp_send_json_error(
                __(
                    'Requested parameter is empty',
                    'bit-integrations'
                ),
                400
            );
        }
        $response = [];
        if ((\intval($queryParams->tokenDetails->generates_on) + (55 * 60)) < time()) {
            $response['tokenDetails'] = self::refreshAccessToken($queryParams);
        }

        $groupsMetaApiEndpoint = "https://projectsapi.zoho.{$queryParams->dataCenter}/restapi/portal/{$queryParams->portalId}/projects/groups";

        $authorizationHeader['Authorization'] = "Zoho-oauthtoken {$queryParams->tokenDetails->access_token}";
        $groupsMetaResponse = HttpHelper::get($groupsMetaApiEndpoint, null, $authorizationHeader);

        // wp_send_json_success($groupsMetaResponse, 200);

        if (!is_wp_error($groupsMetaResponse)) {
            $groups = $groupsMetaResponse->groups;

            if (\count($groups) > 0) {
                foreach ($groups as $group) {
                    $response['groups'][] = (object) [
                        'groupId'   => $group->id,
                        'groupName' => $group->name
                    ];
                }
            }
        } else {
            wp_send_json_error(
                empty($groupsMetaResponse->data) ? 'Unknown' : $groupsMetaResponse->error,
                400
            );
        }
        if (!empty($response['tokenDetails']) && !empty($queryParams->id)) {
            self::saveRefreshedToken($queryParams->formID, $queryParams->id, $response['tokenDetails'], $response['lists']);
        }
        wp_send_json_success($response, 200);
    }

    public static function refreshTagsAjaxHelper($queryParams)
    {
        if (empty($queryParams->tokenDetails)
                || empty($queryParams->dataCenter)
                || empty($queryParams->clientId)
                || empty($queryParams->clientSecret)
                || empty($queryParams->portalId)
        ) {
            wp_send_json_error(
                __(
                    'Requested parameter is empty',
                    'bit-integrations'
                ),
                400
            );
        }

        $response = [];
        if ((\intval($queryParams->tokenDetails->generates_on) + (55 * 60)) < time()) {
            $response['tokenDetails'] = self::refreshAccessToken($queryParams);
        }

        $tagsMetaApiEndpoint = "https://projectsapi.zoho.{$queryParams->dataCenter}/api/v3/portal/{$queryParams->portalId}/tags";

        $authorizationHeader['Authorization'] = "Zoho-oauthtoken {$queryParams->tokenDetails->access_token}";
        $tagsMetaResponse = HttpHelper::get($tagsMetaApiEndpoint, null, $authorizationHeader);

        // wp_send_json_success($tagsMetaResponse, 200);

        if (!is_wp_error($tagsMetaResponse)) {
            $tags = $tagsMetaResponse->tags;

            if (\count($tags) > 0) {
                $allTags = [];
                foreach ($tags as $tag) {
                    $allTags[$tag->name] = (object) [
                        'tagId'   => $tag->id,
                        'tagName' => $tag->name
                    ];
                }
                uksort($allTags, 'strnatcasecmp');
                $response['tags'] = $allTags;
            }
        } else {
            wp_send_json_error(
                empty($tagsMetaResponse->data) ? 'Unknown' : $tagsMetaResponse->error,
                400
            );
        }
        if (!empty($response['tokenDetails']) && !empty($queryParams->id)) {
            self::saveRefreshedToken($queryParams->formID, $queryParams->id, $response['tokenDetails'], $response['lists']);
        }
        wp_send_json_success($response, 200);
    }

    public function execute($integrationData, $fieldValues)
    {
        $integrationDetails = $integrationData->flow_details;

        $tokenDetails = $integrationDetails->tokenDetails;
        $portalId = $integrationDetails->portalId;
        $dataCenter = $integrationDetails->dataCenter;
        $fieldMap = $integrationDetails->field_map;
        if (empty($tokenDetails)
            || empty($portalId)
            || empty($fieldMap)
        ) {
            return new WP_Error('REQ_FIELD_EMPTY', __('list are required for zoho projects api', 'bit-integrations'));
        }

        if ((\intval($tokenDetails->generates_on) + (55 * 60)) < time()) {
            $requiredParams['clientId'] = $integrationDetails->clientId;
            $requiredParams['clientSecret'] = $integrationDetails->clientSecret;
            $requiredParams['dataCenter'] = $integrationDetails->dataCenter;
            $requiredParams['tokenDetails'] = $tokenDetails;
            $newTokenDetails = self::refreshAccessToken((object) $requiredParams);
            if ($newTokenDetails) {
                self::saveRefreshedToken($this->_formID, $this->_integrationID, $newTokenDetails);
                $tokenDetails = $newTokenDetails;
            }
        }

        $recordApiHelper = new RecordApiHelper($tokenDetails, $this->_integrationID, $logID);

        $zprojectsApiResponse = $recordApiHelper->execute(
            $this->_formID,
            $entryID,
            $integrationDetails,
            $dataCenter,
            $fieldMap,
            $fieldValues
        );

        if (is_wp_error($zprojectsApiResponse)) {
            return $zprojectsApiResponse;
        }

        return $zprojectsApiResponse;
    }

    protected static function getProjectFields($dataCenter, $portalId, $access_token)
    {
        $allFields = [
            'Project Title' => [
                'apiName'      => 'name',
                'displayLabel' => __('Project Title', 'bit-integrations'),
                'required'     => true
            ],
            'Project Overview' => [
                'apiName'      => 'description',
                'displayLabel' => __('Project Overview', 'bit-integrations')
            ],
            'Start Date' => [
                'apiName'      => 'start_date',
                'displayLabel' => __('Start Date', 'bit-integrations')
            ],
            'End Date' => [
                'apiName'      => 'end_date',
                'displayLabel' => __('End Date', 'bit-integrations')
            ],
            'Strict Project' => [
                'apiName'      => 'strict_project',
                'displayLabel' => __('Strict Project', 'bit-integrations')
            ],
            'Project Budget' => [
                'apiName'      => 'budget_type',
                'displayLabel' => __('Project Budget', 'bit-integrations')
            ],
            'Budget Amount' => [
                'apiName'      => 'budget_value',
                'displayLabel' => __('Budget Amount', 'bit-integrations')
            ],
            'Billing Method' => [
                'apiName'      => 'billing_method',
                'displayLabel' => __('Billing Method', 'bit-integrations')
            ],
            'Currency' => [
                'apiName'      => 'currency',
                'displayLabel' => __('Currency', 'bit-integrations')
            ],
            'Threshold Limit' => [
                'apiName'      => 'threshold',
                'displayLabel' => __('Threshold Limit', 'bit-integrations')
            ],
            'Rate Per Hour' => [
                'apiName'      => 'project_rate',
                'displayLabel' => __('Rate Per Hour', 'bit-integrations')
            ],
            'Fixed Cost' => [
                'apiName'      => 'fixed_cost',
                'displayLabel' => __('Fixed Cost', 'bit-integrations')
            ],
            'Bill Status' => [
                'apiName'      => 'bill_status',
                'displayLabel' => __('Bill Status', 'bit-integrations')
            ]
        ];

        $response['required'][] = 'name';

        $customFieldsMetaApiEndpoint = "https://projectsapi.zoho.{$dataCenter}/restapi/portal/{$portalId}/projects/customfields/";
        $authorizationHeader['Authorization'] = "Zoho-oauthtoken {$access_token}";
        $customFieldsMetaResponse = HttpHelper::get($customFieldsMetaApiEndpoint, null, $authorizationHeader);

        if (!is_wp_error($customFieldsMetaResponse)) {
            $fields = $customFieldsMetaResponse->project_custom_fields;

            if (\count($fields) > 0) {
                foreach ($fields as $field) {
                    $allFields[$field->field_name] = (object) [
                        'apiName'      => $field->field_id,
                        'displayLabel' => $field->field_name
                    ];

                    if ($field->is_mandatory) {
                        $response['required'][] = $field->field_id;
                    }
                }
            }
        }

        $response['fields'] = $allFields;
        uksort($response['fields'], 'strnatcasecmp');
        usort($response['required'], 'strnatcasecmp');

        return $response;
    }

    protected static function getMilestoneFields()
    {
        $allFields = [
            'Milestone Title' => [
                'apiName'      => 'name',
                'displayLabel' => __('Milestone Title', 'bit-integrations'),
                'required'     => true
            ],
            'Start Date' => [
                'apiName'      => 'start_date',
                'displayLabel' => __('Start Date', 'bit-integrations'),
                'required'     => true
            ],
            'End Date' => [
                'apiName'      => 'end_date',
                'displayLabel' => __('End Date', 'bit-integrations'),
                'required'     => true
            ]
        ];

        $response['required'] = ['name', 'start_date', 'end_date'];

        $response['fields'] = $allFields;
        uksort($response['fields'], 'strnatcasecmp');
        usort($response['required'], 'strnatcasecmp');

        return $response;
    }

    protected static function getTasklistFields()
    {
        $allFields = [
            'Tasklist Title' => [
                'apiName'      => 'name',
                'displayLabel' => __('Tasklist Title', 'bit-integrations'),
                'required'     => true
            ]
        ];

        $response['required'] = ['name'];

        $response['fields'] = $allFields;
        uksort($response['fields'], 'strnatcasecmp');
        usort($response['required'], 'strnatcasecmp');

        return $response;
    }

    protected static function getTaskFields($dataCenter, $portalId, $access_token, $projectId)
    {
        $allFields = [
            'Task Title' => [
                'apiName'      => 'name',
                'displayLabel' => __('Task Title', 'bit-integrations'),
                'required'     => true
            ],
            'Task Description' => [
                'apiName'      => 'description',
                'displayLabel' => __('Task Description', 'bit-integrations')
            ],
            'Start Date' => [
                'apiName'      => 'start_date',
                'displayLabel' => __('Start Date', 'bit-integrations')
            ],
            'End Date' => [
                'apiName'      => 'end_date',
                'displayLabel' => __('End Date', 'bit-integrations')
            ],
            'Duration' => [
                'apiName'      => 'duration',
                'displayLabel' => __('Duration', 'bit-integrations')
            ],
            'Duration Type' => [
                'apiName'      => 'duration_type',
                'displayLabel' => __('Duration Type', 'bit-integrations')
            ],
            'Start Time' => [
                'apiName'      => 'start_time',
                'displayLabel' => __('Start Time', 'bit-integrations')
            ],
            'End Time' => [
                'apiName'      => 'end_time',
                'displayLabel' => __('End Time', 'bit-integrations')
            ],
            'Rate Per Hour' => [
                'apiName'      => 'rate_per_hour',
                'displayLabel' => __('Rate Per Hour', 'bit-integrations')
            ],
            'Priority' => [
                'apiName'      => 'priority',
                'displayLabel' => __('Priority', 'bit-integrations')
            ]
        ];

        $response['required'][] = 'name';

        // for associate with project
        if ($projectId) {
            $customFieldsMetaApiEndpoint = "https://projectsapi.zoho.{$dataCenter}/restapi/portal/{$portalId}/projects/{$projectId}/tasklayouts";
            $authorizationHeader['Authorization'] = "Zoho-oauthtoken {$access_token}";
            $customFieldsMetaResponse = HttpHelper::get($customFieldsMetaApiEndpoint, null, $authorizationHeader);

            if (!is_wp_error($customFieldsMetaResponse)) {
                $sections = $customFieldsMetaResponse->section_details;

                if (\count($sections) > 0) {
                    foreach ($sections as $section) {
                        $fields = $section->customfield_details;
                        foreach ($fields as $field) {
                            if (!$field->is_default) {
                                $allFields[$field->display_name] = (object) [
                                    'apiName'      => 'cf_' . $field->column_name,
                                    'displayLabel' => $field->display_name
                                ];
                                if ($field->is_mandatory) {
                                    $response['required'][] = 'cf_' . $field->column_name;
                                }
                            }
                        }
                    }
                }
            }
        }

        $response['fields'] = $allFields;
        uksort($response['fields'], 'strnatcasecmp');
        usort($response['required'], 'strnatcasecmp');

        return $response;
    }

    protected static function getIssueFields($dataCenter, $portalId, $access_token, $projectId)
    {
        $allFields = [
            'Issue Title' => [
                'apiName'      => 'title',
                'displayLabel' => __('Issue Title', 'bit-integrations'),
                'required'     => true
            ],
            'Description' => [
                'apiName'      => 'description',
                'displayLabel' => __('Description', 'bit-integrations')
            ],
            'Due Date' => [
                'apiName'      => 'due_date',
                'displayLabel' => __('Due Date', 'bit-integrations')
            ],
            'Rate Per Hour' => [
                'apiName'      => 'rate_per_hour',
                'displayLabel' => __('Rate Per Hour', 'bit-integrations')
            ]
        ];

        $response['required'] = ['title'];

        // for associate with project
        if ($projectId) {
            // Custom Fields
            $customFieldsMetaApiEndpoint = "https://projectsapi.zoho.{$dataCenter}/restapi/portal/{$portalId}/projects/{$projectId}/bugs/customfields/";
            $authorizationHeader['Authorization'] = "Zoho-oauthtoken {$access_token}";
            $customFieldsMetaResponse = HttpHelper::get($customFieldsMetaApiEndpoint, null, $authorizationHeader);

            if (!is_wp_error($customFieldsMetaResponse)) {
                $fields = $customFieldsMetaResponse->customfields;

                if (\count($fields) > 0) {
                    foreach ($fields as $field) {
                        $allFields[$field->label_name] = (object) [
                            'apiName'      => $field->column_name,
                            'displayLabel' => $field->label_name
                        ];

                        if ($field->is_mandatory === 'true') {
                            $response['required'][] = $field->column_name;
                        }
                    }
                }
            }

            // Default Fields
            $defaultFieldsMetaApiEndpoint = "https://projectsapi.zoho.{$dataCenter}/restapi/portal/{$portalId}/projects/{$projectId}/bugs/defaultfields/";
            $authorizationHeader['Authorization'] = "Zoho-oauthtoken {$access_token}";
            $defaultFieldsMetaResponse = HttpHelper::get($defaultFieldsMetaApiEndpoint, null, $authorizationHeader);

            if (!is_wp_error($defaultFieldsMetaResponse)) {
                $response['defaultfields'] = $defaultFieldsMetaResponse->defaultfields;
            }
        }

        $response['fields'] = $allFields;
        uksort($response['fields'], 'strnatcasecmp');
        usort($response['required'], 'strnatcasecmp');

        return $response;
    }

    protected static function refreshAccessToken($apiData)
    {
        if (empty($apiData->dataCenter)
            || empty($apiData->clientId)
            || empty($apiData->clientSecret)
            || empty($apiData->tokenDetails)
        ) {
            return false;
        }
        $tokenDetails = $apiData->tokenDetails;

        $dataCenter = $apiData->dataCenter;
        $apiEndpoint = "https://accounts.zoho.{$dataCenter}/oauth/v2/token";
        $requestParams = [
            'grant_type'    => 'refresh_token',
            'client_id'     => $apiData->clientId,
            'client_secret' => $apiData->clientSecret,
            'refresh_token' => $tokenDetails->refresh_token,
        ];

        $apiResponse = HttpHelper::post($apiEndpoint, $requestParams);
        if (is_wp_error($apiResponse) || !empty($apiResponse->error)) {
            return false;
        }
        $tokenDetails->generates_on = time();
        $tokenDetails->access_token = $apiResponse->access_token;

        return $tokenDetails;
    }

    /**
     * Save updated access_token to avoid unnecessary token generation
     *
     * @param int        $formID        ID of Integration related form
     * @param int        $integrationID ID of Zoho crm Integration
     * @param Obeject    $tokenDetails  refreshed token info
     * @param null|mixed $others
     *
     * @return null
     */
    protected static function saveRefreshedToken($formID, $integrationID, $tokenDetails, $others = null)
    {
        if (empty($formID) || empty($integrationID)) {
            return;
        }

        $integrationHandler = new IntegrationHandler($formID, IpTool::getUserDetail());
        $zprojectsDetails = $integrationHandler->getAIntegration($integrationID);

        if (is_wp_error($zprojectsDetails)) {
            return;
        }
        $newDetails = json_decode($zprojectsDetails[0]->integration_details);

        $newDetails->tokenDetails = $tokenDetails;
        if (!empty($others['portals'])) {
            $newDetails->default->portals = $others['portals'];
        }

        $integrationHandler->updateIntegration($integrationID, $zprojectsDetails[0]->integration_name, 'Zoho Projects', wp_json_encode($newDetails), 'form');
    }
}
