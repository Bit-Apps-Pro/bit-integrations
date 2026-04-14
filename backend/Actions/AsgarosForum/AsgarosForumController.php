<?php

namespace BitApps\Integrations\Actions\AsgarosForum;

/**
 * Provide functionality for Asgaros Forum integration.
 */
class AsgarosForumController
{
    public static function asgarosForumAuthorize()
    {
        self::checkPluginExists();
        wp_send_json_success(true);
    }

    public function execute($integrationData, $fieldValues)
    {
        $integrationDetails = $integrationData->flow_details;
        $fieldMap = $integrationDetails->field_map ?? [];

        $recordApiHelper = new RecordApiHelper($integrationDetails, $integrationData->id);

        return $recordApiHelper->execute($fieldValues, $fieldMap);
    }

    private static function checkPluginExists()
    {
        if (!class_exists('AsgarosForum')) {
            wp_send_json_error(__('Asgaros Forum is not activated or not installed', 'bit-integrations'), 400);
        }
    }
}
