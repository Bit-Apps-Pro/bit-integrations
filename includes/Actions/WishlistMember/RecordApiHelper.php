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

    public function execute($fieldValues, $fieldMap, $lists, $action)
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

    private static function addSubscriber($subscriber, $lists)
    {
        try {
            $subscriber = static::$wishlistMember_api->addSubscriber($subscriber, $lists);

            return [
                'success' => true,
                'id'      => $subscriber['id'],
            ];
        } catch (\WishlistMember\API\MP\v1\APIException $e) {
            return [
                'success' => false,
                'code'    => $e->getCode(),
                'message' => $e->getMessage(),
            ];
        }
    }

    private static function addSubscribeToLists($subscriber_id, $lists)
    {
        try {
            $subscriber = static::$wishlistMember_api->subscribeToLists($subscriber_id, $lists);

            return [
                'success' => true,
                'id'      => $subscriber['id'],
            ];
        } catch (\WishlistMember\API\MP\v1\APIException $e) {
            return [
                'success' => false,
                'code'    => $e->getCode(),
                'message' => $e->getMessage(),
            ];
        }
    }
}
