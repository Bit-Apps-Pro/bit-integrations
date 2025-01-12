<?php

namespace BitCode\FI;

/**
 * Main class for the plugin.
 *
 * @since 1.0.0-alpha
 */

use BitCode\FI\Admin\Admin_Bar;
use BitCode\FI\Core\Database\DB;
use BitCode\FI\Core\Hooks\HookService;
use BitCode\FI\Core\Util\Activation;
use BitCode\FI\Core\Util\Capabilities;
use BitCode\FI\Core\Util\Deactivation;
use BitCode\FI\Core\Util\Hooks;
use BitCode\FI\Core\Util\Request;
use BitCode\FI\Core\Util\UnInstallation;
use BitCode\FI\Log\LogHandler;
use BTCBI\Deps\BitApps\WPTelemetry\Telemetry\Telemetry;
use BTCBI\Deps\BitApps\WPTelemetry\Telemetry\TelemetryConfig;

final class Plugin
{
    /**
     * Main instance of the plugin.
     *
     * @since 1.0.0-alpha
     *
     * @var Plugin|null
     */
    private static $_instance;

    /**
     * Initialize the hooks
     *
     * @return void
     */
    public function initialize()
    {
        Hooks::add('plugins_loaded', [$this, 'init_plugin'], 12);
        (new Activation())->activate();
        (new Deactivation())->register();
        (new UnInstallation())->register();

        $this->initWPTelemetry();
    }

    public function init_plugin()
    {
        Hooks::add('init', [$this, 'init_classes'], 8);
        Hooks::add('init', [$this, 'localization_setup']);
        Hooks::add('btcbi_delete_integ_log', [$this, 'integrationlogDelete'], PHP_INT_MAX);
        Hooks::filter('plugin_action_links_' . plugin_basename(BTCBI_PLUGIN_MAIN_FILE), [$this, 'plugin_action_links']);
        Hooks::filter('cron_schedules', [$this, 'every_week_time_cron']);

        $this->btcbi_delete_log_scheduler();
    }

    public function every_week_time_cron($schedules)
    {
        $schedules['every_week'] = [
            'interval' => 604800, // 604800 seconds in 1 week
            'display'  => esc_html__('Every Week', 'bit-integrations')
        ];

        return $schedules;
    }

    public function btcbi_delete_log_scheduler()
    {
        if (!wp_next_scheduled('btcbi_delete_integ_log')) {
            wp_schedule_event(time(), 'every_week', 'btcbi_delete_integ_log');
        }
    }

    public function initWPTelemetry()
    {
        TelemetryConfig::setSlug(Config::SLUG);
        TelemetryConfig::setTitle(Config::TITLE);
        TelemetryConfig::setVersion(Config::VERSION);
        TelemetryConfig::setPrefix(Config::VAR_PREFIX);

        TelemetryConfig::setServerBaseUrl('https://wp-api.bitapps.pro/public/');
        TelemetryConfig::setTermsUrl('https://bitapps.pro/terms-of-service/');
        TelemetryConfig::setPolicyUrl('https://bitapps.pro/privacy-policy/');

        Telemetry::report()->addPluginData()->init();
        Telemetry::feedback()->init();
    }

    /**
     * Instantiate the required classes
     *
     * @return void
     */
    public function init_classes()
    {
        static::update_tables();
        if (Request::Check('admin')) {
            (new Admin_Bar())->register();
        }
        new HookService();
    }

    /**
     * Initially load the plugin text domain
     *
     * @return void
     */
    public function localization_setup()
    {
        load_plugin_textdomain('bit-integrations', false, basename(BTCBI_PLUGIN_BASEDIR) . '/languages');
    }

    /**
     * Plugin action links
     *
     * @param array $links
     *
     * @return array
     */
    public function plugin_action_links($links)
    {
        $links[] = '<a href="https://docs.bit-integrations.bitapps.pro" target="_blank">' . __('Docs', 'bit-integrations') . '</a>';

        return $links;
    }

    /**
     * Retrieves the main instance of the plugin.
     *
     * @since 1.0.0-alpha
     *
     * @return Plugin main instance.
     */
    public static function instance()
    {
        return static::$_instance;
    }

    public static function update_tables()
    {
        if (!(Capabilities::Check('manage_options') || Capabilities::Check('bit_integrations_manage_integrations') || Capabilities::Check('bit_integrations_edit_integrations'))) {
            return;
        }
        global $btcbi_db_version;
        $installed_db_version = get_site_option('btcbi_db_version');
        if ($installed_db_version != $btcbi_db_version) {
            DB::migrate();
        }
    }

    /**
     * Loads the plugin main instance and initializes it.
     *
     * @since 1.0.0-alpha
     *
     * @param string $main_file Absolute path to the plugin main file.
     *
     * @return bool True if the plugin main instance could be loaded, false otherwise./
     */
    public static function integrationlogDelete()
    {
        $option = get_option('btcbi_app_conf');
        if (isset($option->enable_log_del, $option->day)) {
            LogHandler::logAutoDelte($option->day);
        }
    }

    public static function load($main_file)
    {
        if (null !== static::$_instance) {
            return false;
        }
        static::$_instance = new static($main_file);
        static::$_instance->initialize();

        return true;
    }
}
