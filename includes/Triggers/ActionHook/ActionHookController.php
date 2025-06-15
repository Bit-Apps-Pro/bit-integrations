<?php

namespace BitCode\FI\Triggers\ActionHook;

use WP_Error;
use BitCode\FI\Flow\Flow;
use BitCode\FI\Core\Util\Helper;

class ActionHookController
{
    public static function info()
    {
        return [
            'name' => 'Action Hook',
            'title' => 'Get callback data through an URL',
            'type' => 'action_hook',
            'is_active' => true
        ];
    }

    public function getTestData($data)
    {
        $missing_field = null;

        if (!property_exists($data, 'hook_id')) {
            $missing_field = is_null($missing_field) ? 'ActionHook ID' : $missing_field . ', ActionHook ID';
        }
        if (!is_null($missing_field)) {
            wp_send_json_error(sprintf(__('%s can\'t be empty or need to be valid', 'bit-integrations'), $missing_field));
        }

        $testData = get_option('btcbi_action_hook_test_' . $data->hook_id);
        if ($testData === false) {
            update_option('btcbi_action_hook_test_' . $data->hook_id, []);
        }
        if (!$testData || empty($testData)) {
            wp_send_json_error(new WP_Error('actionHook_test', __('ActionHook data is empty', 'bit-integrations')));
        }
        wp_send_json_success(['actionHook' => $testData]);
    }

    public static function actionHookHandler(...$args)
    {
        if (get_option('btcbi_action_hook_test_' . current_action()) !== false) {
            update_option('btcbi_action_hook_test_' . current_action(), $args);
        }
        return rest_ensure_response(['status' => 'success']);
    }

    public function removeTestData($data)
    {
        $missing_field = null;
        if (!property_exists($data, 'hook_id') && !empty($data->hook_id)) {
            $missing_field = is_null($missing_field) ? 'ActionHook ID' : $missing_field . ', ActionHook ID';
        }
        if (!is_null($missing_field)) {
            wp_send_json_error(sprintf(__('%s can\'t be empty or need to be valid', 'bit-integrations'), $missing_field));
        }

        if (property_exists($data, 'reset') && $data->reset) {
            $testData = update_option('btcbi_action_hook_test_' . $data->hook_id, []);
        } else {
            $testData = delete_option('btcbi_action_hook_test_' . $data->hook_id);
        }
        if (!$testData) {
            wp_send_json_error(new WP_Error('actionHook_test', __('Failed to remove test data', 'bit-integrations')));
        }
        wp_send_json_success(__('ActionHook test data removed successfully', 'bit-integrations'));
    }

    public static function handle(...$args)
    {
        if ($flows = Flow::exists('ActionHook', current_action())) {
            foreach ($flows as $flow) {
                $flowDetails = json_decode($flow->flow_details);

                if (!isset($flowDetails->primaryKey)) {
                    continue;
                }

                $primaryKeyValue = Helper::extractValueFromPath($args, $flowDetails->primaryKey->key);
                if ($flowDetails->primaryKey->value === $primaryKeyValue) {
                    $fieldKeys      = [];
                    $formatedData   = [];

                    if ($flowDetails->body->data && is_array($flowDetails->body->data)) {
                        $fieldKeys = array_map(function ($field) use ($args) {
                            return $field->key;
                        }, $flowDetails->body->data);
                    } elseif (isset($flowDetails->field_map) && is_array($flowDetails->field_map)) {
                        $fieldKeys = array_map(function ($field) use ($args) {
                            return $field->formField;
                        }, $flowDetails->field_map);
                    }

                    foreach ($fieldKeys as $key) {
                        $formatedData[$key] = Helper::extractValueFromPath($args, $key);
                    }

                    Flow::execute('ActionHook', current_action(), $formatedData, array($flow));
                }
            }
        }

        return rest_ensure_response(['status' => 'success']);
    }
}
