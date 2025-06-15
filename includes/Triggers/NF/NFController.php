<?php

namespace BitCode\FI\Triggers\NF;

use BitCode\FI\Flow\Flow;

final class NFController
{
    public static function info()
    {
        $plugin_path = 'ninja-forms/ninja-forms.php';
        return [
            'name'           => 'Ninja Forms',
            'title'          => 'Ninja Forms is a webform builder with unparalleled ease of use and features.',
            'slug'           => $plugin_path,
            'type'           => 'form',
            'is_active'      => function_exists('Ninja_Forms') && is_callable('Ninja_Forms'),
            'activation_url' => wp_nonce_url(self_admin_url('plugins.php?action=activate&amp;plugin=' . $plugin_path . '&amp;plugin_status=all&amp;paged=1&amp;s'), 'activate-plugin_' . $plugin_path),
            'install_url'    => wp_nonce_url(self_admin_url('update.php?action=install-plugin&plugin=' . $plugin_path), 'install-plugin_' . $plugin_path),
            'list'           => [
                'action' => 'nf/get',
                'method' => 'get',
            ],
            'fields' => [
                'action' => 'nf/get/form',
                'method' => 'post',
                'data'   => ['id']
            ],
        ];
    }

    public function getAll()
    {
        $all_forms = [];
        if (function_exists('Ninja_Forms') && is_callable('Ninja_Forms')) {
            $forms = \Ninja_Forms()->form()->get_forms();
            if ($forms) {
                foreach ($forms as $form) {
                    $all_forms[] = (object)[
                        'id'    => $form->get_id(),
                        'title' => $form->get_setting('title')
                    ];
                }
            }
        }
        return $all_forms;
    }

    public function getAForm($data)
    {
        if (empty($data->id) || !(function_exists('Ninja_Forms') && is_callable('Ninja_Forms'))) {
            wp_send_json_error(__('Ninja Forms  is not installed or activated', 'bit-integrations'));
        }
        $fields = self::fields($data->id);

        if (empty($fields)) {
            wp_send_json_error(__('Form doesn\'t exists any field', 'bit-integrations'));
        }

        $responseData['fields'] = $fields;
        wp_send_json_success($responseData);
    }

    public static function fields($form_id)
    {
        if (!(function_exists('Ninja_Forms') && is_callable('Ninja_Forms'))) {
            wp_send_json_error(__('Ninja Forms  is not installed or activated', 'bit-integrations'));
        }
        $fieldDetails = Ninja_Forms()->form($form_id)->get_fields();

        if (empty($fieldDetails)) {
            return [];
        }

        $fields = [];
        $inputTypes = ['color', 'checkbox', 'date', 'datetime-local', 'email', 'fileupload', 'file', 'hidden', 'image', 'month', 'number', 'password', 'radio', 'range', 'tel', 'text', 'time', 'url', 'week'];
        foreach ($fieldDetails as  $id => $field) {
            if ($field->get_setting('type') !== 'submit') {
                if (in_array($field->get_setting('type'), $inputTypes) && $field->get_setting('type') == 'listimage') {
                    $fields[] = [
                        'name'  => $field->get_id(),
                        'type'  => 'file',
                        'label' => self::getFieldLabel($field),
                    ];
                    continue;
                } elseif ($field->get_setting('type') === 'repeater') {
                    $repeaterFldId = $field->get_id();
                    $repeaterFldsLabel = self::getFieldLabel($field);
                    $repeatFlds = $field->get_setting('fields');
                    foreach ($repeatFlds as $repeatFld) {
                        $fields[] = [
                            'name'  => $repeatFld['id'],
                            'type'  => $repeatFld['type'],
                            'label' => $repeaterFldsLabel . ' ' . $repeatFld['label'],
                        ];
                    }
                    continue;
                }
                $fields[] = [
                    'name'  => $field->get_id(),
                    'type'  => in_array($field->get_setting('type'), $inputTypes) ? $field->get_setting('type') : 'text',
                    'label' => self::getFieldLabel($field),
                ];
            }
        }
        return $fields;
    }

    private static function getFieldLabel($field)
    {
        if (is_string($field->get_setting('label')) && $field->get_setting('label')) {
            return $field->get_setting('label');
        } elseif (is_string($field->get_setting('admin_label')) && $field->get_setting('admin_label')) {
            return $field->get_setting('admin_label');
        } elseif (is_string($field->get_setting('help_text')) && $field->get_setting('help_text')) {
            return $field->get_setting('help_text');
        } elseif (is_string($field->get_setting('key')) && $field->get_setting('key')) {
            return $field->get_setting('key');
        } else {
            return 'field_' . $field->get_id();
        }
    }

    public static function ninja_forms_after_submission($data)
    {
        $entry = [];
        foreach ($data['fields'] as  $field) {
            if (isset($field['settings']['type']) && strpos($field['settings']['type'], 'file') !== false) {
                if (is_array($field['value'])) {
                    foreach ($field['value'] as $fileIndex => $fileName) {
                        $entry[$field['id']][$fileIndex] = \NFFormsModel::get_physical_file_path($fileName);
                    }
                } else {
                    $entry[$field['id']] = \NFFormsModel::get_physical_file_path($field['value']);
                }
            } elseif (isset($field['settings']['type']) && $field['settings']['type'] === 'repeater') {
                $repeaterFldId = $field['id'];
                $repeatFlds = $field['fields'];
                $repeaterVals = $field['value'];
                foreach ($repeaterVals as $repeatKey => $repeatVal) {
                    $entry[$repeatKey] = $repeatVal['value'];
                }
                $entry[$repeaterFldId] = $repeatFlds;
            } else {
                if (isset($field['id']) && isset($field['value'])) {
                    $entry[$field['id']] = $field['value'];
                }
            }
        }
        $form_id = $data['form_id'];

        if (!empty($form_id) && $flows = Flow::exists('NF', $form_id)) {
            Flow::execute('NF', $form_id, $entry, $flows);
        }
    }
}
