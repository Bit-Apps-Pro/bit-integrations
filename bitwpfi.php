<?php

/**
 * Plugin Name: Bit Integrations
 * Plugin URI:  https://bitapps.pro/bit-integrations
 * Description: Bit Integrations is a platform that integrates with over 200+ different platforms to help with various tasks on your WordPress site, like WooCommerce, Form builder, Page builder, LMS, Sales funnels, Bookings, CRM, Webhooks, Email marketing, Social media and Spreadsheets, etc
 * Version:     1.6.1
 * Author:    Automation & Integration Plugin - Bit Apps
 * Author URI:  https://bitapps.pro
 * Text Domain: bit-integrations
 * Requires PHP: 7.0
 * Requires at least: 5.1
 * Tested up to: 6.4.3
 * Domain Path: /languages
 * License: gpl2+
 */

/***
 * If try to direct access  plugin folder it will Exit
 **/
if (!defined('ABSPATH')) {
    exit;
}
global $btcbi_db_version;
$btcbi_db_version = '1.0';

// Define most essential constants.
define('BTCBI_VERSION', '1.6.1');
define('BTCBI_PLUGIN_MAIN_FILE', __FILE__);

require_once plugin_dir_path(__FILE__) . 'includes/loader.php';
function btcbi_activate_plugin($network_wide)
{
    global $wp_version;
    if (version_compare($wp_version, '5.1', '<')) {
        wp_die(
            esc_html__('This plugin requires WordPress version 5.1 or higher.', 'bit-integrations'),
            esc_html__('Error Activating', 'bit-integrations')
        );
    }
    if (version_compare(PHP_VERSION, '5.6.0', '<')) {
        wp_die(
            esc_html__('Forms Integrationsw requires PHP version 5.6.', 'bit-integrations'),
            esc_html__('Error Activating', 'bit-integrations')
        );
    }
    do_action('btcbi_activation', $network_wide);
}

register_activation_hook(__FILE__, 'btcbi_activate_plugin');

function btcbi_uninstall_plugin()
{
    do_action('btcbi_uninstall');
}
register_uninstall_hook(__FILE__, 'btcbi_uninstall_plugin');
