<?php

namespace BitApps\Integrations\Core\Util;

if (! defined('ABSPATH')) {
    exit;
}

use BitApps\Integrations\Config;
use BitApps\Integrations\Core\Database\DB;
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
        add_action(Config::withPrefix('activation'), [$this, 'install']);

        Hooks::add(Config::withPrefix('activation'), [$this, 'add_capability_to_administrator']);
    }

    public function add_capability_to_administrator()
    {
        $role = get_role('administrator');
        $role->add_cap(Config::withPrefix('manage_integrations'));
        $role->add_cap(Config::withPrefix('view_integrations'));
        $role->add_cap(Config::withPrefix('create_integrations'));
        $role->add_cap(Config::withPrefix('edit_integrations'));
        $role->add_cap(Config::withPrefix('delete_integrations'));
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
        $installed = Config::getOption('installed', get_option('btcbi_installed'));

        if ($installed) {
            $oldVersion = Config::getOption('version', get_option('btcbi_version'));
        }

        if (!$installed || version_compare($oldVersion, Config::VERSION, '!=')) {
            DB::migrate();
            Config::updateOption('installed', time());
        }

        Config::updateOption('version', Config::VERSION);

        // disable free version if pro version is active
        // if (defined('BTCBI_PLUGIN_MAIN_FILE') && is_plugin_active(plugin_basename(BTCBI_PLUGIN_MAIN_FILE))) {
        //     deactivate_plugins(plugin_basename(BTCBI_PLUGIN_MAIN_FILE));
        // }
    }

    public static function handle_new_site(WP_Site $new_site)
    {
        switch_to_blog($new_site->blog_id);

        $plugin = plugin_basename(BITAPPS_INTEGRATIONS_PLUGIN_FILE);

        if (is_plugin_active_for_network($plugin)) {
            // activate_plugin($plugin);
        } else {
            do_action(Config::withPrefix('activation'));
        }

        restore_current_blog();
    }
}
