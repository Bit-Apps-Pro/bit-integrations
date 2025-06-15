<?php

namespace BitCode\FI\controller;

use BitCode\FI\Config;
use BTCBI\Deps\BitApps\WPTelemetry\Telemetry\Telemetry;

final class BtcbiAnalyticsController
{
    public function filterTrackingData($additional_data)
    {
        global $wpdb;
        $flowTable = $wpdb->prefix . Config::VAR_PREFIX . 'flow';
        $logTable = $wpdb->prefix . Config::VAR_PREFIX . 'log';

        $flow = $wpdb->get_results("
                    SELECT
                        JSON_UNQUOTE(JSON_EXTRACT(flow.flow_details, '$.type')) AS ActionName,
                        flow.triggered_entity as TriggerName,
                        flow.status as status,
                        COUNT(log.flow_id) AS count
                    FROM
                        {$flowTable} flow
                    LEFT JOIN
                        {$logTable} log ON flow.id = log.flow_id
                    GROUP BY
                        log.flow_id, ActionName, TriggerName, status
                ");

        $additional_data['flows'] = $flow;

        return $additional_data;
    }

    public function filterProTrackingData($telemetry_data)
    {
        if (\function_exists('btcbi_pro_activate_plugin')) {
            $pro = [];
            $integrateData = get_option('btcbi_integrate_key_data');
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
        return (bool) (Telemetry::report()->isTrackingAllowed() == true)

        ;
    }
}
