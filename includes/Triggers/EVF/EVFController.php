<?php

namespace BitCode\FI\Triggers\EVF;

use BitCode\FI\Core\Util\Common;
use BitCode\FI\Core\Util\DateTimeHelper;
use BitCode\FI\Flow\Flow;
use wpdb;

final class EVFController
{
    public static function info()
    {
        $plugin_path = 'everest-forms/everest-forms.php';
        return [
            'name' => 'Everest Forms',
            'title' => 'Contact Form, Drag and Drop Form Builder for WordPress - Everest Forms',
            'slug' => $plugin_path,
            'type' => 'form',
            'is_active' => self::isActive(),
            'activation_url' => wp_nonce_url(self_admin_url('plugins.php?action=activate&amp;plugin=' . $plugin_path . '&amp;plugin_status=all&amp;paged=1&amp;s'), 'activate-plugin_' . $plugin_path),
            'install_url' => wp_nonce_url(self_admin_url('update.php?action=install-plugin&plugin=' . $plugin_path), 'install-plugin_' . $plugin_path),
            'list' => [
                'action' => 'evf/get',
                'method' => 'get',
            ],
            'fields' => [
                'action' => 'evf/get/form',
                'method' => 'post',
                'data' => ['id']
            ],
        ];
    }

    public static function isActive()
    {
        return function_exists('evf');
    }

    public function getAll()
    {
        $all_forms = [];
        if (self::isActive()) {
            $forms = $this->forms();
            if ($forms) {
                foreach ($forms as $form) {
                    $all_forms[] = (object)[
                        'id' => $form->ID,
                        'title' => $form->post_title
                    ];
                }
            }
        } else {
            wp_send_json_error(__('Everest Forms  is not installed or activated', 'bit-integrations'));
        }
        return $all_forms;
    }

    public function getAForm($data)
    {
        if (empty($data->id) || !(self::isActive())) {
            wp_send_json_error(__('Everest Forms  is not installed or activated', 'bit-integrations'));
        }
        $fields = self::fields($data->id);

        if (empty($fields)) {
            wp_send_json_error(__('Form doesn\'t exists any field', 'bit-integrations'));
        }

        $responseData['fields'] = $fields;
        wp_send_json_success($responseData);
    }


    public static function forms($form_id = null, $onlyData = false)
    {
        $args = [];
        if ($onlyData) {
            $args['content_only'] = true;
        }
        return \evf()->form->get($form_id, $args);
    }

    public static function fields($form_id)
    {
        $formData = self::forms($form_id);
        if (empty($formData) || is_wp_error($formData)) {
            return [];
        }
        $formData = is_string($formData->post_content) ? json_decode($formData->post_content) : $formData->post_content;
        $fields = [];
        if (property_exists($formData, 'form_fields')) {
            $fields = self::processFields($formData->form_fields);
        }
        return $fields;
    }

    public static function processFields($fields)
    {
        $processed = [];
        $fieldToExclude = ['html', 'divider', 'title'];
        foreach ($fields as $index => $field) {
            if (in_array($field->type, $fieldToExclude)) {
                continue;
            }
            if ($field->type  == 'address') {
                $processed = array_merge($processed, self::processAddressField($field, $index));
            } else {
                $processed[] = [
                    'name' => $index,
                    'type' => self::fieldType($field->type),
                    'label' => self::processFieldLabel($field),
                ];
            }
        }
        return $processed;
    }

    public static function processFieldLabel($field)
    {
        if (empty($field->label) && !empty($field->placeholder)) {
            return $field->placeholder;
        } else if (empty($field->label)) {
            return $field->id . ' - ' . $field->type;
        }
        return $field->label;
    }
    public static function processAddressField($field, $index)
    {
        $processed = [];
        $props = ['address1', 'address2', 'city', 'state', 'postal', 'country'];
        foreach ($props as $name) {
            $processed[] = [
                'name' => $index . '.' . $name,
                'type' => 'text',
                'label' => $field->{"{$name}_label"},
            ];
        }
        return $processed;
    }

    private static function fieldType($type)
    {
        switch ($type) {
        case 'first-name':
        case 'last-name':
        case 'range-slider':
        case 'payment-quantity':
        case 'payment-total':
        case 'rating':
            return 'text';
        case 'phone':
            return 'tel';
        case 'privacy-policy':
        case 'payment-checkbox':
        case 'payment-multiple':
            return 'checkbox';
        case 'payment-single':
            return 'radio';
        case 'image-upload':
        case 'file-upload':
        case 'signature':
            return 'file';

        default:
            return $type;
        }
    }

    public static function processValues($entry, $fields, $form_data)
    {
        $processedValues = [];

        foreach ($fields as $index => $field) {
            $methodName = 'process' . str_replace(' ', '', ucwords(str_replace('-', ' ', self::fieldType($field['type'])))) . 'FieldValue';
            if (method_exists(new self, $methodName)) {
                $processedValues =  array_merge($processedValues, call_user_func_array([new self, $methodName], [$index, $field, $form_data]));
            } else {
                $processedValues["$index"] =   $entry['form_fields'][$index];
            }
        }

        return $processedValues;
    }

    public static function processAddressFieldValue($index, $field, $data)
    {
        $processedValue = [];
        $props = ['address1', 'address2', 'city', 'state', 'postal', 'country'];
        foreach ($props as $name) {
            $processedValue[$index . '.' . $name] = $field[$name];
        }
        return $processedValue;
    }
    
    public static function processCountryFieldValue($index, $field, $data)
    {
        $processedValue = [];
        $processedValue["$index"] = $field['value']['country_code'];
        return $processedValue;
    }
    
    public static function processRadioFieldValue($index, $field, $data)
    {
        $processedValue = [];
        $processedValue["$index"] = $field['value_raw'];
        return $processedValue;
    }
    
    public static function processCheckboxFieldValue($index, $field, $data)
    {
        $processedValue = [];
        $processedValue["$index"] = $field['value_raw'];
        return $processedValue;
    }
    
    
    public static function processFileFieldValue($index, $field, $data)
    {
        $processedValue = [];
        if ($field['type'] == 'signature') {
            $processedValue["$index"] = $field['value'];
        } else {
            foreach ($field['value_raw'] as $file) {
                $processedValue["$index"][] = Common::filePath($file['value']);
            }
        }
        return $processedValue;
    }

    public static function processDateTimeFieldValue($index, $field, $data)
    {
        $processedValue = [];
    
        $fieldInfo =  $data['form_fields'][$index];
        if ($fieldInfo['date_mode'] === 'single') {
            $dateTimeHelper = new DateTimeHelper();
            $date_format = $fieldInfo['date_format'];
            $time_format = $fieldInfo['time_format'];
            if ($fieldInfo['datetime_format'] == 'date') {
                $date_time_format = $date_format;
            } elseif ($fieldInfo['datetime_format'] == 'time') {
                $date_time_format = $time_format;
            } else {
                $date_time_format = "$date_format $time_format";
            }

            $processedValue[$index] = $dateTimeHelper->getFormated($field['value'], $date_time_format, wp_timezone(), 'Y-m-d\TH:i', null);
        } else {
            $processedValue[$index] = $field['value'];
        }
        
        return $processedValue;
    }

    public static function handleSubmission($entry_id, $fields, $entry, $form_id, $form_data)
    {
        $processedEntry = self::processValues($entry, $fields, $form_data);
        if (!empty($form_id) && $flows = Flow::exists('EVF', $form_id)) {
            Flow::execute('EVF', $form_id, $processedEntry, $flows);
        }
    }
}
