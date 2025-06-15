<?php

namespace BitCode\FI\Triggers\Spectra;

use WP_Error;
use BitCode\FI\Flow\Flow;

class SpectraController
{
    public static function info()
    {
        return [
            'name' => 'Spectra',
            'title' => 'Get callback data through an URL',
            'type' => 'spectra',
            'is_active' => true
        ];
    }

    public function getTestData()
    {
        $testData = get_option('btcbi_test_uagb_form_success');

        if ($testData === false) {
            update_option('btcbi_test_uagb_form_success', []);
        }
        if (!$testData || empty($testData)) {
            wp_send_json_error(new WP_Error('spectra_test', __('Spectra data is empty', 'bit-integrations')));
        }
        wp_send_json_success(['spectra' => $testData]);
    }


    public function removeTestData($data)
    {
        $testData = delete_option('btcbi_test_uagb_form_success');

        if (!$testData) {
            wp_send_json_error(new WP_Error('spectra_test', __('Failed to remove test data', 'bit-integrations')));
        }
        wp_send_json_success(__('spectra test data removed successfully', 'bit-integrations'));
    }
    public static function spectraHandler(...$args)
    {
        if (get_option('btcbi_test_uagb_form_success') !== false) {
            update_option('btcbi_test_uagb_form_success', $args);
        }

        if ($flows = Flow::exists('Spectra', current_action())) {

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
                    // var_dump($args);
                    // die;

                    foreach ($fieldKeys as $key) {
                        $formatedData[$key] = self::extractValueFromPath($args, $key);
                    }
                    Flow::execute('Spectra', current_action(), $formatedData, array($flow));
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
                wp_send_json_error(new WP_Error('Spectra', __('Index out of bounds or invalid', 'bit-integrations')));
            }
            return self::extractValueFromPath($data[$currentPart], $parts);
        }

        if (is_object($data)) {
            if (!property_exists($data, $currentPart)) {
                wp_send_json_error(new WP_Error('Spectra', __('Invalid path', 'bit-integrations')));
            }
            return self::extractValueFromPath($data->$currentPart, $parts);
        }

        wp_send_json_error(new WP_Error('Spectra', __('Invalid path', 'bit-integrations')));
    }
}
