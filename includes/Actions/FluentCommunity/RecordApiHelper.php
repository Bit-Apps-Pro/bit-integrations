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
        // Use pro hook if available
        $response = apply_filters('btcbi_fluent_community_remove_user', $data);

        if ($response === $data) {
            // Pro feature not available
            return [
                'success'  => false,
                'messages' => __('This feature is available in Pro version only!', 'bit-integrations')
            ];
        }

        return $response;
    }

    public function addCourse($data)
    {
        // Use pro hook if available
        $response = apply_filters('btcbi_fluent_community_add_course', $data);

        if ($response === $data) {
            // Pro feature not available
            return [
                'success'  => false,
                'messages' => __('This feature is available in Pro version only!', 'bit-integrations')
            ];
        }

        return $response;
    }

    public function removeCourse($data)
    {
        // Use pro hook if available
        $response = apply_filters('btcbi_fluent_community_remove_course', $data);

        if ($response === $data) {
            // Pro feature not available
            return [
                'success'  => false,
                'messages' => __('This feature is available in Pro version only!', 'bit-integrations')
            ];
        }

        return $response;
    }

    public function createPost($data)
    {
        // Use pro hook if available
        $response = apply_filters('btcbi_fluent_community_create_post', $data);

        if ($response === $data) {
            // Pro feature not available
            return [
                'success'  => false,
                'messages' => __('This feature is available in Pro version only!', 'bit-integrations')
            ];
        }

        return $response;
    }

    public function createPoll($data)
    {
        // Use pro hook if available
        $response = apply_filters('btcbi_fluent_community_create_poll', $data);

        if ($response === $data) {
            // Pro feature not available
            return [
                'success'  => false,
                'messages' => __('This feature is available in Pro version only!', 'bit-integrations')
            ];
        }

        return $response;
    }

    public function verifyUser($data)
    {
        // Use pro hook if available
        $response = apply_filters('btcbi_fluent_community_verify_user', $data);

        if ($response === $data) {
            // Pro feature not available
            return [
                'success'  => false,
                'messages' => __('This feature is available in Pro version only!', 'bit-integrations')
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
