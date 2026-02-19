<?php

namespace BitApps\Integrations\controller;

use BitApps\Integrations\Config;
use BitApps\Integrations\Deps\BitApps\WPTelemetry\Telemetry\Telemetry;

final class AnalyticsController
{
    public function filterTrackingData($additional_data)
    {
        global $wpdb;
        $cache_key = Config::withPrefix('analytics_flow_summary');
        $cache_group = Config::VAR_PREFIX;
        $flow = wp_cache_get($cache_key, $cache_group);

        if (false === $flow) {
            $flowTable = esc_sql($wpdb->prefix . Config::VAR_PREFIX . 'flow');
            $logTable = esc_sql($wpdb->prefix . Config::VAR_PREFIX . 'log');

            $query = '
                    SELECT
                        JSON_UNQUOTE(JSON_EXTRACT(flow.flow_details, \'$.type\')) AS ActionName,
                        flow.triggered_entity as TriggerName,
                        flow.status as status,
                        COUNT(log.flow_id) AS count
                    FROM
                        ' . $flowTable . ' flow
                    LEFT JOIN
                        ' . $logTable . ' log ON flow.id = log.flow_id
                    GROUP BY
                        log.flow_id, ActionName, TriggerName, status
                ';

            // phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.PreparedSQL.NotPrepared -- Querying plugin-owned analytics tables directly.
            $flow = $wpdb->get_results($query);
            wp_cache_set($cache_key, $flow, $cache_group, 10 * MINUTE_IN_SECONDS);
        }

        $additional_data['flows'] = $flow;

        return $additional_data;
    }

    public function filterProTrackingData($telemetry_data)
    {
        if (\function_exists('btcbi_pro_activate_plugin')) {
            $pro = [];
            $integrateData = get_option('bit_integrations_pro_integrate_key_data');
            $pro['version'] = BTCBI_PRO_VERSION;
            $pro['hasLicense'] = $integrateData['key'] ? true : false;
            $pro['license'] = $integrateData['key'];
            $pro['status'] = $integrateData['status'];
            $pro['expireAt'] = $integrateData['expireIn'];

            $telemetry_data['pro'] = $pro;
        }

        return $telemetry_data;
    }

    public function analyticsOptIn($data)
    {
        if ($data->isChecked == true) {
            Telemetry::report()->trackingOptIn();

            return true;
        }

        Telemetry::report()->trackingOptOut();

        return false;
    }

    public function analyticsCheck()
    {
        return (bool) (Telemetry::report()->isTrackingAllowed() == true);
    }
}
