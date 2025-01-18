<?php

namespace BitCode\FI\Admin;

use BitCode\FI\Core\Util\Route;

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
        if (wp_verify_nonce(sanitize_text_field($_REQUEST['_ajax_nonce']), 'btcbi_nonce')) {
            $inputJSON = stripslashes($_REQUEST['data']);
            $input = json_decode($inputJSON);
            $version = isset($input->version) ? $input->version : '';

            update_option('btcbi_changelog_version', $version);

            wp_send_json_success($version, 200);
        } else {
            wp_send_json_error(
                __(
                    'Token expired',
                    'bit-integrations'
                ),
                401
            );
        }
    }
}
