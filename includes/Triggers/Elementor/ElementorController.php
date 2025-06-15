<?php

namespace BitCode\FI\Triggers\Elementor;

use BitCode\FI\Flow\Flow;

final class ElementorController
{
    public static function info()
    {
        $plugin_path = self::pluginActive('get_name');
        return [
            'name' => 'Elementor',
            'title' => 'Elementor is the platform web creators choose to build professional WordPress websites, grow their skills, and build their business. Start for free today!',
            'slug' => $plugin_path,
            'pro' => $plugin_path,
            'type' => 'form',
            'is_active' => is_plugin_active($plugin_path),
            'activation_url' => wp_nonce_url(self_admin_url('plugins.php?action=activate&amp;plugin=' . $plugin_path . '&amp;plugin_status=all&amp;paged=1&amp;s'), 'activate-plugin_' . $plugin_path),
            'install_url' => wp_nonce_url(self_admin_url('update.php?action=install-plugin&plugin=' . $plugin_path), 'install-plugin_' . $plugin_path),
            'list' => [
                'action' => 'elementor/get',
                'method' => 'get',
            ],
            'fields' => [
                'action' => 'elementor/get/form',
                'method' => 'post',
                'data' => ['id']
            ],
        ];
    }

    public static function pluginActive($option = null)
    {
        if (is_plugin_active('elementor-pro/elementor-pro.php') || is_plugin_active('elementor/elementor.php')) {
            return true;
        }
        return false;
    }

    public function getAllForms()
    {
        if (!self::pluginActive()) {
            wp_send_json_error(__('Elementor Pro is not installed or activated', 'bit-integrations'));
        }

        $forms = ElementorHelper::all_forms();
        foreach ($forms as $form) {
            $all_forms[] = (object)[
                'id'        => $form['id'] . $form['post_id'],
                'title'     => $form['title'],
                'post_id'   => $form['post_id']
            ];
        }
        wp_send_json_success($all_forms);
    }

    public function getFormFields($data)
    {
        if (!self::pluginActive()) {
            wp_send_json_error(__('Elementor Pro is not installed or activated', 'bit-integrations'));
        }

        if (empty($data->id)) {
            wp_send_json_error(__('Form doesn\'t exists', 'bit-integrations'));
        }
        $fields = self::fields($data);
        if (empty($fields)) {
            wp_send_json_error(__('Form doesn\'t exists any field', 'bit-integrations'));
        }

        $responseData['fields'] = $fields;
        $responseData['postId'] = $data->postId;
        wp_send_json_success($responseData);
    }

    public static function fields($data)
    {
        if (empty($data->id)) {
            wp_send_json_error(__('Form doesn\'t exists', 'bit-integrations'));
        }
        $form_id = $data->id;
        $post_id = $data->postId;
        $fields = [];
        $allFormsDetails = ElementorHelper::all_elementor_forms();

        foreach ($allFormsDetails as $form) {
            if ($form['id'] == substr($form_id, 0, -strlen($post_id)) &&  $form['post_id'] == $post_id) {
                foreach ($form['form_fields'] as $field) {
                    $type = isset($field->field_type) ? $field->field_type : 'text';
                    if ($type === 'upload') {
                        $type = 'file';
                    }

                    $fields[] = [
                        'name' => $field->custom_id,
                        'type' => $type,
                        'label' => $field->field_label,
                    ];
                }
            }
        }

        if (!empty($fields)) {
            return $fields;
        }
        return false;
    }

    public static function handle_elementor_submit($record)
    {
        global $wpdb;
        $flows = $wpdb->get_results(
            $wpdb->prepare(
                "SELECT * FROM {$wpdb->prefix}btcbi_flow
                WHERE status = %s 
                AND triggered_entity = %s 
                AND (triggered_entity_id = %s
                OR triggered_entity_id = %s)",
                '1',
                'Elementor',
                $record->get_form_settings('id'),
                $record->get_form_settings('id') . $record->get_form_settings('form_post_id')
            )
        );

        if (!$flows) {
            return;
        }

        $data   = [];
        $fields = $record->get('fields');
        foreach ($fields as $field) {
            if ($field['type'] == 'upload') {
                $data[$field['id']] = explode(',', $field['raw_value']);
            } else {
                $data[$field['id']] = $field['raw_value'];
            }
        }

        Flow::execute('Elementor', $flows[0]->triggered_entity_id, $data, $flows);
    }
}
