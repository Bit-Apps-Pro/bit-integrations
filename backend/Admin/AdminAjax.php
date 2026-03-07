<?php

namespace BitApps\Integrations\Admin;

use BitApps\Integrations\Config;
use BitApps\Integrations\Core\Util\Route;

class AdminAjax
{
    public function register()
    {
        Route::get('get/config', [$this, 'getAppConfig']);
        Route::post('app/config', [$this, 'updatedAppConfig']);
        Route::post('changelog_version', [$this, 'setChangelogVersion']);
    }

    public function updatedAppConfig($data)
    {
        if (!property_exists($data, 'data')) {
            wp_send_json_error(__('Data can\'t be empty', 'bit-integrations'));
        }

        Config::updateOption('app_conf', $data->data);
        wp_send_json_success(__('save successfully done', 'bit-integrations'));
    }

    public function getAppConfig()
    {
        // Deprecated: 'btcbi_app_conf'. Use 'bit_integrations_app_conf' instead.
        $data = Config::getOption('app_conf', []);
        if (empty($data)) {
            $data = get_option('btcbi_app_conf', $data);
        }

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

        if (wp_verify_nonce($nonce, Config::withPrefix('nonce')) && isset($_REQUEST['data'])) {
            // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized -- Sanitized via map_deep on next lines
            $inputJSON = stripslashes(wp_unslash($_REQUEST['data']));
            $decoded = json_decode($inputJSON);
            $input = \is_object($decoded) || \is_array($decoded) ? map_deep($decoded, 'sanitize_text_field') : $decoded;
            $version = isset($input->version) ? sanitize_text_field($input->version) : '';

            Config::updateOption('changelog_version', $version, true);

            wp_send_json_success($version, 200);
        } else {
            wp_send_json_error(__('Token expired or no data received', 'bit-integrations'), 401);
        }
    }
}
