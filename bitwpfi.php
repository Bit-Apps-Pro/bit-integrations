<?php

/**
 * Plugin Name: Bit Integrations
 * Plugin URI:  https://bitapps.pro/bit-integrations
 * Description: Bit Integrations is a platform that integrates with over 250+ different platforms to help with various tasks on your WordPress site, like WooCommerce, Form builder, Page builder, LMS, Sales funnels, Bookings, CRM, Webhooks, Email marketing, Social media and Spreadsheets, etc
 * Version:     2.4.7
 * Author:    Automation & Integration Plugin - Bit Apps
 * Author URI:  https://bitapps.pro
 * Text Domain: bit-integrations
 * Requires PHP: 7.4
 * Requires at least: 5.1
 * Tested up to: 6.7.1
 * Domain Path: /languages
 * License:  GPLv2 or later
 */

// If try to direct access  plugin folder it will Exit
if (!defined('ABSPATH')) {
    exit;
}

global $btcbi_db_version;
$btcbi_db_version = '1.1';

// Define most essential constants.
define('BTCBI_VERSION', '2.4.7');
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
    if (version_compare(PHP_VERSION, '7.4', '<')) {
        wp_die(
            esc_html__('Bit Integrations requires PHP version 7.4.', 'bit-integrations'),
            esc_html__('Error Activating', 'bit-integrations')
        );
    }
    do_action('btcbi_activation', $network_wide);
}

function btcbi_deactivate_plugin($network_wide)
{
    global $wp_version;
    if (version_compare($wp_version, '5.1', '<')) {
        wp_die(
            esc_html__('This plugin requires WordPress version 5.1 or higher.', 'bit-integrations'),
            esc_html__('Error Deactivating', 'bit-integrations')
        );
    }
    if (version_compare(PHP_VERSION, '7.4', '<')) {
        wp_die(
            esc_html__('Bit Integrations requires PHP version 7.4.', 'bit-integrations'),
            esc_html__('Error Deactivating', 'bit-integrations')
        );
    }
    do_action('btcbi_deactivation', $network_wide);
}

register_activation_hook(__FILE__, 'btcbi_activate_plugin');

register_deactivation_hook(__FILE__, 'btcbi_deactivate_plugin');

function btcbi_uninstall_plugin()
{
    do_action('btcbi_uninstall');
}
register_uninstall_hook(__FILE__, 'btcbi_uninstall_plugin');
