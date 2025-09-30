<?php

/**
 * ZohoRecruit Record Api
 */

namespace BitCode\FI\Actions\WishlistMember;

use BitCode\FI\Core\Util\Common;
use BitCode\FI\Log\LogHandler;

/**
 * Provide functionality for Record insert,upsert
 */
class RecordApiHelper
{
    private $_integrationID;

    private $integrationDetails;

    public function __construct($integId, $integrationDetails)
    {
        $this->_integrationID = $integId;
        $this->integrationDetails = $integrationDetails;
    }

    public function createLevel($finalData)
    {
        if (empty($finalData['name'])) {
            return [
                'success' => false,
                'ERROR'   => __('Level name is required field.', 'bit-integrations')
            ];
        }

        if (!\function_exists('wlmapi_create_level')) {
            return [
                'success' => false,
                'ERROR'   => __('WishlistMember API function not available.', 'bit-pi')
            ];
        }

        return wlmapi_create_level($finalData);
    }

    public function updateLevel($finalData)
    {
        if (empty($finalData['name']) || empty($finalData['id'])) {
            return [
                'success' => false,
                'ERROR'   => __('Level id and name are required field.', 'bit-integrations')
            ];
        }

        return self::handleFilterResponse(
            apply_filters('wishlist_update_level', false, $finalData)
        );
    }

    public function deleteLevel($finalData)
    {
        if (empty($finalData['id'])) {
            return [
                'success' => false,
                'ERROR'   => __('Level id is required field.', 'bit-integrations')
            ];
        }

        return self::handleFilterResponse(
            apply_filters('wishlist_delete_level', false, $finalData)
        );
    }

    public function createMember($finalData)
    {
        if (empty($finalData['user_login']) || empty($finalData['user_email'])) {
            return [
                'success' => false,
                'ERROR'   => __('Username, email are required fields.', 'bit-integrations')
            ];
        }

        $levelId = null;

        if (isset($this->integrationDetails->level_id)) {
            $levelId = $this->integrationDetails->level_id;
        }

        return self::handleFilterResponse(
            apply_filters('wishlist_create_member', false, $finalData, $levelId, $this->_integrationID)
        );
    }

    public function updateMember($finalData)
    {
        if (empty($finalData['user_email'])) {
            return [
                'success' => false,
                'ERROR'   => __('Email is a required field.', 'bit-integrations')
            ];
        }

        return self::handleFilterResponse(
            apply_filters('wishlist_update_member', false, $finalData)
        );
    }

    public function deleteMember($finalData)
    {
        if (empty($finalData['user_email'])) {
            return [
                'success' => false,
                'ERROR'   => __('Email is a required field.', 'bit-integrations')
            ];
        }

        return self::handleFilterResponse(
            apply_filters('wishlist_delete_member', false, $finalData)
        );
    }

    public function execute($fieldValues, $fieldMap, $action)
    {
        if (!WishlistMemberController::isPluginInstalled()) {
            return;
        }

        $finalData = static::setFieldMap($fieldMap, $fieldValues);

        switch ($action) {
            case 'create_level':
                $type = 'level';
                $type_name = 'Create Level';
                $recordApiResponse = $this->createLevel($finalData);

                break;

            case 'update_level':
                $type = 'level';
                $type_name = 'Update Level';
                $recordApiResponse = $this->updateLevel($finalData);

                break;

            case 'delete_level':
                $type = 'level';
                $type_name = 'Delete Level';
                $recordApiResponse = $this->deleteLevel($finalData);

                break;

            case 'create_member':
                $type = 'member';
                $type_name = 'Create Member';
                $recordApiResponse = $this->createMember($finalData);

                break;

            case 'update_member':
                $type = 'member';
                $type_name = 'Update Member';
                $recordApiResponse = $this->updateMember($finalData);

                break;

            case 'delete_member':
                $type = 'member';
                $type_name = 'Delete Member';
                $recordApiResponse = $this->deleteMember($finalData);

                break;

            default:
                $type = 'record';
                $type_name = 'insert';
                $recordApiResponse = [
                    'success' => false,
                    'code'    => 'INVALID_ACTION',
                    'message' => wp_sprintf(__('The action %s is not supported.', 'bit-integrations'), $action),
                ];

                break;
        }

        $responseType = $recordApiResponse['success'] ? 'success' : 'error';

        LogHandler::save($this->_integrationID, ['type' => $type, 'type_name' => $type_name], $responseType, wp_json_encode($recordApiResponse));

        return $recordApiResponse;
    }

    private static function setFieldMap($fieldMap, $fieldValues)
    {
        $finalData = [];
        foreach ($fieldMap as $fieldPair) {
            if (empty($fieldPair->wishlistMemberField)) {
                continue;
            }

            $finalData[$fieldPair->wishlistMemberField] = ($fieldPair->formField == 'custom' && !empty($fieldPair->customValue))
            ? Common::replaceFieldWithValue($fieldPair->customValue, $fieldValues)
            : $fieldValues[$fieldPair->formField];
        }

        return $finalData;
    }

    private static function handleFilterResponse($response)
    {
        if ($response !== false) {
            return $response;
        }

        return ['error' => wp_sprintf(__('Failed to connect to WishlistMember. Please check your configuration.', 'bit-integrations'))];
    }
}
