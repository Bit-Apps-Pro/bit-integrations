<?php

if (!defined('ABSPATH')) {
    exit;
}

/** @deprecated 2.7.8 Use BitApps\Integrations\Config instead. */
define('BTCBI_PLUGIN_BASENAME', plugin_basename(BIT_INTEGRATIONS_PLUGIN_FILE));
/** @deprecated 2.7.8 Use BitApps\Integrations\Config instead. */
define('BTCBI_PLUGIN_BASEDIR', plugin_dir_path(BIT_INTEGRATIONS_PLUGIN_FILE));
/** @deprecated 2.7.8 Use BitApps\Integrations\Config instead. */
define('BTCBI_ROOT_URI', set_url_scheme(plugins_url('', BIT_INTEGRATIONS_PLUGIN_FILE), wp_parse_url(home_url())['scheme']));
/** @deprecated 2.7.8 Use BitApps\Integrations\Config instead. */
define('BTCBI_PLUGIN_DIR_PATH', plugin_dir_path(BIT_INTEGRATIONS_PLUGIN_FILE));
/** @deprecated 2.7.8 Use BitApps\Integrations\Config instead. */
define('BTCBI_ASSET_URI', BTCBI_ROOT_URI . '/assets');

if (is_readable(plugin_dir_path(BIT_INTEGRATIONS_PLUGIN_FILE) . 'vendor/autoload.php')) {
    require_once plugin_dir_path(BIT_INTEGRATIONS_PLUGIN_FILE) . 'vendor/autoload.php';
    BitApps\Integrations\Plugin::load(BIT_INTEGRATIONS_PLUGIN_FILE);
} else {
    add_action('admin_notices', function () {
        echo '<div class="notice notice-error"><p><strong>Bit Integrations:</strong> Required files are missing. Please reinstall the plugin.</p></div>';
    });
}
