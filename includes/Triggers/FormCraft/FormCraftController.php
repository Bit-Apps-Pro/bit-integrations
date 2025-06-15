<?php
namespace BitCode\FI\Triggers\FormCraft;

use BitCode\FI\Flow\Flow;

final class FormCraftController
{
    public static function info()
    {
        return [
            'name' => 'FormCraft3',
            'title' => 'FormCraft3 is a drag-and-drop form builder to create and embed forms, and track submissions.',
            'type' => 'form',
            'is_active' => self::plugin_active(),
            'list' => [
                'action' => 'formcraft/get',
                'method' => 'get',
            ],
            'fields' => [
                'action' => 'formcraft/get/form',
                'method' => 'post',
                'data' => ['id']
            ],
        ];
    }

    public static function plugin_active()
    {
        return is_plugin_active('formcraft3/formcraft-main.php');
    }

    public function getAll()
    {
        if (!self::plugin_active()) {
            wp_send_json_error(__('FormCraft3 is not installed or activated', 'bit-integrations'));
        }

        $forms = self::getAllForms();

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

    public static function getAllForms()
    {
        global $wpdb;
        if (is_plugin_active('formcraft3/formcraft-main.php')) {
            return $forms = $wpdb->get_results("SELECT id,name FROM {$wpdb->prefix}formcraft_3_forms");
        }
        return false;
    }

    public function get_a_form($data)
    {
        if (!self::plugin_active()) {
            wp_send_json_error(__('FormCraft3 is not installed or activated', 'bit-integrations'));
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
        $fields = [];
        global $wpdb;
        $forms = $wpdb->get_results("SELECT id,name,meta_builder FROM {$wpdb->prefix}formcraft_3_forms WHERE id = $form_id");
        $fieldsData = $forms[0]->meta_builder;
        $fieldsDetails = json_decode(stripslashes_deep($fieldsData));

        foreach ($fieldsDetails->fields as $field) {
            if (!($field->type === 'submit')) {
                $fields[] = [
                    'name' => $field->identifier,
                    'type' => $field->type === 'oneLineText' ? 'text' : $field->type,
                    'label' => $field->elementDefaults->main_label,
                ];
            }
        }
        return $fields;
    }

    public static function handle_formcraft_submit($template, $meta, $content, $integrations)
    {
        $form_id = $template['Form ID'];

        $finalData = [];
        if (!empty($content)) {
            foreach ($content as $value) {
                if ($value['type'] === 'fileupload') {
                    $finalData[$value['identifier']] = $value['url'][0];
                } else {
                    $finalData[$value['identifier']] = $value['value'];
                }
            }
        }

        if (!empty($finalData) && !empty($form_id) && $flows = Flow::exists('FormCraft', $form_id)) {
            Flow::execute('FormCraft', $form_id, $finalData, $flows);
        }
    }
}
