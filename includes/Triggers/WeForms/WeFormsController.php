<?php

namespace BitCode\FI\Triggers\WeForms;

use BitCode\FI\Flow\Flow;
use DateTime;

final class WeFormsController
{
    public static function info()
    {
        $plugin_path = 'weforms/weforms.php';
        return [
            'name' => 'WeForms',
            'title' => 'WeForms - Contact Form, Payment Form & Custom Form Builder',
            'slug' => $plugin_path,
            'pro' => 'weforms/weforms.php',
            'type' => 'form',
            'is_active' => class_exists('WeForms'),
            'activation_url' => wp_nonce_url(self_admin_url('plugins.php?action=activate&amp;plugin=' . $plugin_path . '&amp;plugin_status=all&amp;paged=1&amp;s'), 'activate-plugin_' . $plugin_path),
            'install_url' => wp_nonce_url(self_admin_url('update.php?action=install-plugin&plugin=' . $plugin_path), 'install-plugin_' . $plugin_path),
            'list' => [
                'action' => 'weforms/get',
                'method' => 'get',
            ],
            'fields' => [
                'action' => 'weforms/get/form',
                'method' => 'post',
                'data' => ['id']
            ],
        ];
    }

    public function getAll()
    {
        if (!function_exists('weforms')) {
            wp_send_json_error(__('WeForms is not installed or activated', 'bit-integrations'));
        }

        $forms =  \weforms()->form->all();
        $all_forms = [];

        if ($forms) {
            foreach ($forms['forms'] as $form) {
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
        if (!class_exists('WeForms')) {
            wp_send_json_error(__('WeForms is not installed or activated', 'bit-integrations'));
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
        $fieldDetails = \weforms()->form->get($form_id)->get_fields();
        $fields = [];
        // new way

        foreach ($fieldDetails as  $id => $field) {
            if ($field['template'] == 'name_field') {
                if ($field['format'] == 'first-last') {
                    $names = ['first' => 'First', 'last' => 'Last'];
                } else {
                    $names = ['first' => 'First', 'last' => 'Last', 'middle' => 'Middle'];
                }

                foreach ($names as $key => $value) {
                    $fields[] = [
                        'name' => "{$key}_name",
                        'type' => "text",
                        'label' => "$value " . $field['label'],
                    ];
                }
            } else {
                // $fields[] = [
                //     'name' => $id,
                //     'type' => $field['type'] === 'file-upload' ? 'file' : $field['type'],
                //     'separator' => isset($field['multiple']) && $field['multiple']==1 || in_array($field['type'], ['checkbox','file-upload']) ? "\n" : '',
                //     'label' => $field['label'],
                // ];

                if ($field['template'] === 'multiple_select') {
                    $fields[] = [
                        'name' => $field['name'],
                        'type' => rtrim($field['template'], '_select'),
                        'label' => $field['label'],
                    ];
                }
                if ($field['template'] === 'email_address') {
                    $fields[] = [
                        'name' => $field['name'],
                        'type' => rtrim($field['template'], '_address'),
                        'label' => $field['label'],
                    ];
                } else {
                    $fields[] = [
                        'name' => $field['name'],
                        'type' => rtrim($field['template'], '_field'),
                        'label' => $field['label'],
                    ];
                }
            }
        }


        // end

        // foreach ($fieldDetails as $field) {
        //     if ($field['template'] === 'multiple_select') {
        //         $fields[] = [
        //             'name' => $field['name'],
        //             'type' => rtrim($field['template'], '_select'),
        //             'label' => $field['label'],
        //         ];
        //     }
        //     if ($field['template'] === 'email_address') {
        //         $fields[] = [
        //             'name' => $field['name'],
        //             'type' => rtrim($field['template'], '_address'),
        //             'label' => $field['label'],
        //         ];
        //     } else {
        //         $fields[] = [
        //             'name' => $field['name'],
        //             'type' => rtrim($field['template'], '_field'),
        //             'label' => $field['label'],
        //         ];
        //     }
        // }
        return $fields;
    }

    public static function handle_weforms_submit($entry_id, $form_id, $page_id, $form_settings)
    {
        $dataAll = \weforms_get_entry_data($entry_id);

        foreach ($dataAll['fields'] as $key => $field) {
            if ($field['type'] === 'image_upload' || $field['type'] === 'file_upload') {
                $dataAll['data'][$key] = explode('"', $dataAll['data'][$key])[1];
                // $dataAll['data'][$key] = self::parsedImage($dataAll['data'][$key]);
            }
        }

        $submittedData = $dataAll['data'];


        foreach ($submittedData as $key => $value) {
            $str = "$key";
            $pattern = "/name/i";
            $isName = preg_match($pattern, $str);
            if ($isName) {
                unset($submittedData[$key]);
                $nameValues = explode('|', $value);
                if (count($nameValues) ==2) {
                    $nameOrganized = [
                        'first_name' => $nameValues[0],
                        'last_name' => $nameValues[1]

                    ];
                } else {
                    $nameOrganized = [
                        'first_name' => $nameValues[0],
                        'middle_name' => $nameValues[1],
                        'last_name' => $nameValues[2]
                    ];
                }
            }
        }

        $finalData = array_merge($submittedData, $nameOrganized);
        $flows = Flow::exists('WeForms', $form_id);

        if (!empty($form_id) && $flows = Flow::exists('WeForms', $form_id)) {
            Flow::execute('WeForms', $form_id, $finalData, $flows);
        }
    }
}
