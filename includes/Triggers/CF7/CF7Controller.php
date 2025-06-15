<?php

namespace BitCode\FI\Triggers\CF7;

use BitCode\FI\Flow\Flow;

final class CF7Controller
{
    
    public static function info()
    {
        $plugin_path = 'contact-form-7/wp-contact-form-7.php';
        return [
            'name' => 'Contact Form 7',
            'title' => 'Just another contact form plugin. Simple but flexible.',
            'slug' => $plugin_path,
            'type' => 'form',
            'is_active' => class_exists('WPCF7_ContactForm'),
            'activation_url' => wp_nonce_url(self_admin_url('plugins.php?action=activate&amp;plugin=' . $plugin_path . '&amp;plugin_status=all&amp;paged=1&amp;s'), 'activate-plugin_' . $plugin_path),
            'install_url' => wp_nonce_url(self_admin_url('update.php?action=install-plugin&plugin=' . $plugin_path), 'install-plugin_' . $plugin_path),
            'list' => [
                'action' => 'cf7/get',
                'method' => 'get',
            ],
            'fields' => [
                'action' => 'cf7/get/form',
                'method' => 'post',
                'data' => ['id']
            ],
        ];
    }


    public function getAll()
    {
        if (!class_exists('WPCF7_ContactForm')) {
            wp_send_json_error(__('Contact Form 7 is not installed or activated', 'bit-integrations'));
        }
        $forms = \WPCF7_ContactForm::find();
        $all_forms = [];
        foreach ($forms as $form) {
            $all_forms[] = (object)[
                'id' => $form->id(),
                'title' => $form->title()
            ];
        }
        wp_send_json_success($all_forms);
    }
    public function get_a_form($data)
    {
        $fields = self::fields($data->id);
        $missing_field = null;
        if (!property_exists($data, 'id')) {
            $missing_field = 'Form ID';
        }
        if (!is_null($missing_field)) {
            wp_send_json_error(sprintf(__('%s can\'t be empty', 'bit-integrations'), $missing_field));
        }
        if (empty($fields)) {
            wp_send_json_error(__('Form doesn\'t exists any field', 'bit-integrations'));
        }

        $responseData['fields'] = $fields;
        wp_send_json_success($responseData);
    }

    public static function fields($form_id)
    {
        $form_text = \get_post_meta($form_id, '_form', true);

        if (method_exists('WPCF7_FormTagsManager', 'get_instance')) {
            $formManager = \WPCF7_FormTagsManager::get_instance();
            $formManager->scan($form_text);
            $fieldDetails = $formManager->get_scanned_tags();
        } elseif (method_exists('WPCF7_ShortcodeManager', 'get_instance')) { //
            $formManager = \WPCF7_ShortcodeManager::get_instance();
            $formManager->do_shortcode($form_text);
            $fieldDetails = $formManager->get_scanned_tags();
        }
        if (empty($fieldDetails)) {
            return $fieldDetails;
        }

        $fields = [];
        
        foreach ($fieldDetails as $field) {
            if (!empty($field->name) && $field->type !== 'submit') {
                $fields[] = [
                    'name' => $field->name,
                    'type' => $field->basetype,
                    'label' => $field->name,
                ];
            }
        }
        return $fields;
    }

    public static function handle_wpcf7_submit()
    {
        $submission = \WPCF7_Submission::get_instance();

        $postID = (int) $submission->get_meta('container_post_id');


        if (!$submission || !$posted_data = $submission->get_posted_data()) {
            return;
        }

        if (isset($posted_data['_wpcf7'])) {
            $form_id = $posted_data['_wpcf7'];
        } else {
            $current_form = \WPCF7_ContactForm::get_current();
            $form_id = $current_form->id();
        }
        $files = $submission->uploaded_files();
        $posted_data = array_merge($posted_data, $files);

        if ($postID) {
            $posted_data['post_id'] = $postID;
        }

        // array to string conversion for radio and select fields
        $data = [];
        foreach ($posted_data as $key => $value) {
            if (is_array($value) && count($value) == 1) {
                $data[$key] = $posted_data[$key][0];
            } else {
                $data[$key] = $posted_data[$key];
            }
        }

        if (!empty($form_id) && $flows = Flow::exists('CF7', $form_id)) {
            Flow::execute('CF7', $form_id, $data, $flows);
        }
    }
}
