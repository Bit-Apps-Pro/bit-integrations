<?php

namespace BitCode\FI\Triggers\Formidable;

use BitCode\FI\Flow\Flow;
use BitCode\FI\Core\Util\Common;

final class FormidableController
{
    public static function info()
    {
        $plugin_path = 'formidable/formidable.php';
        return [
            'name'           => 'Formidable',
            'title'          => 'Formidable - Formidable Forms is the best WordPress forms plugin',
            'slug'           => $plugin_path,
            'pro'            => 'formidable/formidable.php',
            'type'           => 'form',
            'is_active'      => function_exists('load_formidable_forms'),
            'activation_url' => wp_nonce_url(self_admin_url('plugins.php?action=activate&amp;plugin=' . $plugin_path . '&amp;plugin_status=all&amp;paged=1&amp;s'), 'activate-plugin_' . $plugin_path),
            'install_url'    => wp_nonce_url(self_admin_url('update.php?action=install-plugin&plugin=' . $plugin_path), 'install-plugin_' . $plugin_path),
            'list'           => [
                'action' => 'formidable/get',
                'method' => 'get',
            ],
            'fields' => [
                'action' => 'formidable/get/form',
                'method' => 'post',
                'data'   => ['id']
            ],
        ];
    }

    public function getAll()
    {
        if (!function_exists('load_formidable_forms')) {
            wp_send_json_error(__('Formidable is not installed or activated', 'bit-integrations'));
        }
        $forms = \FrmForm::getAll();
        $all_forms = [];
        if ($forms) {
            foreach ($forms as $form) {
                $all_forms[] = (object)[
                    'id'    => $form->id,
                    'title' => $form->name,
                ];
            }
        }
        wp_send_json_success($all_forms);
    }

    public function get_a_form($data)
    {
        if (!function_exists('load_formidable_forms')) {
            wp_send_json_error(__('Formidable is not installed or activated', 'bit-integrations'));
        }
        if (empty($data->id)) {
            wp_send_json_error(__('Form doesn\'t exists', 'bit-integrations'));
        }

        $fields = self::fields($data->id);

        $responseData['fields'] = $fields;
        wp_send_json_success($responseData);
    }

    public static function fields($form_id)
    {
        $fields = \FrmField::get_all_for_form($form_id, '', 'include');
        $field = [];
        if (empty($fields)) {
            wp_send_json_error(__('Form doesn\'t exists any field', 'bit-integrations'));
        }

        $visistedKey = [];

        foreach ($fields as $key => $val) {
            if ($val->type === 'name') {
                $field[] = (object) [
                    'name'     => 'first-name',
                    'label'    => 'First Name',
                    'type'     => 'name'
                ];
                $field[] = (object) [
                    'name'     => 'middle-name',
                    'label'    => 'Middle Name',
                    'type'     => 'name'
                ];
                $field[] = (object) [
                    'name'     => 'last-name',
                    'label'    => 'Last Name',
                    'type'     => 'name'
                ];
                continue;
            } elseif ($val->type === 'address') {
                $allFld = $val->default_value;
                $addressKey = $val->field_key;
                foreach ($allFld as $key => $val) {
                    $field[] = (object) [
                        'name'     => $addressKey . '_' . $key,
                        'label'    => 'address_' . $key,
                        'type'     => 'address'
                    ];
                }
                continue;
            } elseif ($val->type === 'divider' || $val->type === 'end_divider') {
                $formName = $val->name;
                $fldKey = $val->field_key;
                $cnt = 0;
                for ($i = $key + 1; $i < count($fields); $i++) {
                    $id = $fields[$i]->id;
                    if (isset($fields[$i]->form_name) && $fields[$i]->form_name === $formName) {
                        $field[] = (object) [
                            'name'     => $fldKey . '_' . $id,
                            'label'    => $formName . ' ' . $fields[$i]->name,
                            'type'     => $fields[$i]->type
                        ];
                    }
                    $cnt++;
                    array_push($visistedKey, $fields[$i]->field_key);
                }
                continue;
            }
            if (in_array($val->field_key, $visistedKey)) {
                // continue;
            }
            $field[] = (object) [
                'name'     => $val->field_key,
                'label'    => $val->name,
                'type'     => $val->type
            ];
        }

        return $field;
    }

