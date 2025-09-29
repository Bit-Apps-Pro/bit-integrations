<?php

/**
 * ZohoRecruit Record Api
 */

namespace BitCode\FI\Actions\WishlistMember;

use BitCode\FI\Core\Util\Common;
use BitCode\FI\Log\LogHandler;
use Exception;

/**
 * Provide functionality for Record insert,upsert
 */
class RecordApiHelper
{
    private $_integrationID;

    private static $wishlistMember_api;

    public function __construct($integId)
    {
        if (!class_exists(\WishlistMember\API\API::class)) {
            return;
        }

        $this->_integrationID = $integId;
        static::$wishlistMember_api = \WishlistMember\API\API::MP('v1');
    }

    public function insertRecord($subscriber, $lists, $actions)
    {
        try {
            // try to find if user is already a subscriber
            $existingSubscriber = static::$wishlistMember_api->getSubscriber($subscriber['email']);

            if (!$existingSubscriber) {
                return static::addSubscriber($subscriber, $lists);
            }

            if (!empty($actions->update)) {
                $response = apply_filters('btcbi_mailpoet_update_subscriber', $existingSubscriber['id'], $subscriber);

                if ($response === $existingSubscriber['id']) {
                    $errorMessages = wp_sprintf(__('%s is not active or not installed', 'bit-integrations'), 'Bit Integrations Pro');
                } elseif (!$response['success']) {
                    $errorMessages = $response('message');
                }

                if (isset($errorMessages)) {
                    LogHandler::save($this->_integrationID, ['type' => 'record', 'type_name' => 'update'], 'error', $errorMessages);
                }
            }

            return static::addSubscribeToLists($existingSubscriber['id'], $lists);
        } catch (\WishlistMember\API\MP\v1\APIException $e) {
            if ($e->getCode() == 4) {
                // Handle the case where the subscriber doesn't exist
                return static::addSubscriber($subscriber, $lists);
            }

            return [
                'success' => false,
                'code'    => $e->getCode(),
                'message' => $e->getMessage()
            ];
        } catch (Exception $e) {
            // Handle other unexpected exceptions
            return [
                'success' => false,
                'code'    => $e->getCode(),
                'message' => $e->getMessage(),
            ];
        }
    }

    public function execute($fieldValues, $fieldMap, $lists, $actions)
    {
        if (!class_exists(\WishlistMember\API\API::class)) {
            return;
        }

        $fieldData = static::setFieldMap($fieldMap, $fieldValues);
        $recordApiResponse = $this->insertRecord($fieldData, $lists, $actions);

        if ($recordApiResponse['success']) {
            LogHandler::save($this->_integrationID, ['type' => 'record', 'type_name' => 'insert'], 'success', $recordApiResponse);
        } else {
            LogHandler::save($this->_integrationID, ['type' => 'record', 'type_name' => 'insert'], 'error', $recordApiResponse);
        }

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
