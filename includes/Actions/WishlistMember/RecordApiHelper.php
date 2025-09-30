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

    public function createLevel($fieldData)
    {
        if (empty($fieldData['name'])) {
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

        return wlmapi_create_level($fieldData);
    }

    public function updateLevel($fieldData)
    {
        if (empty($fieldData['name']) || empty($fieldData['id'])) {
            return [
                'success' => false,
                'ERROR'   => __('Level id and name are required field.', 'bit-integrations')
            ];
        }

        return self::handleFilterResponse(
            apply_filters('wishlist_update_level', false, $fieldData)
        );
    }

    public function deleteLevel($fieldData)
    {
        if (empty($fieldData['id'])) {
            return [
                'success' => false,
                'ERROR'   => __('Level id is required field.', 'bit-integrations')
            ];
        }

        return self::handleFilterResponse(
            apply_filters('wishlist_delete_level', false, $fieldData)
        );
    }

    public function execute($fieldValues, $fieldMap, $action)
    {
        if (!WishlistMemberController::isPluginInstalled()) {
            return;
        }

        $fieldData = static::setFieldMap($fieldMap, $fieldValues);

        switch ($action) {
            case 'create_level':
                $type = 'level';
                $type_name = 'Create Level';
                $recordApiResponse = $this->createLevel($fieldData);

                break;

            case 'update_level':
                $type = 'level';
                $type_name = 'Update Level';
                $recordApiResponse = $this->updateLevel($fieldData);

                break;

            case 'delete_level':
                $type = 'level';
                $type_name = 'Delete Level';
                $recordApiResponse = $this->deleteLevel($fieldData);

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
        $fieldData = [];

        foreach ($fieldMap as $fieldPair) {
            if (empty($fieldPair->wishlistMemberField)) {
                continue;
            }

            $fieldData[$fieldPair->wishlistMemberField] = ($fieldPair->formField == 'custom' && !empty($fieldPair->customValue))
                ? Common::replaceFieldWithValue($fieldPair->customValue, $fieldValues)
                : $fieldValues[$fieldPair->formField];
        }

        return $fieldData;
    }

    private static function handleFilterResponse($response)
    {
        if ($response !== false) {
            return $response;
        }

        return ['error' => wp_sprintf(__('Failed to connect to WishlistMember. Please check your configuration.', 'bit-integrations'))];
    }
}
