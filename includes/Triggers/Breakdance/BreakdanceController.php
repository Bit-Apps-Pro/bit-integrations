<?php

namespace BitCode\FI\Triggers\Breakdance;

use WP_Error;
use BitCode\FI\Flow\Flow;
use Breakdance\Forms\Actions\Action;
use Breakdance\Forms\Actions\ActionProvider;
use BitCode\FI\Triggers\Breakdance\BreakdanceSubmitData;


final class BreakdanceController
{
    private $instance = null;
    public static $bAllForm = [];

    public static function info()
    {
        $plugin_path = self::pluginActive('get_name');
        return [
            'name'                  => 'Breakdance',
            'title'                 => 'Breakdance is the platform web creators choose to build professional WordPress websites, grow their skills, and build their business. Start for free today!',
            'slug'                  => $plugin_path,
            'pro'                   => $plugin_path,
            'type'                  => 'custom_form_submission',
            'is_active'             => is_plugin_active($plugin_path),
            'activation_url'        => wp_nonce_url(self_admin_url('plugins.php?action=activate&amp;plugin=' . $plugin_path . '&amp;plugin_status=all&amp;paged=1&amp;s'), 'activate-plugin_' . $plugin_path),
            'install_url'           => wp_nonce_url(self_admin_url('update.php?action=install-plugin&plugin=' . $plugin_path), 'install-plugin_' . $plugin_path),
            'documentation_url'     => 'https://bitapps.pro/docs/bit-integrations/trigger/breakdance-integrations',
            'triggered_entity_id'   => 'BreakdanceHook',
            'fetch'         => [
                'action'    => 'breakdance/test',
                'method'    => 'post',
            ],
            'fetch_remove'  => [
                'action'    => 'breakdance/test/remove',
                'method'    => 'post',
            ]
        ];
    }

    public static function pluginActive($option = null)
    {
        if (is_plugin_active('breakdance/plugin.php')) {
            return $option === 'get_name' ? 'breakdance/plugin.php' : true;
        } else {
            return false;
        }
    }

    public static function addAction()
    {
        if (class_exists(__NAMESPACE__ . '\BreakdanceAction')) {
            \Breakdance\Forms\Actions\registerAction(new BreakdanceAction());
        }
    }

    public function getTestData()
    {
        $testData = get_option('btcbi_breakdance_test');

        if ($testData === false) {
            update_option('btcbi_breakdance_test', []);
        }
        if (!$testData || empty($testData)) {
            wp_send_json_error(new WP_Error('breakdance_test', __('Breakdance data is empty', 'bit-integrations')));
        }

        wp_send_json_success($testData);
    }

    public function removeTestData($data)
    {
        if (is_object($data) && property_exists($data, 'reset') && $data->reset) {
            $testData = update_option('btcbi_breakdance_test', []);
        } else {
            $testData = delete_option('btcbi_breakdance_test');
        }

        if (!$testData) {
            wp_send_json_error(new WP_Error('breakdance_test', __('Failed to remove test data', 'bit-integrations')));
        }

        wp_send_json_success(__('breakdance test data removed successfully', 'bit-integrations'));
    }
}
