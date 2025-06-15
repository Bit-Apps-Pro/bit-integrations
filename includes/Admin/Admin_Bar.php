<?php

namespace BitCode\FI\Admin;

use BitCode\FI\Core\Util\Hooks;
use BitCode\FI\Core\Util\Capabilities;
use BitCode\FI\Core\Util\DateTimeHelper;

/**
 * The admin menu and page handler class
 */
class Admin_Bar
{
    public function register()
    {
        Hooks::add('in_admin_header', [$this, 'RemoveAdminNotices']);
        Hooks::add('admin_menu', [$this, 'AdminMenu']);
        Hooks::add('admin_enqueue_scripts', [$this, 'AdminAssets']);
        // Hooks::filter('btcbi_localized_script', [$this, 'filterAdminScriptVar']);
        add_filter('script_loader_tag', [$this, 'scriptTagFilter'], 0, 3);
        add_filter('script_loader_src', [$this, 'removeQueryParam'], 99999, 3);
    }

    /**
     * Register the admin menu
     *
     * @return void
     */
    public function AdminMenu()
    {
        global $submenu;

        $capability = Hooks::apply('manage_wp_integrations', 'manage_options');
        if (Capabilities::Check($capability)) {
            add_menu_page(__('Integrations for WordPress Forms', 'bit-integrations'), __('Bit Integrations', 'bit-integrations'), $capability, 'bit-integrations', [$this, 'rootPage'], 'data:image/svg+xml;base64,' . base64_encode('<svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M27.4553 15.5967C28.3101 16.0576 28.6632 16.7328 28.6613 17.6405C28.6521 22.0054 28.6608 26.3703 28.6553 30.7352C28.6536 32.0636 27.7634 33.0095 26.5528 33.0015C25.3428 32.9934 24.4204 32.0543 24.4135 30.7458C24.3958 27.3823 24.3856 24.0185 24.4221 20.6553C24.4302 19.9017 24.2576 19.6256 23.4498 19.6388C20.5298 19.6867 17.6085 19.654 14.6877 19.6599C12.6202 19.6641 11.4127 20.8815 11.4082 22.9513C11.4062 23.8756 11.4037 24.8 11.4098 25.7243C11.4204 27.324 12.542 28.5791 14.1482 28.6498C15.8873 28.7264 17.6312 28.6876 19.3729 28.7122C19.7547 28.7175 20.1471 28.7314 20.5151 28.8216C21.5145 29.0665 22.0662 29.8531 22.0487 30.9325C22.0322 31.9436 21.435 32.6768 20.456 32.9215C19.7469 33.0987 19.028 33.0411 18.314 33.0295C16.4751 32.9996 14.624 33.1928 12.8042 32.7664C9.26368 31.9368 7.08789 29.2058 7.09167 25.5636C7.09297 24.307 7.00786 23.0474 7.15101 21.7936C7.33546 20.178 7.52843 19.7657 9.11202 17.4879C8.2677 16.5348 7.53777 15.4802 7.31269 14.182C6.92859 11.9664 6.86556 9.71299 7.30889 7.5256C7.89085 4.65422 10.3484 2.60757 13.3576 2.14449C14.0182 2.04283 14.6767 1.9986 15.3442 2.00003C18.9824 2.00783 22.6206 1.99792 26.2588 2.00793C27.5753 2.01156 28.5126 2.74919 28.6467 3.8391C28.8149 5.20666 27.9155 6.25337 26.5255 6.25755C22.7336 6.26893 18.9416 6.256 15.1497 6.26688C14.2193 6.26955 13.3093 6.39994 12.526 6.97597C11.8236 7.49256 11.4102 8.16412 11.4094 9.05812C11.4084 10.0595 11.406 11.0608 11.4072 12.0621C11.4098 14.174 12.6079 15.3868 14.7425 15.3938C18.56 15.4064 22.3776 15.3988 26.1951 15.3979C26.6053 15.3978 27.0166 15.3779 27.4553 15.5967Z" fill="#808285"/>
                <path d="M25.1091 12.817C24.2234 12.031 23.8672 11.1284 24.2607 10.0266C24.6155 9.03294 25.3347 8.50758 26.3946 8.43723C27.4598 8.36652 28.2492 8.81474 28.7137 9.74617C29.1593 10.6397 29.0929 11.5514 28.4554 12.3458C27.8047 13.1566 26.9435 13.4549 25.9254 13.1827C25.6584 13.1113 25.4118 12.9637 25.1091 12.817Z" fill="#808285"/>
                </svg>'), 30);
        }

        $submenu['bit-integrations'] = [
            [__('All Integrations', 'bit-integrations'), $capability, 'admin.php?page=bit-integrations#/'],
            [__('Doc & Support', 'bit-integrations'), $capability, 'admin.php?page=bit-integrations#/doc-support'],
            [__('Settings', 'bit-integrations'), $capability, 'admin.php?page=bit-integrations#/app-settings'],
        ];
    }

    /**
     * Filter variables for admin script
     *
     * @param array $previousValue  Current values
     * @param mixed $current_screen
     *
     * @return $previousValue Filtered Values
     */

    /**
     * Load the asset libraries
     *
     * @return void
     */
    public function AdminAssets($current_screen)
    {
        if (strpos($current_screen, 'bit-integrations') === false) {
            return;
        }

        $parsed_url = wp_parse_url(get_admin_url());
        $site_url = $parsed_url['scheme'] . '://' . $parsed_url['host'];
        $site_url .= empty($parsed_url['port']) ? null : ':' . $parsed_url['port'];
        $base_path_admin = str_replace($site_url, '', get_admin_url());

        if (wp_script_is('wp-i18n')) {
            $deps = ['wp-i18n'];
        } else {
            $deps = [];
        }

        if (\defined('BITAPPS_DEV') && BITAPPS_DEV) {
            wp_enqueue_script('vite-client-helper-BTCBI-MODULE', BTCBI_BIT_DEV_URL . '/config/devHotModule.js', [], null);
            wp_enqueue_script('vite-client-BTCBI-MODULE', BTCBI_BIT_DEV_URL . '/@vite/client', [], null);
            wp_enqueue_script('index-BTCBI-MODULE', BTCBI_BIT_DEV_URL . '/main.jsx', [], null);
        }

        if (!\defined('BITAPPS_DEV')) {
            $build_hash = file_get_contents(BTCBI_PLUGIN_DIR_PATH . '/build-hash.txt');
            wp_enqueue_script('index-BTCBI-MODULE', BTCBI_ASSET_URI . "/main-{$build_hash}.js", $deps, BTCBI_VERSION);
            // wp_enqueue_style('bf-css', BTCBI_ASSET_URI . "/main-{$build_hash}.css");
        }

        if (!wp_script_is('wp-tinymce')) {
            wp_enqueue_script('wp-tinymce');
        }

        global $wp_rewrite;
        $api = [
            'base'      => get_rest_url() . 'bit-integrations/v1',
            'separator' => $wp_rewrite->permalink_structure ? '?' : '&'
        ];

        $users = get_users(['fields' => ['ID', 'user_nicename', 'user_email', 'display_name']]);
        $userMails = [];
        foreach ($users as $key => $user) {
            $userMails[$key]['label'] = !empty($user->display_name) ? $user->display_name : '';
            $userMails[$key]['value'] = !empty($user->user_email) ? $user->user_email : '';
            $userMails[$key]['id'] = $user->ID;
        }

        $btcbi = apply_filters(
            'btcbi_localized_script',
            [
                'nonce'       => wp_create_nonce('btcbi_nonce'),
                'assetsURL'   => BTCBI_ASSET_URI,
                'baseURL'     => $base_path_admin . 'admin.php?page=bit-integrations#',
                'siteURL'     => site_url(),
                'ajaxURL'     => admin_url('admin-ajax.php'),
                'api'         => $api,
                'dateFormat'  => get_option('date_format'),
                'timeFormat'  => get_option('time_format'),
                'timeZone'    => DateTimeHelper::wp_timezone_string(),
                'userMail'    => $userMails,
                'currentUser' => wp_get_current_user(),
            ]
        );

        if (\defined('BTCBI_VERSION')) {
            $btcbi['version'] = \function_exists('btcbi_pro_activate_plugin') ? BTCBI_PRO_VERSION : BTCBI_VERSION;
        }

        $changelogVersion = get_option('btcbi_changelog_version', '0.0.0');
        $btcbi['changelogVersion'] = $changelogVersion;

        if ((get_locale() !== 'en_US' || get_user_locale() !== 'en_US') && file_exists(BTCBI_PLUGIN_BASEDIR . '/languages/generatedString.php')) {
            include_once BTCBI_PLUGIN_BASEDIR . '/languages/generatedString.php';
            $btcbi['translations'] = $bit_integrations_i18n_strings;
        }

        wp_localize_script('index-BTCBI-MODULE', 'btcbi', $btcbi);
    }

    /**
     * Bit-Integrations  apps-root id provider
     *
     * @return void
     */
    public function rootPage()
    {
        include BTCBI_PLUGIN_BASEDIR . '/views/view-root.php';
    }

    public function RemoveAdminNotices()
    {
        global $plugin_page;
        if (!$plugin_page || strpos($plugin_page, 'bit-integrations') === false) {
            return;
        }
        remove_all_actions('admin_notices');
        remove_all_actions('all_admin_notices');
    }

    public function scriptTagFilter($html, $handle, $href)
    {
        $newTag = $html;
        if (preg_match('/BTCBI-MODULE/', $handle)) {
            $newTag = preg_replace('/<script /', '<script type="module" ', $newTag);
        }

        return $newTag;
    }

    public function removeQueryParam($src, $handle)
    {
        if ('index-BTCBI-MODULE' === $handle) {
            $src = strtok($src, '?');
        }

        return $src;
    }
}
