<?php

/**
 * NotificationX Integration.
 */

namespace BitApps\Integrations\Actions\NotificationX;

use WP_Error;

/**
 * Provide functionality for NotificationX integration.
 */
class NotificationXController
{
    public static function isExists()
    {
        if (!\defined('NOTIFICATIONX_FILE')) {
            wp_send_json_error(
                __(
                    'NotificationX is not activated or not installed',
                    'bit-integrations'
                ),
                400
            );
        }
    }

    public static function notificationXAuthorize()
    {
        self::isExists();
        wp_send_json_success(true);
    }

    public function execute($integrationData, $fieldValues)
    {
        $integrationDetails = $integrationData->flow_details;
        $integId = $integrationData->id;
        $fieldMap = $integrationDetails->field_map;
        $mainAction = $integrationDetails->mainAction ?? '';

        if (empty($fieldMap)) {
            return new WP_Error('field_map_empty', __('Field map is empty', 'bit-integrations'));
        }

        $recordApiHelper = new RecordApiHelper($integrationDetails, $integId);
        $notificationXResponse = $recordApiHelper->execute($fieldValues, $fieldMap);

        if (is_wp_error($notificationXResponse)) {
            return $notificationXResponse;
        }

        return $notificationXResponse;
    }
}
