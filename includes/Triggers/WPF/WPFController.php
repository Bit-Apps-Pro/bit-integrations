<?php

namespace BitCode\FI\Triggers\WPF;

use BitCode\FI\Flow\Flow;
use BitCode\FI\Core\Util\DateTimeHelper;

final class WPFController
{
    public function __construct()
    {
        //
    }

    public static function info()
    {
        $plugin_path = 'wpforms-lite/wpforms.php';

        return [
            'name'           => 'WPForms',
            'title'          => __('Contact Form by WPForms - Drag & Drop Form Builder for WordPress', 'bit-integrations'),
            'slug'           => $plugin_path,
            'pro'            => 'wpforms/wpforms.php',
            'type'           => 'form',
            'is_active'      => \function_exists('WPForms'),
            'activation_url' => wp_nonce_url(self_admin_url('plugins.php?action=activate&amp;plugin=' . $plugin_path . '&amp;plugin_status=all&amp;paged=1&amp;s'), 'activate-plugin_' . $plugin_path),
            'install_url'    => wp_nonce_url(self_admin_url('update.php?action=install-plugin&plugin=' . $plugin_path), 'install-plugin_' . $plugin_path),
            'list'           => [
                'action' => 'wpf/get',
                'method' => 'get',
            ],
            'fields' => [
                'action' => 'wpf/get/form',
                'method' => 'post',
                'data'   => ['id']
            ],
            'isPro' => false
        ];
    }

    public static function isExists()
    {
        return ! (!\function_exists('WPForms'))

        ;
    }

    public function getAll()
    {
        if (!\function_exists('WPForms')) {
            wp_send_json_error(wp_sprintf(__('%s is not installed or activated.', 'bit-integrations'), 'WPForms'));
        }
        $forms = WPForms()->form->get();
        $all_forms = [];
        if ($forms) {
            foreach ($forms as $form) {
                $all_forms[] = (object) [
                    'id'    => $form->ID,
                    'title' => $form->post_title,
                ];
            }
        }
        wp_send_json_success($all_forms);
    }

    public function get_a_form($data)
    {
        if (!\function_exists('WPForms')) {
            wp_send_json_error(wp_sprintf(__('%s is not installed or activated.', 'bit-integrations'), 'WPForms'));
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
        if (!self::isExists()) {
            return [];
        }
        $form = wpforms()->form->get($form_id, ['content_only' => true]);
        $fieldDetails = $form['fields'];
        if (empty($fieldDetails)) {
            return $fieldDetails;
        }

        $fields = [];
        $fieldToExclude = ['divider', 'html', 'address', 'page-break', 'pagebreak', 'payment-single', 'payment-multiple', 'payment-checkbox', 'payment-dropdown', 'payment-credit-card', 'payment-total'];
        foreach ($fieldDetails as $id => $field) {
            if (\in_array($field['type'], $fieldToExclude)) {
                continue;
            }
            if ($field['type'] == 'name' && $field['format'] != 'simple') {
                if ($field['format'] == 'first-last') {
                    $names = ['first' => 'First', 'last' => 'Last'];
                } else {
                    $names = ['first' => 'First', 'last' => 'Last', 'middle' => 'Middle'];
                }

                foreach ($names as $key => $value) {
                    $fields[] = [
                        'name'  => "{$id}:{$key}",
                        'type'  => 'text',
                        'label' => "{$value} " . $field['label'],
                    ];
                }
            } elseif ($field['type'] == 'address' && $field['format'] != 'simple') {
                $address = ['address1' => 'Address1', 'address2' => 'Address2', 'city' => 'City', 'state' => 'State', 'postal' => 'Zip Code'];
                foreach ($address as $key => $value) {
                    $fields[] = [
                        'name'  => "{$id}=>{$key}",
                        'type'  => 'text',
                        'label' => "{$value}",
                    ];
                }
            } else {
                $fields[] = [
                    'name'      => $id,
                    'type'      => $field['type'] === 'file-upload' ? 'file' : $field['type'],
                    'separator' => isset($field['multiple']) && $field['multiple'] == 1 || \in_array($field['type'], ['checkbox', 'file-upload']) ? "\n" : '',
                    'label'     => $field['label'],
                ];
            }
        }

        return $fields;
    }

    public static function wpforms_process_complete($fields, $entry, $form_data, $entry_id)
    {
        $form_id = $form_data['id'];
        if (!empty($form_id)) {
            $data = [];
            if (isset($entry['post_id'])) {
                $data['post_id'] = $entry['post_id'];
            }
            $dateTimeHelper = new DateTimeHelper();
            foreach ($fields as $fldDetail) {
                if ($fldDetail['type'] == 'name') {
                    $data[$fldDetail['id']] = $fldDetail['value'];
                    $data[$fldDetail['id'] . ':first'] = $fldDetail['first'];
                    $data[$fldDetail['id'] . ':last'] = $fldDetail['last'];
                    $data[$fldDetail['id'] . ':middle'] = $fldDetail['middle'];
                } elseif ($fldDetail['type'] == 'date-time') {
                    $data[$fldDetail['id']] = $fldDetail['value'];
                    // if (!is_null($fldDetail['time'])) {
                    //     $date_format = $form_data['fields'][$fldDetail['id']]['date_format'] . " " . $form_data['fields'][$fldDetail['id']]['time_format'];
                    // } else {
                    //     $date_format = $form_data['fields'][$fldDetail['id']]['date_format'];
                    // }
                    // $data[$fldDetail['id']] = $dateTimeHelper->getFormated($fldDetail['value'], $date_format, wp_timezone(), 'Y-m-d\TH:i', null);
                } elseif ($fldDetail['type'] == 'file-upload') {
                    $data[$fldDetail['id']] = self::setFiles($fldDetail['value_raw']);
                } else {
                    $data[$fldDetail['id']] = $fldDetail['value'];
                }
            }
            if ($flows = Flow::exists('WPF', $form_id)) {
                Flow::execute('WPF', $form_id, $data, $flows);
            }
        }
    }

    private static function setFiles($files)
    {
        if (empty($files) || !\is_array($files)) {
            return [];
        }

        $allFiles = [];
        foreach ($files as $file) {
            $allFiles[] = $file['value'];
        }

        return $allFiles;
    }
}
