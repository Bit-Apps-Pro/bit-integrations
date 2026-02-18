<?php

// phpcs:disable Squiz.NamingConventions.ValidVariableName

namespace BitApps\Integrations;

// use BitApps\BTCBI\Views\Layout;

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Provides App configurations.
 */
class Config
{
    public const SLUG = 'bit-integrations';

    public const TITLE = 'Bit Integrations';

    public const VAR_PREFIX = 'bit_integrations_';

    public const VERSION = '2.7.8';

    public const DB_VERSION = '1.1';

    public const REQUIRED_PHP_VERSION = '7.4';

    public const REQUIRED_WP_VERSION = '5.1';

    public const API_VERSION = '1.0';

    /**
     * Provides configuration for plugin.
     *
     * @param string $type    Type of conf
     * @param string $default Default value
     *
     * @return array|string|null
     */
    public static function get($type, $default = null)
    {
        switch ($type) {
            case 'MAIN_FILE':
                return BITAPPS_INTEGRATIONS_PLUGIN_FILE;

            case 'BASENAME':
                return plugin_basename(trim(self::get('MAIN_FILE')));

            case 'BASEDIR':
                return plugin_dir_path(self::get('MAIN_FILE'));

            case 'BACKEND_DIR':
                return plugin_dir_path(self::get('MAIN_FILE')) . 'backend';

            case 'SITE_URL':
                $parsedUrl = wp_parse_url(get_admin_url());
                $siteUrl = $parsedUrl['scheme'] . '://' . $parsedUrl['host'];
                $siteUrl .= empty($parsedUrl['port']) ? null : ':' . $parsedUrl['port'];

                return $siteUrl;

            case 'ADMIN_URL':
                return str_replace(self::get('SITE_URL'), '', get_admin_url());

            case 'API_URL':
                return get_rest_url(null, '/' . self::SLUG . '/v1');

            case 'ROOT_URI':
                return set_url_scheme(plugins_url('', self::get('MAIN_FILE')), wp_parse_url(home_url())['scheme']);

            case 'ASSET_URI':
                return self::get('ROOT_URI') . '/assets';

            case 'PLUGIN_PAGE_LINKS':
                return self::pluginPageLinks();

            case 'WP_DB_PREFIX':
                global $wpdb;

                return $wpdb->prefix;

            default:
                return $default;
        }
    }

    /**
     * Prefixed variable name with prefix.
     *
     * @param string $option Variable name
     *
     * @return array
     */
    public static function withPrefix($option)
    {
        return self::VAR_PREFIX . $option;
    }

    /**
     * Retrieves options from option table.
     *
     * @param string $option  Option name
     * @param bool   $default default value
     * @param bool   $wp      Whether option is default wp option
     *
     * @return mixed
     */
    public static function getOption($option, $default = false, $wp = false)
    {
        if ($wp) {
            return get_option($option, $default);
        }

        return get_option(self::withPrefix($option), $default);
    }

    /**
     * Saves option to option table.
     *
     * @param string $option   Option name
     * @param bool   $autoload Whether option will autoload
     * @param mixed  $value
     *
     * @return bool
     */
    public static function addOption($option, $value, $autoload = false)
    {
        return add_option(self::withPrefix($option), $value, '', $autoload ? 'yes' : 'no');
    }

    /**
     * Delete option from option table.
     *
     * @param string $option Option name
     */
    public static function deleteOption($option)
    {
        return delete_option(self::withPrefix($option));
    }

    /**
     * Save or update option to option table.
     *
     * @param string $option   Option name
     * @param mixed  $value    Option value
     * @param bool   $autoload Whether option will autoload
     *
     * @return bool
     */
    public static function updateOption($option, $value, $autoload = null)
    {
        return update_option(self::withPrefix($option), $value, !\is_null($autoload) ? 'yes' : null);
    }

    public static function isDev()
    {
        return is_readable(Config::get('BASEDIR') . '.port');
    }

    public static function getDevUrl()
    {
        if (self::isDev()) {
            $port = self::getDevPort();

            return "http://localhost:{$port}";
        }
    }

    public static function getDevPort()
    {
        return self::isDev() ? file_get_contents(Config::get('BASEDIR') . '/.port') : null;
    }

    /**
     * Provides links for plugin pages. Those links will bi displayed in
     * all plugin pages under the plugin name.
     *
     * @return array
     */
    private static function pluginPageLinks()
    {
        return [
            'settings' => [
                'title' => __('Settings', 'bit-integrations'),
                'url'   => self::get('ADMIN_URL') . 'admin.php?page=' . self::SLUG . '#settings',
            ],
            'help' => [
                'title' => __('Help', 'bit-integrations'),
                'url'   => self::get('ADMIN_URL') . 'admin.php?page=' . self::SLUG . '#help',
            ],
        ];
    }

    /**
     * Provides menus for wordpress admin sidebar.
     * should return an array of menus with the following structure:
     * [
     *   'type' => menu | submenu,
     *  'name' => 'Name of menu will shown in sidebar',
     *  'capability' => 'capability required to access menu',
     *  'slug' => 'slug of menu after ?page=',.
     *
     *  'title' => 'page title will be shown in browser title if type is menu',
     *  'callback' => 'function to call when menu is clicked',
     *  'icon' =>   'icon to display in menu if menu type is menu',
     *  'position' => 'position of menu in sidebar if menu type is menu',
     *
     * 'parent' => 'parent slug if submenu'
     * ]
     *
     * @return array
     */
    // private static function sideBarMenu()
    // {
    //     $adminViews = new Layout();

    //     return [
    //         'Home' => [
    //             'type'       => 'menu',
    //             'title'      => __('Bit Integrations', 'bit-integrations'),
    //             'name'       => __('Bit Integrations', 'bit-integrations'),
    //             'capability' => 'manage_options',
    //             'slug'       => self::SLUG,
    //             'callback'   => [$adminViews, 'body'],
    //             'icon'       => 'dashicons-admin-home',
    //             'position'   => '20',
    //         ],
    //         'Dashboard' => [
    //             'parent'     => self::SLUG,
    //             'type'       => 'submenu',
    //             'name'       => 'Dashboard',
    //             'capability' => 'manage_options',
    //             'slug'       => self::SLUG . '#/',
    //         ],
    //         'All Flows' => [
    //             'parent'     => self::SLUG,
    //             'type'       => 'submenu',
    //             'name'       => 'Flows',
    //             'capability' => 'manage_options',
    //             'slug'       => self::SLUG . '#/flows',
    //         ],
    //         'Connections' => [
    //             'parent'     => self::SLUG,
    //             'type'       => 'submenu',
    //             'name'       => 'Connections',
    //             'capability' => 'manage_options',
    //             'slug'       => self::SLUG . '#/connections',
    //         ],
    //         'Webhooks' => [
    //             'parent'     => self::SLUG,
    //             'type'       => 'submenu',
    //             'name'       => 'Webhooks',
    //             'capability' => 'manage_options',
    //             'slug'       => self::SLUG . '#/webhooks',
    //         ],
    //     ];
    // }
}
