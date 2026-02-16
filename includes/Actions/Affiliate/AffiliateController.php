<?php

/**
 * Affiliate Integration
 */

namespace BitApps\BTCBI_FI\Actions\Affiliate;

use WP_Error;

/**
 * Provide functionality for Affiliate integration
 */
class AffiliateController
{
    // private $_integrationID;

    // public function __construct($integrationID)
    // {
    //     $this->_integrationID = $integrationID;
    // }

    public static function pluginActive($option = null)
    {
        if (is_plugin_active('affiliate-wp/affiliate-wp.php')) {
            return $option === 'get_name' ? 'affiliate-wp/affiliate-wp.php' : true;
        }

        return false;
    }

    public static function authorizeAffiliate()
    {
        include_once ABSPATH . 'wp-admin/includes/plugin.php';
        if (self::pluginActive()) {
            wp_send_json_success(true, 200);
        }
        // translators: %s: Plugin name
        wp_send_json_error(wp_sprintf(__('%s must be activated!', 'bit-integrations'), 'Affiliate'));
    }

    public static function getAllAffiliate()
    {
        $cache_key = 'btcbi_affiliate_wp_all_affiliates';
        $cache_group = 'btcbi';
        $affiliates = wp_cache_get($cache_key, $cache_group);

        if (false !== $affiliates) {
            return $affiliates;
        }

        $affiliates = [];

        global $wpdb;
        $affiliate_table = esc_sql($wpdb->prefix . 'affiliate_wp_affiliates');
        // phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.PreparedSQL.NotPrepared -- Reading AffiliateWP table directly; static table name with no user input.
        $affiliatesIds = $wpdb->get_results(
            'SELECT affiliate_Id FROM ' . $affiliate_table
        );

        foreach ($affiliatesIds as $val) {
            $affiliates[] = [
                'affiliate_id'   => $val->affiliate_Id,
                'affiliate_name' => affwp_get_affiliate_name($val->affiliate_Id),
            ];
        }

        wp_cache_set($cache_key, $affiliates, $cache_group, 10 * MINUTE_IN_SECONDS);

        return $affiliates;
    }

    public function execute($integrationData, $fieldValues)
    {
        $integrationDetails = $integrationData->flow_details;
        $integId = $integrationData->id;
        $mainAction = $integrationDetails->mainAction;
        $fieldMap = $integrationDetails->field_map;
        if (
            empty($integId)
            || empty($mainAction) || empty($fieldMap)
        ) {
            // translators: %s: Integration name
            return new WP_Error('REQ_FIELD_EMPTY', wp_sprintf(__('module, fields are required for %s api', 'bit-integrations'), 'Affiliate api'));
        }
        $recordApiHelper = new RecordApiHelper($integrationDetails, $integId);
        $affiliateApiResponse = $recordApiHelper->execute(
            $mainAction,
            $fieldValues,
            $integrationDetails,
            $integrationData
        );

        if (is_wp_error($affiliateApiResponse)) {
            return $affiliateApiResponse;
        }

        return $affiliateApiResponse;
    }
}
