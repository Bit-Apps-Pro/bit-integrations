<?php

/**
 * ZohoRecruit Record Api
 */

namespace BitCode\FI\Actions\ZohoProjects;

use BitCode\FI\Core\Util\ApiResponse as UtilApiResponse;
use BitCode\FI\Core\Util\FieldValueHandler;
use BitCode\FI\Core\Util\HttpHelper;
use BitCode\FI\Log\LogHandler;
use WP_Error;

/**
 * Provide functionality for Record insert,upsert
 */
class RecordApiHelper
{
    private $_defaultHeader;

    private $_apiDomain;

    private $_tokenDetails;

    public function __construct($tokenDetails, $integId, $logID)
    {
        $this->_defaultHeader['Authorization'] = "Zoho-oauthtoken {$tokenDetails->access_token}";
        $this->_defaultHeader['Content-Type'] = 'application/json';
        $this->_apiDomain = urldecode($tokenDetails->api_domain);
        $this->_tokenDetails = $tokenDetails;
        $this->_integrationID = $integId;
        $this->_logID = $logID;
        $this->_logResponse = new UtilApiResponse();
    }

    public function execute($formID, $entryID, $projectsConf, $dataCenter, $fieldMap, $fieldValues)
    {
        $portalId = $projectsConf->portalId;
        $subEvent = $projectsConf->subEvent;
        $actions = $projectsConf->actions;
        $fieldData = [];
        $projectId = '';

        $eventApiResponse = [];

        // Map Field & Actions Start
        foreach ($subEvent as $sEvent) {
            $required = $projectsConf->default->fields->{$portalId}->{$sEvent}->required;
            // Field Mapping
            foreach ($fieldMap->{$sEvent} as $fieldKey => $fieldPair) {
                if (!empty($fieldPair->zohoFormField)) {
                    if ($fieldPair->formField === 'custom' && isset($fieldPair->customValue)) {
                        if (strtok($fieldPair->zohoFormField, '_') === 'cf') {
                            $fieldPair->zohoFormField = str_replace('cf_', '', $fieldPair->zohoFormField);
                            $fieldData[$sEvent]['custom_fields'][$fieldPair->zohoFormField] = $this->testDate($fieldPair->customValue) ? date_format(date_create($fieldPair->customValue), 'm-d-Y') : $fieldPair->customValue;
                        } else {
                            $fieldData[$sEvent][$fieldPair->zohoFormField] = $this->testDate($fieldPair->customValue) ? date_format(date_create($fieldPair->customValue), 'm-d-Y') : $fieldPair->customValue;
                        }
                    } else {
                        if (strtok($fieldPair->zohoFormField, '_') === 'cf') {
                            $fieldPair->zohoFormField = str_replace('cf_', '', $fieldPair->zohoFormField);
                            $fieldData[$sEvent]['custom_fields'][$fieldPair->zohoFormField] = $this->testDate($fieldValues[$fieldPair->formField]) ? date_format(date_create($fieldValues[$fieldPair->formField]), 'm-d-Y') : $fieldValues[$fieldPair->formField];
                        } else {
                            $fieldData[$sEvent][$fieldPair->zohoFormField] = $this->testDate($fieldValues[$fieldPair->formField]) ? date_format(date_create($fieldValues[$fieldPair->formField]), 'm-d-Y') : $fieldValues[$fieldPair->formField];
                        }
                    }
                }
                if (empty($fieldData[$sEvent][$fieldPair->zohoFormField]) && \in_array($fieldPair->zohoFormField, $required)) {
                    $error = new WP_Error('REQ_FIELD_EMPTY', wp_sprintf(__('%s is required for %s', 'bit-integrations'), $fieldPair->zohoFormField, $sEvent));
                    // $this->_logResponse->apiResponse($this->_logID, $this->_integrationID, ['type' => 'record', 'type_name' => 'field'], 'validation', $error);
                    LogHandler::save($this->_integrationID, wp_json_encode(['type' => 'record', 'type_name' => 'validation']), 'error', wp_json_encode($error));

                    return $error;
                }
            }

            if (isset($fieldData[$sEvent]['custom_fields'])) {
                $fieldData[$sEvent]['custom_fields'] = wp_json_encode($fieldData[$sEvent]['custom_fields']);
            }

            // Actions Mapping
            foreach ($actions->{$sEvent} as $fieldKey => $action) {
                if (\in_array($fieldKey, ['tags', 'attachments', 'users', 'timelog', 'bug_followers'])) {
                    continue;
                }
                if ((\gettype($action) === 'object' && \count((array) $action)) || (\gettype($action) === 'string' && !empty($action))) {
                    if ($fieldKey === 'owner') {
                        if ($sEvent === 'task' || $sEvent === 'subtask') {
                            $fieldData[$sEvent]['person_responsible'] = $action;
                        } elseif ($sEvent === 'issue') {
                            $fieldData[$sEvent]['assignee'] = $action;
                        } else {
                            $fieldData[$sEvent]['owner'] = $action;
                        }
                    } elseif ($fieldKey === 'reminder_string' && !empty($action->reminder_criteria)) {
                        if (isset($action->custom_date_fld)) {
                            $action->custom_date = FieldValueHandler::replaceFieldWithValue($action->custom_date_fld, $fieldValues);
                        }
                        if (isset($action->reminder_time_fld)) {
                            $action->reminder_time = FieldValueHandler::replaceFieldWithValue($action->reminder_time_fld, $fieldValues);
                        }

                        if (isset($action->custom_date)) {
                            $action->custom_date = date_format(date_create($action->custom_date), 'm-d-Y');
                        }
                        if (isset($action->reminder_time)) {
                            $action->reminder_time = date('H:i', strtotime($action->reminder_time));
                        }

                        unset($action->custom_date_fld, $action->reminder_time_fld);
                        $fieldData[$sEvent][$fieldKey] = '{"reminder":[' . wp_json_encode($action) . ']}';
                    } elseif ($fieldKey === 'recurrence_string' && !empty($action->recurring_frequency)) {
                        if (isset($action->time_span_fld)) {
                            $action->time_span = FieldValueHandler::replaceFieldWithValue($action->time_span_fld, $fieldValues);
                        }
                        if (isset($action->number_of_occurrences_fld)) {
                            $action->number_of_occurrences = FieldValueHandler::replaceFieldWithValue($action->number_of_occurrences_fld, $fieldValues);
                        }
                        unset($action->time_span_fld, $action->number_of_occurrences_fld);
                        if (!isset($action->time_span)) {
                            $action->time_span = '1';
                        }
                        if (!isset($action->number_of_occurrences)) {
                            $action->number_of_occurrences = '2';
                        }
                        if (!isset($action->is_comments_recurred)) {
                            $action->is_comments_recurred = 'false';
                        }
                        if (!isset($action->set_previous_business_day)) {
                            $action->set_previous_business_day = 'false';
                        }
                        if (!isset($action->recurrence_type)) {
                            $action->recurrence_type = 'specified_interval_creation';
                        }

                        $fieldData[$sEvent]['json_string'] = '{"recurrence":' . wp_json_encode($action) . '}';
                    } else {
                        $fieldData[$sEvent][$fieldKey] = $action;
                    }
                }
            }
        }
        // Map Field & Actions End

        // Create Events Start
        if (\in_array('project', $subEvent)) {
            $apiResponse = $this->createProject($dataCenter, $portalId, $fieldData['project']);

            // if (isset($apiResponse->error)) {
            //     $this->_logResponse->apiResponse($this->_logID, $this->_integrationID, ['type' => 'record', 'type_name' => 'project'], 'error', $apiResponse);
            //     return new WP_Error('project not created');
            // } else {
            //     $this->_logResponse->apiResponse($this->_logID, $this->_integrationID, ['type' => 'record', 'type_name' => 'project'], 'success', $apiResponse);
            // }

            if (isset($apiResponse->error)) {
                LogHandler::save($this->_integrationID, wp_json_encode(['type' => 'record', 'type_name' => 'project']), 'error', wp_json_encode($apiResponse));

                return new WP_Error('project not created');
            }
            LogHandler::save($this->_integrationID, wp_json_encode(['type' => 'record', 'type_name' => 'project']), 'success', wp_json_encode($apiResponse));

            $eventApiResponse['project'] = $apiResponse->projects[0]->id_string;

            if (isset($actions->project->users)) {
                foreach ($actions->project->users as $user) {
                    $data = [
                        'email' => $user->email,
                        'role'  => $user->role
                    ];

                    $apiResponse = $this->associateUsers($dataCenter, $portalId, $eventApiResponse['project'], $data);

                    // if (isset($apiResponse->error)) {
                    //     $this->_logResponse->apiResponse($this->_logID, $this->_integrationID, ['type' => 'user', 'type_name' => 'project'], 'error', $apiResponse);
                    // } else {
                    //     $this->_logResponse->apiResponse($this->_logID, $this->_integrationID, ['type' => 'user', 'type_name' => 'project'], 'success', $apiResponse);
                    // }

                    if (isset($apiResponse->error)) {
                        LogHandler::save($this->_integrationID, wp_json_encode(['type' => 'user', 'type_name' => 'project']), 'error', wp_json_encode($apiResponse));
                    } else {
                        LogHandler::save($this->_integrationID, wp_json_encode(['type' => 'user', 'type_name' => 'project']), 'success', wp_json_encode($apiResponse));
                    }
                }
            }
        }

        if (isset($projectsConf->projectId) && $projectsConf->projectId) {
            $projectId = $projectsConf->projectId;
        } else {
            $projectId = $eventApiResponse['project'];
        }

        if (\in_array('milestone', $subEvent)) {
            $apiResponse = $this->createMilestone($dataCenter, $portalId, $projectId, $fieldData['milestone']);
            $eventApiResponse['milestone'] = $apiResponse->milestones[0]->id_string;
            // if (isset($apiResponse->error)) {
            //     $this->_logResponse->apiResponse($this->_logID, $this->_integrationID, ['type' => 'record', 'type_name' => 'milestone'], 'error', $apiResponse);
            //     return new WP_Error('milestone not created');
            // } else {
            //     $this->_logResponse->apiResponse($this->_logID, $this->_integrationID, ['type' => 'record', 'type_name' => 'milestone'], 'success', $apiResponse);
            // }

            if (isset($apiResponse->error)) {
                LogHandler::save($this->_integrationID, wp_json_encode(['type' => 'record', 'type_name' => 'milestone']), 'error', wp_json_encode($apiResponse));

                return new WP_Error('milestone not created');
            }
            LogHandler::save($this->_integrationID, wp_json_encode(['type' => 'record', 'type_name' => 'milestone']), 'success', wp_json_encode($apiResponse));
        }

        if (\in_array('tasklist', $subEvent)) {
            if (isset($projectsConf->milestoneId) && $projectsConf->milestoneId) {
                $fieldData['tasklist']['milestone_id'] = $projectsConf->milestoneId;
            } elseif (\array_key_exists('milestone', $eventApiResponse)) {
                $fieldData['tasklist']['milestone_id'] = $eventApiResponse['milestone'];
            }
            $apiResponse = $this->createTasklist($dataCenter, $portalId, $projectId, $fieldData['tasklist']);
            $eventApiResponse['tasklist'] = $apiResponse->tasklists[0]->id_string;
            // if (isset($apiResponse->error)) {
            //     $this->_logResponse->apiResponse($this->_logID, $this->_integrationID, ['type' => 'record', 'type_name' => 'tasklist'], 'error', $apiResponse);
            //     return new WP_Error('tasklist not created');
            // } else {
            //     $this->_logResponse->apiResponse($this->_logID, $this->_integrationID, ['type' => 'record', 'type_name' => 'tasklist'], 'success', $apiResponse);
            // }

            if (isset($apiResponse->error)) {
                LogHandler::save($this->_integrationID, wp_json_encode(['type' => 'record', 'type_name' => 'tasklist']), 'error', wp_json_encode($apiResponse));

                return new WP_Error('tasklist not created');
            }
            LogHandler::save($this->_integrationID, wp_json_encode(['type' => 'record', 'type_name' => 'tasklist']), 'success', wp_json_encode($apiResponse));
        }

        if (\in_array('task', $subEvent)) {
            if (isset($projectsConf->tasklistId) && $projectsConf->tasklistId) {
                $fieldData['task']['tasklist_id'] = $projectsConf->tasklistId;
            } elseif (\array_key_exists('tasklist', $eventApiResponse)) {
                $fieldData['task']['tasklist_id'] = $eventApiResponse['tasklist'];
            }
            $apiResponse = $this->createTask($dataCenter, $portalId, $projectId, $fieldData['task']);
            $eventApiResponse['task'] = $apiResponse->tasks[0]->id_string;
            // if (isset($apiResponse->error)) {
            //     $this->_logResponse->apiResponse($this->_logID, $this->_integrationID, ['type' => 'record', 'type_name' => 'task'], 'error', $apiResponse);
            //     return new WP_Error('task not created');
            // } else {
            //     $this->_logResponse->apiResponse($this->_logID, $this->_integrationID, ['type' => 'record', 'type_name' => 'task'], 'success', $apiResponse);
            // }

            if (isset($apiResponse->error)) {
                LogHandler::save($this->_integrationID, wp_json_encode(['type' => 'record', 'type_name' => 'task']), 'error', wp_json_encode($apiResponse));

                return new WP_Error('task not created');
            }
            LogHandler::save($this->_integrationID, wp_json_encode(['type' => 'record', 'type_name' => 'task']), 'success', wp_json_encode($apiResponse));
        }

        if (\in_array('subtask', $subEvent)) {
            $taskId = '';
            if (isset($projectsConf->taskId) && $projectsConf->taskId) {
                $taskId = $projectsConf->taskId;
            } else {
                $taskId = $eventApiResponse['task'];
            }
            $apiResponse = $this->createSubTask($dataCenter, $portalId, $projectId, $taskId, $fieldData['subtask']);
            $eventApiResponse['subtask'] = $apiResponse->tasks[0]->id_string;
            // if (isset($apiResponse->error)) {
            //     $this->_logResponse->apiResponse($this->_logID, $this->_integrationID, ['type' => 'record', 'type_name' => 'subtask'], 'error', $apiResponse);
            //     return new WP_Error('subtask not created');
            // } else {
            //     $this->_logResponse->apiResponse($this->_logID, $this->_integrationID, ['type' => 'record', 'type_name' => 'subtask'], 'success', $apiResponse);
            // }

            if (isset($apiResponse->error)) {
                LogHandler::save($this->_integrationID, wp_json_encode(['type' => 'record', 'type_name' => 'subtask']), 'error', wp_json_encode($apiResponse));

                return new WP_Error('subtask not created');
            }
            LogHandler::save($this->_integrationID, wp_json_encode(['type' => 'record', 'type_name' => 'subtask']), 'success', wp_json_encode($apiResponse));
        }

        if (\in_array('issue', $subEvent)) {
            if (isset($projectsConf->milestoneId) && $projectsConf->milestoneId) {
                $fieldData['issue']['milestone_id'] = $projectsConf->milestoneId;
            } elseif (\array_key_exists('milestone', $eventApiResponse)) {
                $fieldData['issue']['milestone_id'] = $eventApiResponse['milestone'];
            }
            $apiResponse = $this->createIssue($dataCenter, $portalId, $projectId, $fieldData['issue']);
            $eventApiResponse['issue'] = $apiResponse->bugs[0]->id_string;
            // if (isset($apiResponse->error)) {
            //     $this->_logResponse->apiResponse($this->_logID, $this->_integrationID, ['type' => 'record', 'type_name' => 'issue'], 'error', $apiResponse);
            //     return new WP_Error('issue not created');
            // } else {
            //     $this->_logResponse->apiResponse($this->_logID, $this->_integrationID, ['type' => 'record', 'type_name' => 'issue'], 'success', $apiResponse);
            // }

            if (isset($apiResponse->error)) {
                LogHandler::save($this->_integrationID, wp_json_encode(['type' => 'record', 'type_name' => 'issue']), 'error', wp_json_encode($apiResponse));

                return new WP_Error('issue not created');
            }
            LogHandler::save($this->_integrationID, wp_json_encode(['type' => 'record', 'type_name' => 'issue']), 'success', wp_json_encode($apiResponse));

            if (isset($actions->issue->bug_followers)) {
                $bug_followers = explode(',', $actions->issue->bug_followers);
                foreach ($bug_followers as $follower) {
                    $data = [
                        'bug_followers' => $follower
                    ];

                    $apiResponse = $this->addBugFollower($dataCenter, $portalId, $projectId, $eventApiResponse['issue'], $data);
                    // if (isset($apiResponse->error)) {
                    //     $this->_logResponse->apiResponse($this->_logID, $this->_integrationID, ['type' => 'follower', 'type_name' => 'issue'], 'error', $apiResponse);
                    // } else {
                    //     $this->_logResponse->apiResponse($this->_logID, $this->_integrationID, ['type' => 'follower', 'type_name' => 'issue'], 'success', $apiResponse);
                    // }

                    if (isset($apiResponse->error)) {
                        LogHandler::save($this->_integrationID, wp_json_encode(['type' => 'follower', 'type_name' => 'issue']), 'error', wp_json_encode($apiResponse));
                    } else {
                        LogHandler::save($this->_integrationID, wp_json_encode(['type' => 'follower', 'type_name' => 'issue']), 'success', wp_json_encode($apiResponse));
                    }
                }
            }
        }
        // Create Events End

        // Actions Start
        foreach ($eventApiResponse as $eventKey => $eventId) {
            // Attachments
            if (isset($actions->{$eventKey}->attachments)) {
                $filesApiHelper = new FilesApiHelper($this->_tokenDetails, $formID, $entryID);
                $fileFound = 0;
                $responseType = 'success';
                $attachmentApiResponses = [];
                $attachments = explode(',', $actions->{$eventKey}->attachments);
                foreach ($attachments as $fileField) {
                    if (isset($fieldValues[$fileField]) && !empty($fieldValues[$fileField])) {
                        $fileFound = 1;
                        if (\is_array($fieldValues[$fileField])) {
                            foreach ($fieldValues[$fileField] as $singleFile) {
                                $attachmentApiResponse = $filesApiHelper->uploadFiles($singleFile, $portalId, $projectId, $eventKey, $eventId, $dataCenter);
                                if (isset($attachmentApiResponse->error)) {
                                    $responseType = 'error';
                                }
                                $attachmentApiResponses[] = $attachmentApiResponse;
                            }
                        } else {
                            $attachmentApiResponse = $filesApiHelper->uploadFiles($fieldValues[$fileField], $portalId, $projectId, $eventKey, $eventId, $dataCenter);
                            if (isset($attachmentApiResponse->error)) {
                                $responseType = 'error';
                            }
                            $attachmentApiResponses[] = $attachmentApiResponse;
                        }
                    }
                }
                if ($fileFound) {
                    // $this->_logResponse->apiResponse($this->_logID, $this->_integrationID, ['type' => 'file', 'type_name' => $eventKey], $responseType, $attachmentApiResponses);

                    LogHandler::save($this->_integrationID, wp_json_encode(['type' => 'file', 'type_name' => $eventKey]), $responseType, wp_json_encode($attachmentApiResponses));
                }
            }

            // Tags
            if (isset($actions->{$eventKey}->tags) || isset($actions->{$eventKey}->customTags)) {
                $tag_ids = '';
                if (isset($actions->{$eventKey}->customTags) && \count($actions->{$eventKey}->customTags)) {
                    $tags = [];
                    foreach ($actions->{$eventKey}->customTags as $tag) {
                        $tag_found = 0;
                        $tag_name = FieldValueHandler::replaceFieldWithValue($tag->name, $fieldValues);

                        $old_tags = $this->getAllTags($dataCenter, $portalId)->tags;

                        foreach ($old_tags as $old_tag) {
                            if ($old_tag->name === $tag_name) {
                                $tag_ids .= ($tag_ids ? ',' : '') . $old_tag->id;
                                $tag_found = 1;

                                break;
                            }
                        }

                        if (!$tag_found) {
                            $tags[] = (object) [
                                'name'        => $tag_name,
                                'color_class' => $tag->color ? $tag->color : 'bg15a8e2'
                            ];
                        }
                    }
                    if (\count($tags)) {
                        $data['tags'] = wp_json_encode($tags);
                        $apiResponse = $this->createTags($dataCenter, $portalId, $data);
                        // if (isset($apiResponse->error)) {
                        //     $this->_logResponse->apiResponse($this->_logID, $this->_integrationID, ['type' => 'tag', 'type_name' => $eventKey], 'error', $apiResponse);
                        // } else {
                        //     $this->_logResponse->apiResponse($this->_logID, $this->_integrationID, ['type' => 'tag', 'type_name' => $eventKey], 'success', $apiResponse);
                        // }

                        if (isset($apiResponse->error)) {
                            LogHandler::save($this->_integrationID, wp_json_encode(['type' => 'tag', 'type_name' => $eventKey]), 'error', wp_json_encode($apiResponse));
                        } else {
                            LogHandler::save($this->_integrationID, wp_json_encode(['type' => 'tag', 'type_name' => $eventKey]), 'success', wp_json_encode($apiResponse));
                        }

                        foreach ($apiResponse->tags as $tag) {
                            $tag_ids .= ($tag_ids ? ',' : '') . $tag->id;
                        }
                    }
                }

                if (isset($actions->{$eventKey}->tags)) {
                    $tags = explode(',', $actions->{$eventKey}->tags);
                    foreach ($tags as $tag) {
                        $tag_name = FieldValueHandler::replaceFieldWithValue($tag, $fieldValues);
                        $tag_ids .= (!empty($tag_ids) ? ',' : '') . $tag_name;
                    }
                }

                $tagEntitySeq = ['project' => 2, 'milestone' => 3, 'tasklist' => 4, 'task' => 5, 'subtask' => 5, 'issue' => 6];
                $data = [
                    'tag_id'     => $tag_ids,
                    'entity_id'  => $eventId,
                    'entityType' => $tagEntitySeq[$eventKey]
                ];

                $apiResponse = $this->associateTags($dataCenter, $portalId, $projectId, $data);
                // if (isset($apiResponse->error)) {
                //     $this->_logResponse->apiResponse($this->_logID, $this->_integrationID, ['type' => 'tag', 'type_name' => $eventKey], 'error', $apiResponse);
                // } else {
                //     $this->_logResponse->apiResponse($this->_logID, $this->_integrationID, ['type' => 'tag', 'type_name' => $eventKey], 'success', (object) ['code' => 200, 'message' => 'tags associated successfully']);
                // }

                if (isset($apiResponse->error)) {
                    LogHandler::save($this->_integrationID, wp_json_encode(['type' => 'tag', 'type_name' => $eventKey]), 'error', wp_json_encode($apiResponse));
                } else {
                    LogHandler::save($this->_integrationID, wp_json_encode(['type' => 'tag', 'type_name' => $eventKey]), 'success', wp_json_encode($apiResponse));
                }
            }

            // Time Log
            if (isset($actions->{$eventKey}->timelog)) {
                $timelog = $actions->{$eventKey}->timelog;
                if (isset($timelog->date_fld)) {
                    $timelog->date = FieldValueHandler::replaceFieldWithValue($timelog->date_fld, $fieldValues);
                }
                if (isset($timelog->hours_fld)) {
                    $timelog->hours = FieldValueHandler::replaceFieldWithValue($timelog->hours_fld, $fieldValues);
                }
                if (isset($timelog->notes_fld)) {
                    $timelog->notes = FieldValueHandler::replaceFieldWithValue($timelog->notes_fld, $fieldValues);
                }
                if (isset($timelog->start_time_fld)) {
                    $timelog->start_time = FieldValueHandler::replaceFieldWithValue($timelog->start_time_fld, $fieldValues);
                }
                if (isset($timelog->end_time_fld)) {
                    $timelog->end_time = FieldValueHandler::replaceFieldWithValue($timelog->end_time_fld, $fieldValues);
                }

                if (isset($timelog->start_time, $timelog->end_time)) {
                    $diff = abs(strtotime($timelog->end_time) - strtotime($timelog->start_time));
                    $tmins = $diff / 60;
                    $hours = floor($tmins / 60);
                    $mins = $tmins % 60;
                    $timelog->hours = "{$hours}:{$mins}";
                }

                unset($timelog->date_fld, $timelog->hours_fld, $timelog->notes_fld, $timelog->start_time, $timelog->start_time_fld, $timelog->end_time, $timelog->end_time_fld, $timelog->settime);

                $timelog->date = date_format(date_create($timelog->date), 'm-d-Y');
                $timelog->notes = $timelog->notes;
                if (!isset($timelog->hours)) {
                    $timelog->hours = '0';
                }
                $apiResponse = $this->addTimeLog($dataCenter, $portalId, $projectId, $eventKey, $eventId, $timelog);
                // if (isset($apiResponse->error)) {
                //     $this->_logResponse->apiResponse($this->_logID, $this->_integrationID, ['type' => 'timelog', 'type_name' => $eventKey], 'error', $apiResponse);
                // } else {
                //     $this->_logResponse->apiResponse($this->_logID, $this->_integrationID, ['type' => 'timelog', 'type_name' => $eventKey], 'success', $apiResponse);
                // }

                if (isset($apiResponse->error)) {
                    LogHandler::save($this->_integrationID, wp_json_encode(['type' => 'timelog', 'type_name' => $eventKey]), 'error', wp_json_encode($apiResponse));
                } else {
                    LogHandler::save($this->_integrationID, wp_json_encode(['type' => 'timelog', 'type_name' => $eventKey]), 'success', wp_json_encode($apiResponse));
                }
            }
        }
        // Actions End
    }

