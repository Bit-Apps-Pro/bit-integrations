<?php

namespace BitCode\FI\Triggers;

use BitCode\FI\Core\Util\AllTriggersName;
use BitCode\FI\Core\Util\Capabilities;
use BitCode\FI\Core\Util\Hooks;
use FilesystemIterator;
use WP_Error;

final class TriggerController
{
    public static function triggerList()
    {
        if (!(Capabilities::Check('manage_options') || Capabilities::Check('bit_integrations_manage_integrations') || Capabilities::Check('bit_integrations_view_integrations'))) {
            wp_send_json_error(__("User don't have permission to access this page", 'bit-integrations'));
        }
        $triggers = [];
        $dirs = new FilesystemIterator(__DIR__);

        foreach ($dirs as $dirInfo) {
            if ($dirInfo->isDir()) {
                $trigger = basename($dirInfo);

                if (file_exists(__DIR__ . '/' . $trigger . '/' . $trigger . 'Controller.php')) {
                    $trigger_controller = __NAMESPACE__ . "\\{$trigger}\\{$trigger}Controller";

                    if (method_exists($trigger_controller, 'info')) {
                        $triggers[$trigger] = $trigger_controller::info();
                    }
                }
            }
        }

        if (!\function_exists('btcbi_pro_activate_plugin')) {
            $triggers = array_merge($triggers, AllTriggersName::allTriggersName());
        }

        return Hooks::apply('bit_integrations_triggers', $triggers);
    }

    public static function getTriggerField($triggerName, $data)
    {
        $trigger = basename($triggerName);

        if (file_exists(__DIR__ . '/' . $trigger . '/' . $trigger . 'Controller.php')) {
            $trigger_controller = __NAMESPACE__ . "\\{$trigger}\\{$trigger}Controller";

            if (method_exists($trigger_controller, 'get_a_form')) {
                $trigger = new $trigger_controller();

                return $trigger::fields($data->id);
            }
        } else {
            return Hooks::apply('bit_integrations_trigger_fields', $triggerName, $data);
        }

        return [];
    }

    public static function getTestData($triggerName)
    {
        $testData = get_option("btcbi_{$triggerName}_test");

        if ($testData === false) {
            update_option("btcbi_{$triggerName}_test", []);
        }
        if (!$testData || empty($testData)) {
            wp_send_json_error(new WP_Error("{$triggerName}_test", wp_sprintf(__('%s data is empty', 'bit-integrations'), $triggerName)));
        }

        wp_send_json_success($testData);
    }

    public static function removeTestData($data, $triggerName)
    {
        if (\is_object($data) && property_exists($data, 'reset') && $data->reset) {
            $testData = update_option("btcbi_{$triggerName}_test", []);
        } else {
            $testData = delete_option("btcbi_{$triggerName}_test");
        }

        if (!$testData) {
            wp_send_json_error(new WP_Error("{$triggerName}_test", __('Failed to remove test data', 'bit-integrations')));
        }

        wp_send_json_success(wp_sprintf(__('%s test data removed successfully', 'bit-integrations'), $triggerName));
    }
}