    public static function getFieldsValues($form, $entry_id)
    {
        $form_fields = [];
        $fields = \FrmFieldsHelper::get_form_fields($form->id);
        $entry_values = new \FrmEntryValues($entry_id);
        $field_values = $entry_values->get_field_values();

        foreach ($fields as $field) {
            $key = $field->field_key;

            $val = (isset($field_values[$field->id]) ? $field_values[$field->id]->get_saved_value() : '');

            if (is_array($val)) {
                if ($field->type === 'name') {
                    if (array_key_exists('first', $val) || array_key_exists('middle', $val) || array_key_exists('last', $val)) {
                        $form_fields['first-name'] = isset($val['first']) ? $val['first'] : '';
                        $form_fields['middle-name'] = isset($val['middle']) ? $val['middle'] : '';
                        $form_fields['last-name'] = isset($val['last']) ? $val['last'] : '';
                    }
                } elseif ($field->type == 'checkbox' || $field->type == 'file') {
                    $form_fields[$key] = $field->type == 'checkbox' && is_array($val) && count($val) == 1 ? $val[0] : $val;
                } elseif ($field->type == 'address') {
                    $addressKey = $field->field_key;
                    foreach ($val as $k => $value) {
                        $form_fields[$addressKey . '_' . $k] = $value;
                    }
                } elseif ($field->type == 'divider') {
                    $repeaterFld = $field->field_key;
                    global $wpdb;

                    $allDividerFlds = $wpdb->get_results("SELECT * FROM {$wpdb->prefix}frm_item_metas WHERE item_id IN (SELECT id FROM {$wpdb->prefix}frm_items WHERE parent_item_id = $entry_id)");
                    $allItemId = $wpdb->get_results("SELECT id FROM {$wpdb->prefix}frm_items WHERE parent_item_id = $entry_id");

                    $repeater = [];
                    foreach ($allItemId as $k => $value) {
                        $itemId = $value->id;
                        foreach ($allDividerFlds as $kTmp => $valueTmp) {
                            $fldId = $valueTmp->field_id;
                            if ($valueTmp->item_id == $itemId) {
                                $form_fields[$repeaterFld . '_' . $fldId . '_' . $itemId] = $valueTmp->meta_value;
                                $repeater[$itemId][] = (object) [
                                    $fldId => $valueTmp->meta_value
                                ];
                            }
                        }
                    }
                    $form_fields[$repeaterFld] = $repeater;
                }
                continue;
            }

            $form_fields[$key] = $val;
        }

        return $form_fields;
    }

    public static function handle_formidable_submit($conf_method, $form, $form_option, $entry_id, $extra_args)
    {
        $form_id = $form->id;
        $file = self::fields(($form_id));
        $fileFlds = [];
        foreach ($file as $fldKey => $fldVal) {
            if ($fldVal->type == 'file') {
                $fileFlds[] = $fldVal->name;
            }
        }

        $form_data = self::getFieldsValues($form, $entry_id);
        $post_id = url_to_postid($_SERVER['HTTP_REFERER']);

        if (!empty($form->id)) {
            $data = [];
            if ($post_id) {
                $form_data['post_id'] = $post_id;
            }

            foreach ($form_data as $key => $val) {
                if (in_array($key, $fileFlds)) {
                    if (is_array($val)) {
                        foreach ($val as $fileKey => $file) {
                            $tmpData = wp_get_attachment_url($form_data[$key][$fileKey]);
                            $form_data[$key][$fileKey] = Common::filePath($tmpData);
                        }
                    } else {
                        $tmpData = wp_get_attachment_url($form_data[$key]);
                        $form_data[$key] = Common::filePath($tmpData);
                    }
                }
            }
            if (!empty($form_id) && $flows = Flow::exists('Formidable', $form_id)) {
                Flow::execute('Formidable', $form_id, $form_data, $flows);
            }
        }
    }
}
