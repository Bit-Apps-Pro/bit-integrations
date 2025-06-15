<?php

namespace BitCode\FI\Core\Util;

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
            $site_ids = $wpdb->get_col("SELECT blog_id FROM {$wpdb->blogs} WHERE site_id = {$wpdb->siteid};");
        }

        return $site_ids;
    }
}
