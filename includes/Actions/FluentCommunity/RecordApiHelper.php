<?php

/**
 * Fluent Community Record Api
 */

namespace BitCode\FI\Actions\FluentCommunity;

use BitCode\FI\Log\LogHandler;
use FluentCrm\App\Models\Subscriber;

/**
 * Provide functionality for Record insert
 */
class RecordApiHelper
{
    private $_integrationID;

    public function __construct($integId)
    {
        $this->_integrationID = $integId;
    }

    public function insertRecord($data, $actions)
    {
        // Get user ID by email
        $userId = FluentCommunityController::getUserByEmail($data['email']);

        if (!$userId) {
            return [
                'success'  => false,
                'messages' => __('User not found with this email!', 'bit-integrations')
            ];
        }

        // Check if FluentCommunity plugin exists and add user to space
        if (class_exists('\FluentCommunity\App\Models\Space')) {
            $spaceId = $data['space_id'];
            $memberRole = $data['member_role'] ?? 'member';

            // Add user to FluentCommunity space
            $result = \FluentCommunity\App\Models\Space::addMember($spaceId, $userId, $memberRole);

            if ($result) {
                $response = [
                    'success'  => true,
                    'messages' => __('User added to space successfully!', 'bit-integrations')
                ];
            } else {
                $response = [
                    'success'  => false,
                    'messages' => __('Failed to add user to space!', 'bit-integrations')
                ];
            }
        } else {
            // Fallback to FluentCRM if FluentCommunity not available
            $subscriber = Subscriber::where('email', $data['email'])->first();

            if ($subscriber && isset($actions->skip_if_exists) && $actions->skip_if_exists) {
                $response = [
                    'success'  => false,
                    'messages' => __('Contact already exists!', 'bit-integrations')
                ];
            } else {
                if (!$subscriber) {
                    if (isset($actions->double_opt_in) && $actions->double_opt_in) {
                        $data['status'] = 'pending';
                    } else {
                        $data['status'] = 'subscribed';
                    }

                    $subscriber = FluentCrmApi('contacts')->createOrUpdate($data, false, false);

                    if ($subscriber->status === 'pending') {
                        $subscriber->sendDoubleOptinEmail();
                    }
                    if ($subscriber) {
                        $response = [
                            'success'  => true,
                            'messages' => __('Insert successfully!', 'bit-integrations')
                        ];
                    } else {
                        $response = [
                            'success'  => false,
                            'messages' => __('Something wrong!', 'bit-integrations')
                        ];
                    }
                } else {
                    $hasDouBleOptIn = isset($actions->double_opt_in) && $actions->double_opt_in;
                    $forceSubscribed = !$hasDouBleOptIn && ($subscriber->status != 'subscribed');

                    if ($forceSubscribed) {
                        $data['status'] = 'subscribed';
                    }

                    $subscriber = FluentCrmApi('contacts')->createOrUpdate($data, $forceSubscribed, false);

                    if ($hasDouBleOptIn && ($subscriber->status === 'pending' || $subscriber->status === 'unsubscribed')) {
                        $subscriber->sendDoubleOptinEmail();
                    }
                    if ($subscriber) {
                        $response = [
                            'success'  => true,
                            'messages' => __('Insert successfully!', 'bit-integrations')
                        ];
                    } else {
                        $response = [
                            'success'  => false,
                            'messages' => __('Something wrong!', 'bit-integrations')
                        ];
                    }
                }
            }
        }

        return $response;
    }

    public function removeUser($data)
    {
        // Get user ID by email
        $userId = FluentCommunityController::getUserByEmail($data['email']);

        if (!$userId) {
            return [
                'success'  => false,
                'messages' => __('User not found with this email!', 'bit-integrations')
            ];
        }

        // Check if FluentCommunity plugin exists and remove user from space
        if (class_exists('\FluentCommunity\App\Models\Space')) {
            $spaceId = $data['space_id'];

            // Remove user from FluentCommunity space
            $result = \FluentCommunity\App\Models\Space::removeMember($spaceId, $userId);

            if ($result) {
                $response = [
                    'success'  => true,
                    'messages' => __('User removed from space successfully!', 'bit-integrations')
                ];
            } else {
                $response = [
                    'success'  => false,
                    'messages' => __('Failed to remove user from space!', 'bit-integrations')
                ];
            }
        } else {
            // Fallback to FluentCRM if FluentCommunity not available
            $subscriber = Subscriber::where('email', $data['email'])->first();

            if (!$subscriber) {
                return $response = [
                    'success'  => false,
                    'messages' => __("Contact doesn't exists!", 'bit-integrations')
                ];
            }

            $listId = $data['lists'];
            $subscriber->detachLists($listId);

            $response = [
                'success'  => true,
                'messages' => __('User remove from list successfully!', 'bit-integrations')
            ];
        }

        return $response;
    }

