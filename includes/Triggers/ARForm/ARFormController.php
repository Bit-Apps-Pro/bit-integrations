<?php

namespace BitCode\FI\Triggers\ARForm;

use DateTime;
use BitCode\FI\Flow\Flow;
use BitCode\FI\Core\Util\Common;

final class ARFormController
{
    public static function info()
    {
        $plugin_path = 'arforms-form-builder/arforms-form-builder.php';
        return [
            'name' => 'ARForm',
            'title' => 'ARForms - More than just a WordPress Form Builder',
            'slug' => $plugin_path,
            'pro' => 'arforms/arforms.php',
            'type' => 'form',
            'is_active' => self::isARFormActive(),
            'activation_url' => wp_nonce_url(self_admin_url('plugins.php?action=activate&amp;plugin=' . $plugin_path . '&amp;plugin_status=all&amp;paged=1&amp;s'), 'activate-plugin_' . $plugin_path),
            'install_url' => wp_nonce_url(self_admin_url('update.php?action=install-plugin&plugin=' . $plugin_path), 'install-plugin_' . $plugin_path),
            'list' => [
                'action' => 'arform/get',
                'method' => 'get',
            ],
            'fields' => [
                'action' => 'arform/get/form',
                'method' => 'post',
                'data' => ['id']
            ],
        ];
    }

    public static function isARFormActive()
    {
        return is_plugin_active('arforms-form-builder/arforms-form-builder.php') || is_plugin_active('arforms/arforms.php');
    }

    public function getAll()
    {
        if (!self::isARFormActive()) {
            wp_send_json_error(__('AR form is not installed or activated', 'bit-integrations'));
        }

        $forms = self::getAllARForms();

        $all_forms = [];
        if ($forms) {
            foreach ($forms as $form) {
                $all_forms[] = (object)[
                    'id' => $form->id,
                    'title' => $form->name,
                ];
            }
        }
        wp_send_json_success($all_forms);
    }

    public function get_a_form($data)
    {
        if (!self::isARFormActive()) {
            wp_send_json_error(__('ARForms is not installed or activated', 'bit-integrations'));
        }
        if (empty($data->id)) {
            wp_send_json_error(__('Form doesn\'t exists', 'bit-integrations'));
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
        global $wpdb;
        $fields = [];

        $checkVersion = self::versionName();
        $table_name = '';
        if ($checkVersion === 'allActive' || $checkVersion === 'proActive') {
            $table_name = "{$wpdb->prefix}arf_fields";
        } elseif ($checkVersion === 'liteActive') {
            $table_name = "{$wpdb->prefix}arflite_fields";
        } else {
            return [];
        }

        $all_lite_form_fields = $wpdb->get_results($wpdb->prepare("SELECT id,field_key,name,type FROM $table_name WHERE form_id = %d", $form_id));
        foreach ($all_lite_form_fields as $field) {
            $fields[] = [
                'name' => $field->id,
                'type' => $field->type,
                'label' => $field->name,
            ];
        }
        return $fields;
    }

    public static function handleArFormSubmit($params, $errors, $form, $item_meta_values)
    {
        $form_id = $form->id;

        if (!empty($form_id) && $flows = Flow::exists('ARForm', $form_id)) {
            Flow::execute('ARForm', $form_id, $item_meta_values, $flows);
        }
    }

    public static function getAllARForms()
    {
        global $wpdb;
        $checkVersion = self::versionName();
        $table_name = '';
        if ($checkVersion === 'allActive' || $checkVersion === 'proActive') {
            $table_name = "{$wpdb->prefix}arf_forms";
        } elseif ($checkVersion === 'liteActive') {
            $table_name = "{$wpdb->prefix}arflite_forms";
        } else {
            return [];
        }

        $all_lite_forms = $wpdb->get_results($wpdb->prepare("SELECT id,name FROM $table_name"));
        return $all_lite_forms;
    }

    public static function versionName()
    {
        if (is_plugin_active('arforms-form-builder/arforms-form-builder.php') && is_plugin_active('arforms/arforms.php')) {
            return 'allActive';
        } elseif (class_exists('arfliteformcontroller')) {
            return 'liteActive';
        } elseif (is_plugin_active('arforms/arforms.php')) {
            return 'proActive';
        }
        return 'noneActive';
    }
}
