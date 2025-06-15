<?php

if (!defined('ABSPATH')) {
    exit;
}
$scheme = wp_parse_url(home_url())['scheme'];
if (!defined('BTCBI_BIT_DEV_URL')) {
    define('BTCBI_BIT_DEV_URL', defined('BITAPPS_DEV') && BITAPPS_DEV ? 'http://localhost:3000' : false);
}
define('BTCBI_PLUGIN_BASENAME', plugin_basename(BTCBI_PLUGIN_MAIN_FILE));
define('BTCBI_PLUGIN_BASEDIR', plugin_dir_path(BTCBI_PLUGIN_MAIN_FILE));
define('BTCBI_ROOT_URI', set_url_scheme(plugins_url('', BTCBI_PLUGIN_MAIN_FILE), $scheme));
define('BTCBI_PLUGIN_DIR_PATH', plugin_dir_path(BTCBI_PLUGIN_MAIN_FILE));
define('BTCBI_ASSET_URI', BTCBI_ROOT_URI . '/assets');
define('BTCBI_ASSET_JS_URI', BTCBI_BIT_DEV_URL ? BTCBI_BIT_DEV_URL : BTCBI_ROOT_URI . '/assets');
// Autoload vendor files.
require_once BTCBI_PLUGIN_BASEDIR . 'vendor/autoload.php';
// Initialize the plugin.
BitCode\FI\Plugin::load(BTCBI_PLUGIN_MAIN_FILE);
