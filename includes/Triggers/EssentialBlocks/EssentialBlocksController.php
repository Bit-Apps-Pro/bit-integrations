<?php

namespace BitCode\FI\Triggers\EssentialBlocks;

use WP_Error;
use BitCode\FI\Flow\Flow;

class EssentialBlocksController
{
    public static function info()
    {
        return [
            'name' => 'Essential Blocks',
            'title' => 'Get callback data through an URL',
            'type' => 'essentialBlocks',
            'is_active' => true
        ];
    }

    public function getTestData()
    {
        $testData = get_option('btcbi_test_eb_form_submit_before_email');

        if ($testData === false) {
            update_option('btcbi_test_eb_form_submit_before_email', []);
        }
        if (!$testData || empty($testData)) {
            wp_send_json_error(new WP_Error('essentialBlocks_test', __('EssentialBlocks data is empty', 'bit-integrations')));
        }
        wp_send_json_success(['essentialBlocks' => $testData]);
    }


    public function removeTestData($data)
    {
        $testData = delete_option('btcbi_test_eb_form_submit_before_email');

        if (!$testData) {
            wp_send_json_error(new WP_Error('essential_blocks_test', __('Failed to remove test data', 'bit-integrations')));
        }
        wp_send_json_success(__('essential_blocks test data removed successfully', 'bit-integrations'));
    }
    public static function essentialBlocksHandler(...$args)
    {
        if (get_option('btcbi_test_eb_form_submit_before_email') !== false) {
            update_option('btcbi_test_eb_form_submit_before_email', $args);
        }

        if ($flows = Flow::exists('EssentialBlocks', current_action())) {

            foreach ($flows as $flow) {
                $flowDetails = json_decode($flow->flow_details);
                if (!isset($flowDetails->primaryKey)) {
                    continue;
                }

                $primaryKeyValue = self::extractValueFromPath($args, $flowDetails->primaryKey->key);
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
                        $formatedData[$key] = self::extractValueFromPath($args, $key);
                    }
                    Flow::execute('EssentialBlocks', current_action(), $formatedData, array($flow));
                }
            }
        }

        return rest_ensure_response(['status' => 'success']);
    }

    private static function extractValueFromPath($data, $path)
    {
        $parts = is_array($path) ? $path : explode('.', $path);
        if (count($parts) === 0) {
            return $data;
        }

        $currentPart = array_shift($parts);
        if (is_array($data)) {
            if (!isset($data[$currentPart])) {
                wp_send_json_error(new WP_Error('Action Hook', __('Index out of bounds or invalid', 'bit-integrations')));
            }
            return self::extractValueFromPath($data[$currentPart], $parts);
        }

        if (is_object($data)) {
            if (!property_exists($data, $currentPart)) {
                wp_send_json_error(new WP_Error('Action Hook', __('Invalid path', 'bit-integrations')));
            }
            return self::extractValueFromPath($data->$currentPart, $parts);
        }

        wp_send_json_error(new WP_Error('Action Hook', __('Invalid path', 'bit-integrations')));
    }
}
