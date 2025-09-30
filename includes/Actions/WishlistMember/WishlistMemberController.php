<?php

/**
 * ZohoSheet Integration
 */

namespace BitCode\FI\Actions\WishlistMember;

use WP_Error;

/**
 * Provide functionality for ZohoCrm integration
 */
class WishlistMemberController
{
    /**
     * Check if WishlistMember is installed.
     *
     * @return bool
     */
    public static function isPluginInstalled()
    {
        return class_exists('WLMAPI') || class_exists('WishListMember');
    }

    /**
     * Validate if WishlistMember plugin exists or not. If not exits then terminate
     * request and send an error response.
     */
    public static function authorization()
    {
        if (!self::isPluginInstalled()) {
            wp_send_json_error(
                __(
                    'WishlistMember is not activate or not installed',
                    'bit-integrations'
                ),
                400
            );
        }

        wp_send_json_success(true);
    }

    /**
     * Process ajax request for refresh crm modules
     *
     * @return JSON crm module data
     */
    public function refreshNeswLetter()
    {
        self::isExists();
        $mailpoet_api = \WishlistMember\API\API::MP('v1');
        $newsletterList = $mailpoet_api->getLists();

        $allList = [];

        foreach ($newsletterList as $newsletter) {
            $allList[$newsletter['name']] = (object) [
                'newsletterId'   => $newsletter['id'],
                'newsletterName' => $newsletter['name']
            ];
        }
        $response['newsletterList'] = $allList;
        wp_send_json_success($response, 200);
    }

    public static function wishlistMemberListHeaders()
    {
        self::isExists();
        $mailpoet_api = \WishlistMember\API\API::MP('v1');
        $subscriber_form_fields = $mailpoet_api->getSubscriberFields();

        $allList = [];

        foreach ($subscriber_form_fields as $fields) {
            $allList[$fields['name']] = (object) [
                'id'       => $fields['id'],
                'name'     => $fields['name'],
                'required' => $fields['params']['required']
            ];
        }
        $response['wishlistMemberFields'] = $allList;
        wp_send_json_success($response, 200);
    }

    public function execute($integrationData, $fieldValues)
    {
        $integrationDetails = $integrationData->flow_details;
        $integId = $integrationData->id;
        $fieldMap = $integrationDetails->field_map;
        $action = $integrationDetails->action;

        if (empty($fieldMap) || empty($action)) {
            return new WP_Error('REQ_FIELD_EMPTY', wp_sprintf(__('module, fields are required for %s api', 'bit-integrations'), 'Wishlist Member'));
        }

        $recordApiHelper = new RecordApiHelper($integId, $integrationDetails);

        return $recordApiHelper->execute(
            $fieldValues,
            $fieldMap,
            $action
        );
    }
}
