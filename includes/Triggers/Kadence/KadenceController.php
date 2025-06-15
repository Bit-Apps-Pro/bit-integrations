<?php
namespace BitCode\FI\Triggers\Kadence;

use BitCode\FI\Flow\Flow;

final class KadenceController
{
    public static function info()
    {
        $plugin_path = self::pluginActive('get_name');
        return [
            'name' => 'Kadence Blocks Form',
            'title' => 'Kadence Blocks Form - Flexible and Design-Friendly Contact Form builder plugin for WordPress',
            'slug' => $plugin_path,
            'pro' => 'kadence-blocks/kadence-blocks.php',
            'type' => 'form',
            'is_active' => self::pluginActive(),
            'activation_url' => wp_nonce_url(self_admin_url('plugins.php?action=activate&amp;plugin=' . $plugin_path . '&amp;plugin_status=all&amp;paged=1&amp;s'), 'activate-plugin_' . $plugin_path),
            'install_url' => wp_nonce_url(self_admin_url('update.php?action=install-plugin&plugin=' . $plugin_path), 'install-plugin_' . $plugin_path),
            'list' => [
                'action' => 'kadence/get',
                'method' => 'get',
            ],
            'fields' => [
                'action' => 'kadence/get/form',
                'method' => 'post',
                'data' => ['id']
            ],
        ];
    }

    public static function pluginActive($option = null)
    {
        if (is_plugin_active('kadence-blocks-pro/kadence-blocks-pro.php')) {
            return $option === 'get_name' ? 'kadence-blocks-pro/kadence-blocks-pro.php' : true;
        } elseif (is_plugin_active('kadence-blocks/kadence-blocks.php')) {
            return $option === 'get_name' ? 'kadence-blocks/kadence-blocks.php' : true;
        } else {
            return false;
        }
    }

    public static function get_all_forms()
    {
        global $wpdb;
        $forms = $wpdb->get_results("select id,post_title,post_content from {$wpdb->posts} where post_content like '%<!-- wp:kadence/form%' and post_status = 'publish'");
        return $forms;
    }

    public function getAll()
    {
        if (!self::pluginActive()) {
            wp_send_json_error(__('Kadence Blocks is not installed or activated', 'bit-integrations'));
        };

        $forms = self::get_all_forms();
        $all_forms = [];
        foreach ($forms as $key => $val) {
            $form_id = $val->id;
            $form_title = $val->post_title;
            $form_content = $val->post_content;

            $contentArray = explode('<!--', $form_content);
            $content = [];
            foreach ($contentArray as $key => $value) {
                if (str_contains($value, ' wp:kadence/form')) {
                    $temp = str_replace(' wp:kadence/form', '', $value);
                    $temp1 = explode('-->', $temp, 2);
                    $content[] = json_decode($temp1[0]);
                }
            }

            if (is_array($content)) {
                foreach ($content as $form) {
                    $parent_id = $form->postID;
                    $unique_id = $form->uniqueID;
                    $all_forms[] = (object)[
                        'id' => $form_id . '_' . $unique_id,
                        'title' => $form_title . '_' . $unique_id,
                        'parent_id' => $parent_id,
                    ];
                }
            }
        }
        wp_send_json_success($all_forms);
    }

    public function get_a_form($data)
    {
        if (!self::pluginActive()) {
            wp_send_json_error(__('Kadence Blocks is not installed or activated', 'bit-integrations'));
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

    public static function parseData($form_id)
    {
        $posDelimeter = strpos($form_id, '_');
        $post_id = substr($form_id, 0, $posDelimeter);
        $unique_id = substr($form_id, $posDelimeter + 1);
        $condition = '%wp:kadence/form {"uniqueID":"' . $unique_id . '"%';
        global $wpdb;
        $formInfo = $wpdb->get_results("select post_content from {$wpdb->posts} where post_content like '$condition' and post_status = 'publish'");

        $form_content = $formInfo[0]->post_content;
        $contentArray = explode('<!--', $form_content);
        $formFields = [];
        foreach ($contentArray as $key => $value) {
            $tmpStr = ' wp:kadence/form {"uniqueID":"' . $unique_id . '","postID":"' . $post_id . '"';
            if (str_contains($value, $tmpStr)) {
                $temp = str_replace(' wp:kadence/form', '', $value);

                $temp1 = explode('><', $temp);

                $cnt = 0;
                foreach ($temp1 as $key1 => $value1) {
                    if (str_contains($value1, 'data-type')) {
                        $regularExpressionName = '/name\s*=\s*"([^"]+)"/';
                        preg_match($regularExpressionName, $value1, $fieldName);
                        $regularExpressionId = '/id\s*=\s*"([^"]+)"/';
                        preg_match($regularExpressionId, $value1, $fieldId);
                        $regularExpressionDataLabel = '/data-label\s*=\s*"([^"]+)"/';
                        preg_match($regularExpressionDataLabel, $value1, $fieldDataLabel);
                        $regularExpressionDataType = '/data-type\s*=\s*"([^"]+)"/';
                        preg_match($regularExpressionDataType, $value1, $fieldDataType);

                        $formFields[] = (object)[
                            'name' => $fieldName[1],
                            'type' => strtolower(isset($fieldDataType[1]) ? $fieldDataType[1] : 'text'),
                            'label' => isset($fieldDataLabel[1]) ? $fieldDataLabel[1] : $fieldId[1],
                        ];
                    }
                }
            }
        }
        return $formFields;
    }

    public static function fields($form_id)
    {
        $fields = [];

        $fields = self::parseData($form_id);
        return $fields;
    }

    public static function handle_kadence_form_submit($form_args, $fields, $form_id, $post_id)
    {
        if (!$form_id) {
            return;
        }
        $flows = Flow::exists('Kadence', $post_id . '_' . $form_id);
        if (!$flows) {
            return;
        }
        $data = [];
        foreach ($fields as $key => $field) {
            $data['kb_field_' . $key] = $field['value'];
        }
        Flow::execute('Kadence', $form_id, $data, $flows);
    }
}
