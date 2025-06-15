<?php
namespace BitCode\FI\Triggers\PiotnetForms;

use BitCode\FI\Core\Util\Common;
use BitCode\FI\Flow\Flow;

final class PiotnetFormsController
{
    public static function info()
    {
        $plugin_path = self::pluginActive('get_name');

        return [
            'name' => 'Piotnet Forms',
            'title' => 'Piotnet Forms - Highly Customizable WordPress Form Builder',
            'slug' => $plugin_path,
            'pro' => 'piotnetforms/piotnetforms.php',
            'type' => 'form',
            // 'is_active'      => class_exists('Piotnetforms'),
            'is_active' => self::pluginActive(),

            'activation_url' => wp_nonce_url(self_admin_url('plugins.php?action=activate&amp;plugin=' . $plugin_path . '&amp;plugin_status=all&amp;paged=1&amp;s'), 'activate-plugin_' . $plugin_path),
            'install_url' => wp_nonce_url(self_admin_url('update.php?action=install-plugin&plugin=' . $plugin_path), 'install-plugin_' . $plugin_path),
            'list' => [
                'action' => 'piotnetforms/get',
                'method' => 'get',
            ],
            'fields' => [
                'action' => 'piotnetforms/get/form',
                'method' => 'post',
                'data' => ['id']
            ],
            'note' => 'Please make sure that all of your input fields <b>"Form ID"</b> are same for the selected form.'
        ];
    }

    public static function pluginActive($option = null)
    {
        if (is_plugin_active('piotnetforms-pro/piotnetforms-pro.php')) {
            return $option === 'get_name' ? 'piotnetforms-pro/piotnetforms-pro.php' : true;
        } elseif (is_plugin_active('piotnetforms/piotnetforms.php')) {
            return $option === 'get_name' ? 'piotnetforms/piotnetforms.php' : true;
        } else {
            return false;
        }
    }

    public static function handle_piotnet_submit($fields)
    {
        $post_id = $_REQUEST['post_id'];

        $flows = Flow::exists('PiotnetForms', $post_id);
        if (!$flows) {
            return;
        }

        $data = [];
        foreach ($fields as $field) {
            if ((key_exists('type', $field) && ($field['type'] == 'file' || $field['type'] == 'signature')) || (key_exists('image_upload', $field) && $field['image_upload'] > 0)) {
                $field['value'] = Common::filePath($field['value']);
            }
            $data[$field['name']] = $field['value'];
        }

        Flow::execute('PiotnetForms', $post_id, $data, $flows);
    }

    // public static function pro_handle_piotnet_submit($form_details)
    // {
    //     var_dump($form_details, 'pro_handle_piotnet_submit');
    //     die;
    //     $form_id = $form_details['id'];
    //     $fields = $form_details['fields'];

    //     $flows = Flow::exists('PiotnetForms', $form_id);
    //     if (!$flows) {
    //         return;
    //     }

    //     $data = [];
    //     foreach ($fields as $field) {
    //         if ((key_exists('type', $field) && ($field['type'] == 'file' || $field['type'] == 'signature')) || (key_exists('image_upload', $field) && $field['image_upload'] > 0)) {
    //             $field['value'] = Common::filePath($field['value']);
    //         }
    //         $data[$field['name']] = $field['value'];
    //     }

    //     Flow::execute('PiotnetForms', $form_id, $data, $flows);
    // }

    public function getAll()
    {
        if (!self::pluginActive()) {
            wp_send_json_error(__('Piotnet Forms is not installed or activated', 'bit-integrations'));
        }

        $forms = self::getPiotnetForms();

        $all_forms = [];
        if ($forms) {
            foreach ($forms as $form) {
                $all_forms[] = (object)[
                    'id' => $form->ID,
                    'title' => $form->post_title,
                ];
            }
        }
        wp_send_json_success($all_forms);
    }

    public function get_a_form($data)
    {
        if (!self::pluginActive()) {
            wp_send_json_error(__('Piotnet Forms is not installed or activated', 'bit-integrations'));
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
        $fieldDetails = self::getPiotnetFormFields($form_id);
        if (empty($fieldDetails)) {
            return $fieldDetails;
        }

        $fields = [];
        $i = 0;
        foreach ($fieldDetails as $field) {
            if ($field->type !== 'field') {
                continue;
            }

            $field = $field->settings;
            if ($field->field_type !== 'submit') {
                $type = $field->field_type;
                if ($type === 'upload' || $type === 'image_upload' || $type === 'signature' || $type === 'image_select') {
                    $type = 'file';
                }

                $fields[$i] = [
                    'name' => $field->field_id,
                    'type' => $type,
                    'label' => $field->field_label,
                ];
                if ($type == 'checkbox') {
                    $fields[$i]['separator'] = ',';
                }
            }
            $i++;
        }
        return $fields;
    }

    private static function getPiotnetForms()
    {
        global $wpdb;
        return $wpdb->get_results("SELECT ID, post_title FROM $wpdb->posts WHERE post_status='publish' AND post_type='piotnetforms'");
    }

    private static function getPiotnetFormFields(int $form_id)
    {
        global $wpdb;
        $postMeta = $wpdb->get_results("SELECT meta_value FROM $wpdb->postmeta WHERE post_id=$form_id AND meta_key='_piotnetforms_data' LIMIT 1");
        return json_decode($postMeta[0]->meta_value)->widgets;
    }
}
