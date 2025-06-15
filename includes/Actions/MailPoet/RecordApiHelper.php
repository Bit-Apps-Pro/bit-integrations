<?php

/**
 * ZohoRecruit Record Api
 */

namespace BitCode\FI\Actions\MailPoet;

use BitCode\FI\Log\LogHandler;
use \MailPoet\API\MP\v1\APIException;

/**
 * Provide functionality for Record insert,upsert
 */
class RecordApiHelper
{
    private $_integrationID;


    public function __construct($integId)
    {
        $this->_integrationID = $integId;
    }

    public function insertRecord($subscriber, $lists)
    {
        $mailpoet_api = \MailPoet\API\API::MP('v1');

        try {
            // try to find if user is already a subscriber
            $existing_subscriber = \MailPoet\Models\Subscriber::findOne($subscriber['email']);
            if (!$existing_subscriber) {
                $response       = $mailpoet_api->addSubscriber($subscriber, $lists);
                $subscriber_id  = $response['id'];
            } else {
                $response       = $mailpoet_api->subscribeToLists($existing_subscriber->id, $lists);
                $subscriber_id  = $existing_subscriber->id;
            }

            $response = [
                'success'   => true,
                'id'        => $subscriber_id
            ];
        } catch (\MailPoet\API\MP\v1\APIException $e) {
            $response = [
                'success' => false,
                'code' => $e->getCode(),
                'message' => $e->getMessage()
            ];
        }
        return $response;
    }

    public function execute($fieldValues, $fieldMap, $lists)
    {
        if (!class_exists(\MailPoet\API\API::class)) {
            return;
        }
        $fieldData = [];

        foreach ($fieldMap as $fieldKey => $fieldPair) {
            if (!empty($fieldPair->mailPoetField)) {
                if ($fieldPair->formField === 'custom' && isset($fieldPair->customValue)) {
                    $fieldData[$fieldPair->mailPoetField] = $fieldPair->customValue;
                } else {
                    $fieldData[$fieldPair->mailPoetField] = $fieldValues[$fieldPair->formField];
                }
            }
        }

        $recordApiResponse = $this->insertRecord($fieldData, $lists);
        if ($recordApiResponse['success']) {
            LogHandler::save($this->_integrationID, ['type' =>  'record', 'type_name' => 'insert'], 'success', $recordApiResponse);
        } else {
            LogHandler::save($this->_integrationID, ['type' =>  'record', 'type_name' => 'insert'], 'error', $recordApiResponse);
        }

        return $recordApiResponse;
    }
}