    private function createProject($dataCenter, $portalId, $data)
    {
        $createProjectEndpoint = "https://projectsapi.zoho.{$dataCenter}/restapi/portal/{$portalId}/projects/";

        $createProjectEndpoint .= '?' . http_build_query($data);

        return HttpHelper::post($createProjectEndpoint, null, $this->_defaultHeader);
    }

    private function createMilestone($dataCenter, $portalId, $projectId, $data)
    {
        $createMilestoneEndpoint = "https://projectsapi.zoho.{$dataCenter}/restapi/portal/{$portalId}/projects/{$projectId}/milestones/";

        $createMilestoneEndpoint .= '?' . http_build_query($data);

        return HttpHelper::post($createMilestoneEndpoint, null, $this->_defaultHeader);
    }

    private function createTasklist($dataCenter, $portalId, $projectId, $data)
    {
        $createTasklistEndpoint = "https://projectsapi.zoho.{$dataCenter}/restapi/portal/{$portalId}/projects/{$projectId}/tasklists/";

        $createTasklistEndpoint .= '?' . http_build_query($data);

        return HttpHelper::post($createTasklistEndpoint, null, $this->_defaultHeader);
    }

    private function createTask($dataCenter, $portalId, $projectId, $data)
    {
        $createTaskEndpoint = "https://projectsapi.zoho.{$dataCenter}/restapi/portal/{$portalId}/projects/{$projectId}/tasks/";

        $createTaskEndpoint .= '?' . http_build_query($data);

        return HttpHelper::post($createTaskEndpoint, null, $this->_defaultHeader);
    }

