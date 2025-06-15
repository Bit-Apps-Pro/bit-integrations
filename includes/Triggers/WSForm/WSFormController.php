<?php
namespace BitCode\FI\Triggers\WSForm;

use BitCode\FI\Flow\Flow;

final class WSFormController
{
    public static function info()
    {
        $plugin_path = 'ws-form-pro/ws-form.php';
        return [
            'name' => 'WSForm',
            'title' => 'WSForm - WS Form LITE is a powerful contact form builder plugin for WordPress.',
            'slug' => $plugin_path,
            'pro' => 'ws-form-pro/ws-form.php',
            'type' => 'form',
            'is_active' => is_plugin_active('ws-form-pro/ws-form.php'),
            'activation_url' => wp_nonce_url(self_admin_url('plugins.php?action=activate&amp;plugin=' . $plugin_path . '&amp;plugin_status=all&amp;paged=1&amp;s'), 'activate-plugin_' . $plugin_path),
            'install_url' => wp_nonce_url(self_admin_url('update.php?action=install-plugin&plugin=' . $plugin_path), 'install-plugin_' . $plugin_path),
            'list' => [
                'action' => 'wsform/get',
                'method' => 'get',
            ],
            'fields' => [
                'action' => 'wsform/get/form',
                'method' => 'post',
                'data' => ['id']
            ],
            'note' => '
            <h4>Setup Action Hook</h4>
            <ul>
                <li>Goto <b>Actions</b> and create an action</li>
                <li>Select Action <b>Run WordPress Hook</b></li>
                <li>Select Type <b>Action</b></li>
                <li>Add Hook Tag <b>ws_form_action_for_bi</b></li>
            </ul>
            <h4>File Upload</h4>
            <ul>
                <li>Goto <b>Field Settings</b></li>
                <li>Under File Handler select Save To <b>WS Form (Public)</b></li>
            </ul>
            '
        ];
    }

    public static function handle_ws_form_submit($form, $submit)
    {
        $form_id = $submit->form_id;

        $flows = Flow::exists('WSForm', $form_id);
        if (!$flows) {
            return;
        }

        $data = [];
        if (isset($submit->meta)) {
            foreach ($submit->meta as $key => $field_value) {
                if (empty($field_value) || (is_array($field_value) && !array_key_exists('id', $field_value))) {
                    continue;
                }
                $value = wsf_submit_get_value($submit, $key);

                if (($field_value['type'] == 'file' || $field_value['type'] == 'signature') && !empty($value)) {
                    $upDir = wp_upload_dir();
                    $files = $value;
                    $value = [];

                    if (is_array($files)) {
                        foreach ($files as $k => $file) {
                            if (array_key_exists('hash', $file)) {
                                continue;
                            }
                            $value[$k] = $upDir['basedir'] . '/' . $file['path'];
                        }
                    }
                } elseif ($field_value['type'] == 'radio') {
                    $value = is_array($value) ? $value[0] : $value;
                }
                $data[$key] = $value;
            }
        }

        Flow::execute('WSForm', $form_id, $data, $flows);
    }

    public function getAll()
    {
        if (!is_plugin_active('ws-form-pro/ws-form.php')) {
            wp_send_json_error(__('WS Form Pro is not installed or activated', 'bit-integrations'));
        }

        $forms = wsf_form_get_all(true, 'label');

        $all_forms = [];
        if ($forms) {
            foreach ($forms as $form) {
                $all_forms[] = (object)[
                    'id' => $form['id'],
                    'title' => $form['label'],
                ];
            }
        }
        wp_send_json_success($all_forms);
    }

    public function get_a_form($data)
    {
        if (!is_plugin_active('ws-form-pro/ws-form.php')) {
            wp_send_json_error(__('WS Form Pro is not installed or activated', 'bit-integrations'));
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
        $form = wsf_form_get_form_object($form_id, false);
        $fieldDetails = wsf_form_get_fields($form);

        if (empty($fieldDetails)) {
            return $fieldDetails;
        }
        $fields = [];
        foreach ($fieldDetails as $field) {
            if ($field->type !== 'submit') {
                $type = $field->type;
                if ($type === 'signature') {
                    $type = 'file';
                }

                $fields[] = [
                    'name' => 'field_' . $field->id,
                    'type' => $type,
                    'label' => $field->label,
                ];
            }
        }
        return $fields;
    }
}
