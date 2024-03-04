<?php

/**
 * ZohoSheet Integration
 */

namespace BitApps\BTCBI\Http\Services\Actions\MailPoet;

use WP_Error;
use BitApps\BTCBI\Http\Services\Actions\MailPoet\RecordApiHelper;
use BTCBI\Deps\BitApps\WPKit\Http\Response;

/**
 * Provide functionality for ZohoCrm integration
 */
class MailPoetController
{
    //BitApps\BTCBI\Http\Services\Actions\MailPoet\MailPoetController



    /**
     * Validate if Mail Poet plugin exists or not. If not exits then terminate
     * request and send an error response.
     *
     * @return void
     */
    public static function isExists()
    {
        if (!class_exists(\MailPoet\API\API::class)) {
            return Response::error(
                __(
                    'MailPoet is not activate or not installed',
                    'bit-integrations'
                ),
                400
            );
        }
    }
    /**
     * Process ajax request for generate_token
     *
     * @return JSON zoho crm api response and status
     */
    public static function mailPoetAuthorize()
    {
        self::isExists();
        return Response::success(true);
    }
    /**
     * Process ajax request for refresh crm modules
     *
     * @return JSON crm module data
     */

    public function refreshNeswLetter()
    {
        self::isExists();
        $mailpoet_api = \MailPoet\API\API::MP('v1');
        $newsletterList = $mailpoet_api->getLists();

        $allList = [];

        foreach ($newsletterList as $newsletter) {
            $allList[$newsletter['name']] = (object) [
            'newsletterId' => $newsletter['id'],
            'newsletterName' => $newsletter['name']
            ];
        }
        $response['newsletterList'] = $allList;
        return Response::success($response);
    }
    public static function mailPoetListHeaders()
    {
        self::isExists();
        $mailpoet_api = \MailPoet\API\API::MP('v1');
        $subscriber_form_fields = $mailpoet_api->getSubscriberFields();

        $allList = [];

        foreach ($subscriber_form_fields as $fields) {
            $allList[$fields['name']] = (object) [
            'id' => $fields['id'],
            'name' => $fields['name'],
            'required' => $fields['params']['required']
            ];
        }
        $response['mailPoetFields'] = $allList;
        return Response::success($response);
    }

    public function execute($integrationData, $fieldValues)
    {
        $integrationDetails = $integrationData->flow_details;
        $integId = $integrationData->id;
        $fieldMap = $integrationDetails->field_map;
        $defaultDataConf = $integrationDetails->default;
        $lists = $integrationDetails->lists;

        if (empty($fieldMap)) {
            return new WP_Error('REQ_FIELD_EMPTY', __('module, fields are required for Google sheet api', 'bit-integrations'));
        }

        $recordApiHelper = new RecordApiHelper($integId);

        $maiPoetApiResponse = $recordApiHelper->execute(
            $fieldValues,
            $fieldMap,
            $lists
        );

        if (is_wp_error($maiPoetApiResponse)) {
            return $maiPoetApiResponse;
        }
        return $maiPoetApiResponse;
    }
}