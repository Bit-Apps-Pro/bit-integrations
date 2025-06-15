<?php

namespace BitCode\FI\Triggers\Forminator;

use DateTime;
use BitCode\FI\Flow\Flow;

final class ForminatorController
{
    public static function info()
    {
        $plugin_path = 'forminator/forminator.php';
        return [
            'name' => 'Forminator',
            'title' => 'Forminator - Contact Form, Payment Form & Custom Form Builder',
            'slug' => $plugin_path,
            'pro' => 'forminator/forminator.php',
            'type' => 'form',
            'is_active' => class_exists('Forminator'),
            'activation_url' => wp_nonce_url(self_admin_url('plugins.php?action=activate&amp;plugin=' . $plugin_path . '&amp;plugin_status=all&amp;paged=1&amp;s'), 'activate-plugin_' . $plugin_path),
            'install_url' => wp_nonce_url(self_admin_url('update.php?action=install-plugin&plugin=' . $plugin_path), 'install-plugin_' . $plugin_path),
            'list' => [
                'action' => 'forminator/get',
                'method' => 'get',
            ],
            'fields' => [
                'action' => 'forminator/get/form',
                'method' => 'post',
                'data' => ['id']
            ],
        ];
    }

    public function getAll()
    {
        if (!class_exists('Forminator')) {
            wp_send_json_error(__('Forminator is not installed or activated', 'bit-integrations'));
        }

        $forms = \Forminator_API::get_forms(null, 1, 100);
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

    public function get_a_form($data)
    {
        if (!class_exists('Forminator')) {
            wp_send_json_error(__('Forminator is not installed or activated', 'bit-integrations'));
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
        $form = \Forminator_API::get_form($form_id, ['content_only' => true]);
        $fieldDetails = $form->fields;
        if (empty($fieldDetails)) {
            return $fieldDetails;
        }

        $fields = [];
        foreach ($fieldDetails as $field) {
            if (!empty($field->slug) && $field->type !== 'submit') {
                if (property_exists($field, 'raw') && array_key_exists('multiple_name', $field->raw) && $field->raw['multiple_name'] && $field->raw['type'] == 'name') {
                    $tmpName = $field->raw;
                    $names = [];
                    foreach ($tmpName as $key => $val) {
                        if ($key == 'element_id' && $val) {
                            $last_dash_position = strrpos($val, "-");
                            $index = substr($val, $last_dash_position + 1);
                        }
                        if (($key == 'fname' || $key == 'lname' || $key == 'mname' || $key == 'prefix') && $val) {
                            if ($key == 'fname') {
                                $names['first-name-' . $index] = 'First Name-' . $index;
                            } elseif ($key == 'lname') {
                                $names['last-name-' . $index] = 'Last Name-' . $index;
                            } elseif ($key == 'mname') {
                                $names['middle-name-' . $index] = 'Middle Name-' . $index;
                            } elseif ($key == 'prefix') {
                                $names['prefix'] = 'Name Prefix';
                            }
                        }
                    }

                    foreach ($names as $key => $value) {
                        $fields[] = [
                            'name' => $key,
                            'type' => 'text',
                            'label' => $value,
                        ];
                    }
                } elseif (property_exists($field, 'raw') && $field->raw['type'] == 'address' && is_array(($field->raw))) {
                    $all_fields = $field->raw;
                    $address = [
                        'street_address' => 'Street Address',
                        'city' => 'Address City',
                        'state' => 'Address State',
                        'zip' => 'Address Zip',
                        'country' => 'Address Country',
                        'address_line' => 'Address Line',
                    ];
                    $keys = ['street_address', 'address_city', 'address_state', 'address_zip', 'address_country', 'address_line'];
                    foreach ($all_fields as $key => $value) {
                        if (in_array($key, $keys)) {
                            if (array_key_exists($key, $all_fields) && $all_fields[$key]) {
                                if ($key != 'street_address' && $key != 'address_line') {
                                    $key = substr($key, 8);
                                }
                                // if ($key == 'element_id' && $value) {
                                //     $last_dash_position = strrpos($value, "-");
                                //     $index = substr($value, $last_dash_position + 1);
                                // }
                                if ($field->slug) {
                                    $last_dash_position = strrpos($field->slug, "-");
                                    $index = substr($field->slug, $last_dash_position + 1);
                                }
                                $fields[] = [
                                    'name' => $key . '-' . $index,
                                    'type' => 'text',
                                    'label' => $address[$key] . '-' . $index,
                                ];
                            }
                        }
                    }
                } else {
                    $type = $field->type;
                    if ($type === 'upload') {
                        $type = 'file';
                    }
                    if ($field->slug) {
                        $last_dash_position = strrpos($field->slug, "-");
                        $index = substr($field->slug, $last_dash_position + 1);
                    }
                    $fields[] = [
                        'name' => $field->slug,
                        'type' => $type,
                        'label' => $field->field_label . '-' . $index,
                    ];
                }
            }
        }
        return $fields;
    }

    //forminator didn't return any kind of type of value..
    public static function handle_forminator_submit($entry, $form_id, $form_data)
    {
        $post_id = url_to_postid($_SERVER['HTTP_REFERER']);

        if (!empty($form_id)) {
            $data = [];
            if ($post_id) {
                $data['post_id'] = $post_id;
            }
            foreach ($form_data as $fldDetail) {
                if (is_array($fldDetail['value'])) {
                    if (array_key_exists('file', $fldDetail['value'])) {
                        $data[$fldDetail['name']] = [$fldDetail['value']['file']['file_path']];
                    } elseif (explode("-", $fldDetail['name'])[0] == 'name') {
                        if ($fldDetail['name']) {
                            $last_dash_position = strrpos($fldDetail['name'], "-");
                            $index = substr($fldDetail['name'], $last_dash_position + 1);
                        }
                        foreach ($fldDetail['value'] as $nameKey => $nameVal) {
                            $data[$nameKey . '-' . $index] = $nameVal;
                        }
                    } elseif (explode("-", $fldDetail['name'])[0] == 'address') {
                        if ($fldDetail['name']) {
                            $last_dash_position = strrpos($fldDetail['name'], "-");
                            $index = substr($fldDetail['name'], $last_dash_position + 1);
                        }
                        foreach ($fldDetail['value'] as $nameKey => $nameVal) {
                            $data[$nameKey . '-' . $index] = $nameVal;
                        }
                    } else {
                        $val = $fldDetail['value'];
                        if (array_key_exists('ampm', $val)) {
                            $time = $val['hours'] . ':' . $val['minutes'] . ' ' . $val['ampm'];
                            $data[$fldDetail['name']] = $time;
                        } elseif (array_key_exists('year', $val)) {
                            $date = $val['year'] . '-' . $val['month'] . '-' . $val['day'];
                            $data[$fldDetail['name']] = $date;
                        } elseif (array_key_exists('formatting_result', $val)) {
                            $data[$fldDetail['name']] = $fldDetail['value']['formatting_result'];
                        } else {
                            $data[$fldDetail['name']] = $fldDetail['value'];
                        }
                    }
                } else {
                    if (self::isValidDate($fldDetail['value'])) {
                        $dateTmp = new DateTime($fldDetail['value']);
                        $dateFinal = date_format($dateTmp, 'Y-m-d');
                        $data[$fldDetail['name']] = $dateFinal;
                    } else {
                        $data[$fldDetail['name']] = $fldDetail['value'];
                    }
                }
            }

            if (!empty($form_id) && $flows = Flow::exists('Forminator', $form_id)) {
                Flow::execute('Forminator', $form_id, $data, $flows);
            }
        }
    }

    public static function isValidDate($date, $format = 'd/m/Y')
    {
        $dateTime = DateTime::createFromFormat($format, $date);
        return $dateTime && $dateTime->format($format) === $date;
    }
}
