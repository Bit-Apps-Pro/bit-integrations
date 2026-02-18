<?php

if (!defined('ABSPATH')) {
    exit;
}
$btcbi_scheme = wp_parse_url(home_url())['scheme'];

define('BTCBI_PLUGIN_BASENAME', plugin_basename(BTCBI_PLUGIN_MAIN_FILE));
define('BTCBI_PLUGIN_BASEDIR', plugin_dir_path(BTCBI_PLUGIN_MAIN_FILE));
define('BTCBI_ROOT_URI', set_url_scheme(plugins_url('', BTCBI_PLUGIN_MAIN_FILE), $btcbi_scheme));
define('BTCBI_PLUGIN_DIR_PATH', plugin_dir_path(BTCBI_PLUGIN_MAIN_FILE));
define('BTCBI_ASSET_URI', BTCBI_ROOT_URI . '/assets');
// Autoload vendor files.

if (is_readable(BTCBI_PLUGIN_BASEDIR . 'vendor/autoload.php')) {
    require_once BTCBI_PLUGIN_BASEDIR . 'vendor/autoload.php';
    BitApps\Integrations\Plugin::load(BTCBI_PLUGIN_MAIN_FILE);
} else {
    add_action('admin_notices', function () {
        echo '<div class="notice notice-error"><p><strong>Bit Integrations:</strong> Required files are missing. Please reinstall the plugin.</p></div>';
    });
}