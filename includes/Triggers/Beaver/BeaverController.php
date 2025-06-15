<?php

namespace BitCode\FI\Triggers\Beaver;

use BitCode\FI\Flow\Flow;

final class BeaverController
{
    public static function info()
    {
        $plugin_path = 'bb-plugin/fl-builder.php';
        return [
            'name'           => 'Beaver Builder',
            'title'          => 'WordPress Page Builder',
            'slug'           => $plugin_path,
            'pro'            => $plugin_path,
            'type'           => 'form',
            'is_active'      => is_plugin_active($plugin_path),
            'activation_url' => wp_nonce_url(self_admin_url('plugins.php?action=activate&amp;plugin=' . $plugin_path . '&amp;plugin_status=all&amp;paged=1&amp;s'), 'activate-plugin_' . $plugin_path),
            'install_url'    => wp_nonce_url(self_admin_url('update.php?action=install-plugin&plugin=' . $plugin_path), 'install-plugin_' . $plugin_path),
            'list'           => [
                'action' => 'beaver/get',
                'method' => 'get',
            ],
            'fields'         => [
                'action' => 'beaver/get/form',
                'method' => 'post',
                'data'   => ['id']
            ],
        ];
    }

    public static function beaver_contact_form_submitted($mailto, $subject, $template, $headers, $settings, $result)
    {
        $form_id = 'bb_contact_form';
        $flows = Flow::exists('Beaver', $form_id);
        if (!$flows) {
            return;
        }

        $template = str_replace('Name', '|Name', $template);
        $template = str_replace('Email', '|Email', $template);
        $template = str_replace('Phone', '|Phone', $template);
        $template = str_replace('Message', '|Message', $template);

        $filterData = explode('|', $template);
        $filterData = array_map('trim', $filterData);
        $filterData = array_filter($filterData, function ($value) {
            return $value !== '';
        });

        $data = ['subject' => isset($subject) ? $subject : '',];
        foreach ($filterData as $value) {
            $item = explode(':', $value);
            $data[strtolower($item[0])] = trim($item[1]);
        }
        Flow::execute('Beaver', $form_id, $data, $flows);
    }

    public static function beaver_subscribe_form_submitted($response, $settings, $email, $name, $template_id, $post_id)
    {
        $form_id = 'bb_subscription_form';
        $flows = Flow::exists('Beaver', $form_id);
        if (!$flows) {
            return;
        }

        $data = [
            'name' => isset($name) ? $name : '',
            'email' => isset($email) ? $email : '',
        ];
        Flow::execute('Beaver', $form_id, $data, $flows);
    }

    public static function beaver_login_form_submitted($settings, $password, $name, $template_id, $post_id)
    {
        $form_id = 'bb_login_form';
        $flows = Flow::exists('Beaver', $form_id);
        if (!$flows) {
            return;
        }

        $data = [
            'name' => isset($name) ? $name : '',
            'password' => isset($password) ? $password : '',
        ];
        Flow::execute('Beaver', $form_id, $data, $flows);
    }

    public function getAllForms()
    {
        if (!is_plugin_active('bb-plugin/fl-builder.php')) {
            wp_send_json_error(__('Beaver Builder is not installed or activated', 'bit-integrations'));
        }

        $forms = [[
            'id'    => 'bb_contact_form',
            'title' => 'Contact Form',
        ], [
            'id'    => 'bb_subscription_form',
            'title' => 'Subscription Form',
        ], [
            'id'    => 'bb_login_form',
            'title' => 'Login Form',
        ]];

        $all_forms = [];
        foreach ($forms as $form) {
            $all_forms[] = (object) [
                'id'    => $form['id'],
                'title' => $form['title'],
            ];
        }
        wp_send_json_success($all_forms);
    }

    public function getFormFields($data)
    {
        if (!is_plugin_active('bb-plugin/fl-builder.php')) wp_send_json_error(__('Beaver Builder is not installed or activated', 'bit-integrations'));
        if (empty($data->id)) wp_send_json_error(__('Form doesn\'t exists', 'bit-integrations'));

        $fields = self::fields($data->id);
        if (empty($fields)) wp_send_json_error(__('Form doesn\'t exists any field', 'bit-integrations'));

        $responseData['fields'] = $fields;
        wp_send_json_success($responseData);
    }

    public static function fields($data)
    {
        $form_fields = self::get_form_fields($data);
        $fields = [];
        foreach ($form_fields as $field) {
            $fields[] = [
                'name'  => $field['id'],
                'type'  => $field['field_type'],
                'label' => $field['field_label'],
            ];
        }
        return $fields;
    }

    public static function get_form_fields($form_id)
    {
        $loginForm = \FLBuilderModel::get_settings_form_defaults('login-form');
        
        $form_fields = [
            'bb_contact_form' => [
                ['id' => 'name', 'field_label' => 'Name', 'field_type' => 'text'],
                ['id' => 'subject', 'field_label' => 'Subject', 'field_type' => 'text'],
                ['id' => 'email', 'field_label' => 'Email', 'field_type' => 'email'],
                ['id' => 'phone', 'field_label' => 'Phone', 'field_type' => 'text'],
                ['id' => 'message', 'field_label' => 'Message', 'field_type' => 'textarea']
            ],
            'bb_subscription_form' => [
                ['id' => 'name', 'field_label' => 'Name', 'field_type' => 'text'],
                ['id' => 'email', 'field_label' => 'Email', 'field_type' => 'email'],
            ],
            'bb_login_form' => [
                ['id' => 'name', 'field_label' => isset($loginForm->name_field_text) ? $loginForm->name_field_text : 'Username', 'field_type' => 'text'],
                ['id' => 'password', 'field_label' => isset($loginForm->password_field_text) ? $loginForm->password_field_text : 'Password', 'field_type' => 'password'],
            ],
        ];
        return isset($form_fields[$form_id]) ? $form_fields[$form_id] : [];
    }
}