    private function createSubTask($dataCenter, $portalId, $projectId, $taskId, $data)
    {
        $createSubTaskEndpoint = "https://projectsapi.zoho.{$dataCenter}/restapi/portal/{$portalId}/projects/{$projectId}/tasks/{$taskId}/subtasks/";

        $createSubTaskEndpoint .= '?' . http_build_query($data);

        return HttpHelper::post($createSubTaskEndpoint, null, $this->_defaultHeader);
    }

    private function createIssue($dataCenter, $portalId, $projectId, $data)
    {
        $createIssueEndpoint = "https://projectsapi.zoho.{$dataCenter}/restapi/portal/{$portalId}/projects/{$projectId}/bugs/";

        $createIssueEndpoint .= '?' . http_build_query($data);

        return HttpHelper::post($createIssueEndpoint, null, $this->_defaultHeader);
    }

    private function getAllTags($dataCenter, $portalId)
    {
        $tagsMetaApiEndpoint = "https://projectsapi.zoho.{$dataCenter}/api/v3/portal/{$portalId}/tags?range=10000";

        return HttpHelper::get($tagsMetaApiEndpoint, null, $this->_defaultHeader);
    }

    private function createTags($dataCenter, $portalId, $data)
    {
        $createTagsEndpoint = "https://projectsapi.zoho.{$dataCenter}/api/v3/portal/{$portalId}/tags";

        $createTagsEndpoint .= '?' . http_build_query($data);

        return HttpHelper::post($createTagsEndpoint, null, $this->_defaultHeader);
    }

