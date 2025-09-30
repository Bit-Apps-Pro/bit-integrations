<?php

/**
 * Fluent Community Record Api
 */

namespace BitCode\FI\Actions\FluentCommunity;

use BitCode\FI\Log\LogHandler;

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
        error_log('data: ' . print_r($data, true));

        $userId = FluentCommunityController::getUserByEmail($data['email']);

        if (!$userId) {
            return [
                'success'  => false,
                'messages' => __('User not found with this email!', 'bit-integrations')
            ];
        }

        try {
            $spaceId = $data['space_id'];
            $memberRole = $data['member_role'] ?? 'member';
            $by = 'by_automation';

            // Use FluentCommunity Helper
            if (class_exists('\FluentCommunity\App\Services\Helper')) {
                \FluentCommunity\App\Services\Helper::addToSpace($spaceId, $userId, $memberRole, $by);

                $response = [
                    'success'  => true,
                    'messages' => __('User added to space successfully!', 'bit-integrations'),
                    'space_id' => $spaceId,
                    'user_id'  => $userId,
                    'role'     => $memberRole,
                ];
            } else {
                $response = [
                    'success'  => false,
                    'messages' => __('FluentCommunity Helper not available!', 'bit-integrations')
                ];
            }
        } catch (Exception $e) {
            $response = [
                'success'  => false,
                'messages' => $e->getMessage()
            ];
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

        try {
            $spaceId = $data['space_id'];
            $by = 'by_automation';

            // Use FluentCommunity Helper
            if (class_exists('\FluentCommunity\App\Services\Helper')) {
                \FluentCommunity\App\Services\Helper::removeFromSpace($spaceId, $userId, $by);

                $response = [
                    'success'  => true,
                    'messages' => __('User removed from space successfully!', 'bit-integrations'),
                    'space_id' => $spaceId,
                    'user_id'  => $userId,
                ];
            } else {
                $response = [
                    'success'  => false,
                    'messages' => __('FluentCommunity Helper not available!', 'bit-integrations')
                ];
            }
        } catch (Exception $e) {
            $response = [
                'success'  => false,
                'messages' => $e->getMessage()
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

        try {
            $courseId = $data['course_id'];

            // Use FluentCommunity's CourseHelper::enrollCourse() method
            if (class_exists('\FluentCommunity\Modules\Course\Services\CourseHelper')) {
                \FluentCommunity\Modules\Course\Services\CourseHelper::enrollCourse($courseId, $userId);

                $response = [
                    'success'   => true,
                    'messages'  => __('User enrolled in course successfully!', 'bit-integrations'),
                    'course_id' => $courseId,
                    'user_id'   => $userId,
                ];
            } else {
                $response = [
                    'success'  => false,
                    'messages' => __('FluentCommunity CourseHelper not available!', 'bit-integrations')
                ];
            }
        } catch (Exception $e) {
            $response = [
                'success'  => false,
                'messages' => $e->getMessage()
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

        try {
            $courseId = $data['course_id'];

            // Use FluentCommunity's CourseHelper::leaveCourse() method
            if (class_exists('\FluentCommunity\Modules\Course\Services\CourseHelper')) {
                \FluentCommunity\Modules\Course\Services\CourseHelper::leaveCourse($courseId, $userId);

                $response = [
                    'success'   => true,
                    'messages'  => __('User unenrolled from course successfully!', 'bit-integrations'),
                    'course_id' => $courseId,
                    'user_id'   => $userId,
                ];
            } else {
                $response = [
                    'success'  => false,
                    'messages' => __('FluentCommunity CourseHelper not available!', 'bit-integrations')
                ];
            }
        } catch (Exception $e) {
            $response = [
                'success'  => false,
                'messages' => $e->getMessage()
            ];
        }

        return $response;
    }

    public function createPost($data)
    {
        // Get user ID by email
        $userId = FluentCommunityController::getUserByEmail($data['email']);

        if (!$userId) {
            return [
                'success'  => false,
                'messages' => __('User not found with this email!', 'bit-integrations')
            ];
        }

        try {
            $spaceId = $data['post_space_id'];
            $postTitle = $data['post_title'];
            $postMessage = $data['post_message'];

            $feedData = [
                'message'  => stripslashes($postMessage),
                'title'    => stripslashes($postTitle),
                'space_id' => (int) $spaceId,
                'user_id'  => $userId,
            ];

            // Use FluentCommunity FeedsHelper
            if (class_exists('\FluentCommunity\App\Services\FeedsHelper')) {
                $feed = \FluentCommunity\App\Services\FeedsHelper::createFeed($feedData);

                if (is_wp_error($feed)) {
                    $response = [
                        'success'  => false,
                        'messages' => $feed->get_error_message()
                    ];
                } else {
                    $response = [
                        'success'  => true,
                        'messages' => __('Post created in feed successfully!', 'bit-integrations'),
                        'space_id' => $spaceId,
                        'user_id'  => $userId,
                        'feed_id'  => $feed->id,
                        'title'    => $postTitle,
                        'feed_url' => $feed->getPermalink(),
                    ];
                }
            } else {
                $response = [
                    'success'  => false,
                    'messages' => __('FluentCommunity FeedsHelper not available!', 'bit-integrations')
                ];
            }
        } catch (Exception $e) {
            $response = [
                'success'  => false,
                'messages' => $e->getMessage()
            ];
        }

        return $response;
    }

    public function createPoll($data)
    {
        $spaceId = $data['poll_space_id'];
        $userId = FluentCommunityController::getUserByEmail($data['email']);
        $postTitle = $data['post_title'];
        $postMessage = $data['post_message'];
        $pollOptions = $data['poll_options'];

        if (!$userId) {
            return [
                'success'  => false,
                'messages' => __('User not found with this email!', 'bit-integrations')
            ];
        }

        try {
            $feedData = [
                'message'  => stripslashes($postMessage),
                'title'    => stripslashes($postTitle),
                'space_id' => (int) $spaceId,
                'user_id'  => $userId,
                'survey'   => 'survey',
            ];

            // Use FluentCommunity FeedsHelper
            if (class_exists('\FluentCommunity\App\Services\FeedsHelper')) {
                $feed = \FluentCommunity\App\Services\FeedsHelper::createFeed($feedData);

                if (is_wp_error($feed)) {
                    $response = [
                        'success'  => false,
                        'messages' => $feed->get_error_message()
                    ];
                } else {
                    $response = [
                        'success'       => true,
                        'messages'      => __('Poll created in feed successfully!', 'bit-integrations'),
                        'space_id'      => $spaceId,
                        'user_id'       => $userId,
                        'feed_id'       => $feed->id,
                        'poll_question' => $postTitle,
                        'poll_options'  => $pollOptions,
                        'feed_url'      => $feed->getPermalink(),
                    ];
                }
            } else {
                $response = [
                    'success'  => false,
                    'messages' => __('FluentCommunity FeedsHelper not available!', 'bit-integrations')
                ];
            }
        } catch (Exception $e) {
            $response = [
                'success'  => false,
                'messages' => $e->getMessage()
            ];
        }

        return $response;
    }

    public function verifyUser($data)
    {
        $userId = FluentCommunityController::getUserByEmail($data['email']);

        if (!$userId) {
            return [
                'success'  => false,
                'messages' => __('User not found with this email!', 'bit-integrations')
            ];
        }

        $user = get_user_by('ID', $userId);
        if (!$user) {
            return [
                'success'  => false,
                'messages' => __('User not found!', 'bit-integrations')
            ];
        }

        // Get user spaces
        $spaces = [];
        if (class_exists('\FluentCommunity\App\Services\Helper')) {
            $spaces = \FluentCommunity\App\Services\Helper::getUserSpaces($userId);
        }

        // Get user courses
        $courses = [];
        if (class_exists('\FluentCommunity\Modules\Course\Services\CourseHelper')) {
            $course_helper = new \FluentCommunity\Modules\Course\Services\CourseHelper();
            $courses = $course_helper->getUserCourses($userId);
        }

        $profile = [
            'user_id'         => $user->ID,
            'user_login'      => $user->user_login,
            'user_email'      => $user->user_email,
            'display_name'    => $user->display_name,
            'first_name'      => $user->first_name,
            'last_name'       => $user->last_name,
            'user_registered' => $user->user_registered,
            'avatar_url'      => get_avatar_url($user->ID),
            'spaces'          => $spaces,
            'courses'         => $courses,
        ];

        return [
            'success'  => true,
            'messages' => __('User profile verified successfully!', 'bit-integrations'),
            'profile'  => $profile,
        ];
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

        // Add poll_space_id and poll_options if provided
        if (isset($actions->poll_space_id)) {
            $fieldData['poll_space_id'] = $actions->poll_space_id;
        }
        if (isset($actions->poll_options)) {
            $fieldData['poll_options'] = $actions->poll_options;
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
            case 'create-poll':
                $recordApiResponse = $this->createPoll($fieldData);

                break;
            case 'verify-user':
                $recordApiResponse = $this->verifyUser($fieldData);

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