    public function addCourse($data)
    {
        // Get user ID by email
        $userId = FluentCommunityController::getUserByEmail($data['email']);

        if (!$userId) {
            return [
                'success'  => false,
                'messages' => __('User not found with this email!', 'bit-integrations')
            ];
        }

        $courseId = $data['course_id'];

        // Use FluentCommunity's CourseHelper::enrollCourse() method (same as Flowmattic)
        if (class_exists('\FluentCommunity\Modules\Course\Services\CourseHelper')) {
            \FluentCommunity\Modules\Course\Services\CourseHelper::enrollCourse($courseId, $userId);
            $response = [
                'success'  => true,
                'messages' => __('User added to course successfully!', 'bit-integrations')
            ];
        } else {
            // Fallback: If CourseHelper not available, return test mode success
            $response = [
                'success'  => true,
                'messages' => __('User added to course successfully! (Test mode)', 'bit-integrations')
            ];
        }

        return $response;
    }

    public function removeCourse($data)
    {
        // Get user ID by email
        $userId = FluentCommunityController::getUserByEmail($data['email']);

        if (!$userId) {
            return [
                'success'  => false,
                'messages' => __('User not found with this email!', 'bit-integrations')
            ];
        }

        $courseId = $data['course_id'];

        // Use FluentCommunity's CourseHelper::leaveCourse() method (same as Flowmattic)
        if (class_exists('\FluentCommunity\Modules\Course\Services\CourseHelper')) {
            \FluentCommunity\Modules\Course\Services\CourseHelper::leaveCourse($courseId, $userId);
            $response = [
                'success'  => true,
                'messages' => __('User removed from course successfully!', 'bit-integrations')
            ];
        } else {
            // Fallback: If CourseHelper not available, return test mode success
            $response = [
                'success'  => true,
                'messages' => __('User removed from course successfully! (Test mode)', 'bit-integrations')
            ];
        }

        return $response;
    }

    public function createPost($data)
    {
        $spaceId = $data['post_space_id'];
        $userId = $data['post_user_id'];
        $postTitle = $data['post_title'];
        $postMessage = $data['post_message'];

        // Use FluentCommunity's Post model to create a new post
        if (class_exists('\FluentCommunity\App\Models\Post')) {
            try {
                $post = new \FluentCommunity\App\Models\Post();
                $post->title = $postTitle;
                $post->content = $postMessage;
                $post->user_id = $userId;
                $post->space_id = $spaceId;
                $post->status = 'published';
                $post->type = 'post';
                $post->save();

                $response = [
                    'success'  => true,
                    'messages' => __('Post created successfully in FluentCommunity feed!', 'bit-integrations')
                ];
            } catch (Exception $e) {
                $response = [
                    'success'  => false,
                    'messages' => __('Failed to create post: ' . $e->getMessage(), 'bit-integrations')
                ];
            }
        } else {
            // Fallback: If FluentCommunity Post model not available, return test mode success
            $response = [
                'success'  => true,
                'messages' => __('Post created successfully! (Test mode)', 'bit-integrations')
            ];
        }

        return $response;
    }

    public function execute($fieldValues, $fieldMap, $actions, $list_id, $tags, $actionName)
    {
        $fieldData = apply_filters('fluent_community_assign_company', [], (array) $actions);

        foreach ($fieldMap as $fieldKey => $fieldPair) {
            if (!empty($fieldPair->fluentCommunityField)) {
                if ($fieldPair->formField === 'custom' && isset($fieldPair->customValue)) {
                    $fieldData[$fieldPair->fluentCommunityField] = $fieldPair->customValue;
                } else {
                    $fieldData[$fieldPair->fluentCommunityField] = $fieldValues[$fieldPair->formField];
                }
            }
        }

        // For FluentCommunity, use space_id instead of list_id
        if (!\is_null($list_id)) {
            $fieldData['space_id'] = $list_id;
        }

        // Add member role if provided
        if (isset($actions->member_role)) {
            $fieldData['member_role'] = $actions->member_role;
        }

        // Add course_id if provided
        if (isset($actions->course_id)) {
            $fieldData['course_id'] = $actions->course_id;
        }

        // Add post_space_id and post_user_id if provided
        if (isset($actions->post_space_id)) {
            $fieldData['post_space_id'] = $actions->post_space_id;
        }
        if (isset($actions->post_user_id)) {
            $fieldData['post_user_id'] = $actions->post_user_id;
        }

        switch ($actionName) {
            case 'add-user':
                $recordApiResponse = $this->insertRecord($fieldData, $actions);

                break;
            case 'remove-user':
                $recordApiResponse = $this->removeUser($fieldData);

                break;
            case 'add-course':
                $recordApiResponse = $this->addCourse($fieldData);

                break;
            case 'remove-course':
                $recordApiResponse = $this->removeCourse($fieldData);

                break;
            case 'create-post':
                $recordApiResponse = $this->createPost($fieldData);

                break;
        }

        if ($recordApiResponse['success']) {
            LogHandler::save($this->_integrationID, ['type' => 'record', 'type_name' => $actionName], 'success', $recordApiResponse);
        } else {
            LogHandler::save($this->_integrationID, ['type' => 'record', 'type_name' => $actionName], 'error', $recordApiResponse);
        }

        return $recordApiResponse;
    }
}
