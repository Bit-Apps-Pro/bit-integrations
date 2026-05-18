<?php

namespace BitApps\Integrations\Actions\WpDataTables;

use WP_Error;

class WpDataTablesController
{
    public static function isExists()
    {
        if (!class_exists('WDTConfigController')) {
            wp_send_json_error(
                __('wpDataTables is not activated or not installed', 'bit-integrations'),
                400
            );
        }
    }

    public static function wpDataTablesAuthorize()
    {
        self::isExists();
        wp_send_json_success(true);
    }

    public function execute($integrationData, $fieldValues)
    {
        $integrationDetails = $integrationData->flow_details;
        $integId            = $integrationData->id;
        $fieldMap           = $integrationDetails->field_map;
        $utilities          = isset($integrationDetails->utilities) ? $integrationDetails->utilities : [];

        if (empty($fieldMap)) {
            return new WP_Error('field_map_empty', __('Field map is empty', 'bit-integrations'));
        }

        $recordApiHelper        = new RecordApiHelper($integrationDetails, $integId);
        $wpDataTablesResponse   = $recordApiHelper->execute($fieldValues, $fieldMap, $utilities);

        if (is_wp_error($wpDataTablesResponse)) {
            return $wpDataTablesResponse;
        }

        return $wpDataTablesResponse;
    }
}
