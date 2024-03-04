<?php

namespace BitApps\BTCBI\Http\Services\Triggers\CustomTrigger;

use BitApps\BTCBI\Model\Flow;
use BTCBI\Deps\BitApps\WPKit\Http\Request\Request;
use BTCBI\Deps\BitApps\WPKit\Http\Response;
use WP_Error;

class CustomTriggerController
{
    public static function info()
    {
        return [
            'name' => 'Custom Trigger',
            'title' => 'You can connect bit integrations with any other plugin or theme using this trigger(custom hook)',
            'type' => 'custom_trigger',
            'is_active' => true
        ];
    }

    public function getNewHook()
    {
        $hook_id = wp_generate_uuid4();

        if (!$hook_id) {
            return Response::error(__('Failed to generate new hook id', 'bit-integrations'));
        }
        add_option('btcbi_custom_trigger_' . $hook_id, [], '', 'no');
        return Response::success(['hook_id' => $hook_id]);
    }

    public function getTestData($data)
    {
        $missing_field = null;
        if (!property_exists($data, 'hook_id') || (property_exists($data, 'hook_id') && !wp_is_uuid($data->hook_id))) {
            $missing_field = is_null($missing_field) ? 'Custom trigger ID' : $missing_field . ', Webhook ID';
        }
        if (!is_null($missing_field)) {
            return Response::error(sprintf(__('%s can\'t be empty or need to be valid', 'bit-integrations'), $missing_field));
        }

        $testData = get_option('btcbi_custom_trigger_' . $data->hook_id);
        if ($testData === false) {
            update_option('btcbi_custom_trigger_' . $data->hook_id, []);
        }
        if (!$testData || empty($testData)) {
            return Response::error(new WP_Error('custom_trigger_test', __('Custom trigger data is empty', 'bit-integrations')));
        }
        return Response::success(['custom_trigger' => $testData]);
    }

    public static function handleCustomTrigger($hook_id, $data)
    {
        if (get_option('btcbi_custom_trigger_' . $hook_id) !== false) {
            update_option('btcbi_custom_trigger_' . $hook_id, $data);
        }

        if ($flows = Flow::exists('CustomTrigger', $hook_id)) {
            Flow::execute('CustomTrigger', $hook_id, $data, $flows);
        }
        return rest_ensure_response(['status' => 'success']);
    }

    public function removeTestData($data)
    {
        $missing_field = null;

        if (!property_exists($data, 'hook_id') || (property_exists($data, 'hook_id') && !wp_is_uuid($data->hook_id))) {
            $missing_field = is_null($missing_field) ? 'Custom trigger ID' : $missing_field . ', Custom trigger ID';
        }
        if (!is_null($missing_field)) {
            return Response::error(sprintf(__('%s can\'t be empty or need to be valid', 'bit-integrations'), $missing_field));
        }

        if (property_exists($data, 'reset') && $data->reset) {
            $testData = update_option('btcbi_custom_trigger_' . $data->hook_id, []);
        } else {
            $testData = delete_option('btcbi_custom_trigger_' . $data->hook_id);
        }
        if (!$testData) {
            return Response::error(new WP_Error('webhook_test', __('Failed to remove test data', 'bit-integrations')));
        }
        return Response::success(__('Webhook test data removed successfully', 'bit-integrations'));
    }
}