    private function associateTags($dataCenter, $portalId, $projectId, $data)
    {
        $associateTagEndpoint = "https://projectsapi.zoho.{$dataCenter}/api/v3/portal/{$portalId}/projects/{$projectId}/tags/associate";

        $associateTagEndpoint .= '?' . http_build_query($data);

        return HttpHelper::post($associateTagEndpoint, null, $this->_defaultHeader);
    }

    private function associateUsers($dataCenter, $portalId, $projectId, $data)
    {
        $associateUsersEndpoint = "https://projectsapi.zoho.{$dataCenter}/restapi/portal/{$portalId}/projects/{$projectId}/users/";

        $associateUsersEndpoint .= '?' . http_build_query($data);

        return HttpHelper::post($associateUsersEndpoint, null, $this->_defaultHeader);
    }

    private function addBugFollower($dataCenter, $portalId, $projectId, $bugId, $data)
    {
        $addBugFollowerEndpoint = "https://projectsapi.zoho.{$dataCenter}/restapi/portal/{$portalId}/projects/{$projectId}/bugs/{$bugId}/bugfollowers/";

        $addBugFollowerEndpoint .= '?' . http_build_query($data);

        return HttpHelper::post($addBugFollowerEndpoint, null, $this->_defaultHeader);
    }

    private function addTimeLog($dataCenter, $portalId, $projectId, $event, $eventId, $data)
    {
        $addTimeLogEndpoint = "https://projectsapi.zoho.{$dataCenter}/restapi/portal/{$portalId}/projects/{$projectId}/" . (\in_array($event, ['task', 'subtask']) ? 'tasks' : 'bugs') . "/{$eventId}/logs/";

        $addTimeLogEndpoint .= '?' . http_build_query($data);

        return HttpHelper::post($addTimeLogEndpoint, null, $this->_defaultHeader);
    }

    private function testDate($x)
    {
        return (bool) (date('Y-m-d', strtotime($x)) == $x)

        ;
    }
}
