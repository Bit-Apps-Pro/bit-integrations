<?php

namespace BitApps\BTCBI_FI\Admin;

use BitApps\BTCBI_FI\Core\Util\Route;

class AdminAjax
{
    public function register()
    {
        Route::post('app/config', [$this, 'updatedAppConfig']);
        Route::get('get/config', [$this, 'getAppConfig']);
        // CHANGELOG VERSION OPTIONS
        Route::post('changelog_version', [$this, 'setChangelogVersion']);
        // add_action('wp_ajax_btcbi_changelog_version', [$this, 'setChangelogVersion']);
    }

    public function updatedAppConfig($data)
    {
        if (!property_exists($data, 'data')) {
            wp_send_json_error(__('Data can\'t be empty', 'bit-integrations'));
        }

        update_option('btcbi_app_conf', $data->data);
        wp_send_json_success(__('save successfully done', 'bit-integrations'));
    }

    public function getAppConfig()
    {
        $data = get_option('btcbi_app_conf');
        wp_send_json_success($data);
    }

    public function setChangelogVersion()
    {
        if (empty($_REQUEST['_ajax_nonce'])) {
            wp_send_json_error(
                __(
                    'Token expired',
                    'bit-integrations'
                ),
                401
            );
        }

        $nonce = sanitize_text_field(wp_unslash($_REQUEST['_ajax_nonce']));

        if (wp_verify_nonce($nonce, 'btcbi_nonce') && isset($_REQUEST['data'])) {
            $inputJSON = stripslashes(wp_unslash($_REQUEST['data']));
            $decoded = json_decode($inputJSON);
            $input = \is_object($decoded) || \is_array($decoded) ? map_deep($decoded, 'sanitize_text_field') : $decoded;
            $version = isset($input->version) ? sanitize_text_field($input->version) : '';

            update_option('btcbi_changelog_version', $version);

            wp_send_json_success($version, 200);
        } else {
            wp_send_json_error(__('Token expired or no data received', 'bit-integrations'), 401);
        }
    }
}
