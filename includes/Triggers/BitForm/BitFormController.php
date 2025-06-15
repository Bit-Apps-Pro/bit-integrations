<?php

namespace BitCode\FI\Triggers\BitForm;

use BitCode\FI\Flow\Flow;

final class BitFormController
{
    public static function info()
    {
        $plugin_path = 'bitform/bitforms.php';

        return [
            'name'           => 'Bit Form',
            'title'          => __('Contact Form Plugin - Fastest Contact Form Builder Plugin for WordPress by Bit Forms.', 'bit-integrations'),
            'slug'           => $plugin_path,
            'type'           => 'form',
            'is_active'      => self::isPluginActive(),
            'activation_url' => wp_nonce_url(self_admin_url('plugins.php?action=activate&amp;plugin=' . $plugin_path . '&amp;plugin_status=all&amp;paged=1&amp;s'), 'activate-plugin_' . $plugin_path),
            'install_url'    => wp_nonce_url(self_admin_url('update.php?action=install-plugin&plugin=' . $plugin_path), 'install-plugin_' . $plugin_path),
            'list'           => [
                'action' => 'bitform/get',
                'method' => 'get',
            ],
            'fields' => [
                'action' => 'bitform/get/form',
                'method' => 'post',
                'data'   => ['id']
            ]
        ];
    }

    public function getAll()
    {
        if (!self::isPluginActive()) {
            wp_send_json_error(wp_sprintf(__('%s is not installed or activated.', 'bit-integrations'), 'Bit Form'));
        }

        $forms = \BitCode\BitForm\API\BitForm_Public\BitForm_Public::getForms();
        $all_forms = [];
        foreach ($forms as $form) {
            $all_forms[] = (object) [
                'id'    => $form->id,
                'title' => $form->form_name
            ];
        }
        wp_send_json_success($all_forms);
    }

    public function get_a_form($data)
    {
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
        if (!self::isPluginActive()) {
            return [];
        }

        $fieldDetails = \BitCode\BitForm\API\BitForm_Public\BitForm_Public::getFields($form_id);
        if (empty($fieldDetails)) {
            return [];
        }

        $fields = [];
        foreach ($fieldDetails as $key => $field) {
            if (isset($field->fieldName) && !isset($field->txt) && $field->typ !== 'repeater') {
                if ($field->typ === 'file-up') {
                    $fields[] = [
                        'name'  => $key,
                        'type'  => 'file',
                        'label' => $field->lbl ?? $field->fieldName
                    ];
                } elseif ($field->typ === 'decision-box') {
                    $fields[] = [
                        'name'  => $key,
                        'type'  => $field->typ,
                        'label' => $field->adminLbl ?? $field->fieldName
                    ];
                } else {
                    $fields[] = [
                        'name'  => $key,
                        'type'  => $field->typ,
                        'label' => $field->lbl ?? $field->fieldName
                    ];
                }
            }
        }

        return $fields;
    }

    public static function handle_bitform_submit($formId, $entryId, $formData)
    {
        if (!empty($formId)) {
            $data = [];
            if ($entryId) {
                $data['entry_id'] = $entryId;
            }
            foreach ($formData as $key => $value) {
                if (\is_string($value) && str_contains($value, '__bf__')) {
                    $data[$key] = explode('__bf__', $value);
                } else {
                    $data[$key] = $value;
                }
            }
            if (!empty($formId) && $flows = Flow::exists('BitForm', $formId)) {
                Flow::execute('BitForm', $formId, $data, $flows);
            }
        }
    }

    private static function isPluginActive()
    {
        return class_exists('BitCode\\BitForm\\Plugin');
    }
}
