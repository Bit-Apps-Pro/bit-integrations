<?php

namespace BitCode\FI\Core\Util;

/**
 * Class handling plugin uninstallation.
 *
 * @since 1.0.0
 *
 * @access private
 *
 * @ignore
 */
final class UnInstallation
{
    /**
     * Registers functionality through WordPress hooks.
     *
     * @since 1.0.0-alpha
     */
    public function register()
    {
        $option = get_option('btcbi_app_conf');
        if (isset($option->erase_db)) {
            add_action('btcbi_uninstall', [$this, 'uninstall']);
        }
    }

    public function uninstall()
    {
        global $wpdb;
        $freeVersionInstalled = get_option('btcbi_installed');
        $columns = ['btcbi_db_version', 'btcbi_installed', 'btcbi_version'];

        if (!$freeVersionInstalled) {
            $tableArray = [
                $wpdb->prefix . 'btcbi_flow',
                $wpdb->prefix . 'btcbi_log',
            ];
            foreach ($tableArray as $tablename) {
                $wpdb->query($wpdb->prepare("DROP TABLE IF EXISTS {$tablename}"));
            }

            $columns = $columns + ['btcbi_app_conf'];
        }

        foreach ($columns as $column) {
            $wpdb->query($wpdb->prepare("DELETE FROM `{$wpdb->prefix}options` WHERE option_name= %s", $column));
        }
        $wpdb->query($wpdb->prepare("DELETE FROM `{$wpdb->prefix}options` WHERE `option_name` LIKE '%btcbi_webhook_%'"));
    }
}
