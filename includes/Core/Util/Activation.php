<?php

namespace BitCode\FI\Core\Util;

use BitCode\FI\Core\Database\DB;
use WP_Site;

/**
 * Class handling plugin activation.
 *
 * @since 1.0.0
 */
final class Activation
{
    public function activate()
    {
        add_action('btcbi_activation', [$this, 'install']);

        Hooks::add('btcbi_activation', [$this, 'add_capability_to_administrator']);
    }

    public function add_capability_to_administrator()
    {
        $role = get_role('administrator');
        $role->add_cap('bit_integrations_manage_integrations');
        $role->add_cap('bit_integrations_view_integrations');
        $role->add_cap('bit_integrations_create_integrations');
        $role->add_cap('bit_integrations_edit_integrations');
        $role->add_cap('bit_integrations_delete_integrations');
    }

    public function install($network_wide)
    {
        if ($network_wide && \function_exists('is_multisite') && is_multisite()) {
            $sites = Multisite::all_blog_ids();

            foreach ($sites as $site) {
                switch_to_blog($site);

                $this->installAsSingleSite();

                if ($network_wide) {
                    // activate_plugin(plugin_basename(BTCBI_PLUGIN_MAIN_FILE));
                }

                restore_current_blog();
            }
        } else {
            $this->installAsSingleSite();
        }
    }

    public function installAsSingleSite()
    {
        $installed = get_option('btcbi_installed');

        if ($installed) {
            $oldVersion = get_option('btcbi_version');
        }

        if (!$installed || version_compare($oldVersion, BTCBI_VERSION, '!=')) {
            DB::migrate();
            update_option('btcbi_installed', time());
        }

        update_option('btcbi_version', BTCBI_VERSION);

        // disable free version if pro version is active
        // if (defined('BTCBI_PLUGIN_MAIN_FILE') && is_plugin_active(plugin_basename(BTCBI_PLUGIN_MAIN_FILE))) {
        //     deactivate_plugins(plugin_basename(BTCBI_PLUGIN_MAIN_FILE));
        // }
    }

    public static function handle_new_site(WP_Site $new_site)
    {
        switch_to_blog($new_site->blog_id);

        $plugin = plugin_basename(BTCBI_PLUGIN_MAIN_FILE);

        if (is_plugin_active_for_network($plugin)) {
            // activate_plugin($plugin);
        } else {
            do_action('btcbi_activation');
        }

        restore_current_blog();
    }
}
