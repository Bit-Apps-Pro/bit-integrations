<?php

namespace BitApps\Integrations\Core\Util;

use BitApps\Integrations\Config;

class Multisite
{
    public static function all_blog_ids()
    {
        if (!is_multisite()) {
            return;
        }
        global $wpdb;
        if (\function_exists('get_sites') && \function_exists('get_current_network_id')) {
            $site_ids = get_sites(['fields' => 'ids', 'network_id' => get_current_network_id()]);
        } else {
            $cache_key = Config::withPrefix('multisite_site_ids_') . absint($wpdb->siteid);
            $cache_group = Config::VAR_PREFIX;
            $site_ids = wp_cache_get($cache_key, $cache_group);

            if (false === $site_ids) {
                // phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching -- Fallback query for older multisite APIs.
                $site_ids = $wpdb->get_col($wpdb->prepare("SELECT blog_id FROM {$wpdb->blogs} WHERE site_id = %d", $wpdb->siteid));
                wp_cache_set($cache_key, $site_ids, $cache_group, 10 * MINUTE_IN_SECONDS);
            }
        }

        return $site_ids;
    }
}
