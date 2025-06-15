<?php

namespace BitCode\FI\Triggers\WPEF;

use wpdb;
use BitCode\FI\Flow\Flow;
use BitCode\FI\Core\Util\Common;
use BitCode\FI\Core\Util\DateTimeHelper;

final class WPEFController
{
    public function __construct()
    {
        //
    }

    public static function info()
    {
        $plugin_path = 'wp-fsqm-pro/ipt_fsqm.php';
        return [
            'name' => 'eForm',
            'title' => 'eForm - WordPress Form Builder',
            'slug' => $plugin_path,
            'type' => 'form',
            'is_active' => self::isActive(),
            'activation_url' => wp_nonce_url(self_admin_url('plugins.php?action=activate&amp;plugin=' . $plugin_path . '&amp;plugin_status=all&amp;paged=1&amp;s'), 'activate-plugin_' . $plugin_path),
            'install_url' => wp_nonce_url(self_admin_url('update.php?action=install-plugin&plugin=' . $plugin_path), 'install-plugin_' . $plugin_path),
            'list' => [
                'action' => 'wpef/get',
                'method' => 'get',
            ],
            'fields' => [
                'action' => 'wpef/get/form',
                'method' => 'post',
                'data' => ['id']
            ],
        ];
    }

    public static function isActive()
    {
        global $ipt_fsqm_info;
        return class_exists('IPT_FSQM_Loader') && is_array($ipt_fsqm_info);
    }

    public function getAll()
    {
        if (!self::isActive()) {
            wp_send_json_error(__('eForm  is not installed or activated', 'bit-integrations'));
        }
        $all_forms = [];
        if (self::isActive()) {
            $forms = $this->forms();
            if ($forms) {
                foreach ($forms as $form) {
                    $all_forms[] = (object)[
                        'id' => $form->id,
                        'title' => $form->name
                    ];
                }
            }
        }
        return $all_forms;
    }

    public function getAForm($data)
    {
        if (empty($data->id) || !(self::isActive())) {
            wp_send_json_error(__('eForm  is not installed or activated', 'bit-integrations'));
        }
        $fields = self::fields($data->id);

        if (empty($fields)) {
            wp_send_json_error(__('Form doesn\'t exists any field', 'bit-integrations'));
        }

        $responseData['fields'] = $fields;
        wp_send_json_success($responseData);
    }


    public static function forms($form_id = null)
    {
        global $wpdb, $ipt_fsqm_info;
        if (is_null($form_id)) {
            return $wpdb->get_results($wpdb->prepare("SELECT * FROM {$ipt_fsqm_info['form_table']} ORDER BY id DESC"));
        } else {
            return $wpdb->get_results($wpdb->prepare("SELECT * FROM {$ipt_fsqm_info['form_table']} WHERE id = %d ORDER BY id DESC", $form_id));
        }
    }
    public static function fields($form_id)
    {
        $formData = self::forms($form_id);

        if (empty($formData) || is_wp_error($formData)) {
            return [];
        }
        $formData = $formData[0];

        return array_merge(
            self::processFields($formData->pinfo),
            self::processFields($formData->freetype),
            self::processFields($formData->mcq)
        );
    }

    public static function processFields($fields)
    {
        $processed = [];
        $fields = maybe_unserialize($fields);
        $fieldToExclude = ['payment', 'mathematical', 'thumbselect'];
        foreach ($fields as $index => $field) {
            if (in_array($field['type'], $fieldToExclude)) {
                continue;
            }
            if ($field['type']  == 'address') {
                $processed = array_merge($processed, self::processAddressField($field, $index));
            } else {
                $processed[] = [
                    'name' => $field['m_type'] . '.' . $index,
                    'type' => self::fieldType($field['type']),
                    'label' => empty($field['title']) ? $field['m_type'] . '.' . $index : $field['title'],
                ];
            }
        }
        return $processed;
    }

    public static function processAddressField($field, $index)
    {
        $processed = [];
        $exclude = ['hidden_label', 'preset_country', 'vertical', 'centered'];
        foreach ($field['settings'] as $key => $label) {
            if (in_array($key, $exclude)) {
                continue;
            }
            $processed[] = [
                'name' => $field['m_type'] . '.' . $index . '.' . $key,
                'type' => 'text',
                'label' => $label,
            ];
        }
        return $processed;
    }
    private static function fieldType($type)
    {
        switch ($type) {
            case 'p_name':
            case 'f_name':
            case 'l_name':
            case 'keypad':
            case 'gps':
            case 'feedback_small':
                return 'text';
            case 'p_phone':
            case 'phone':
                return 'tel';
            case 'email':
            case 'p_email':
                return 'email';
            case 'select':
            case 'repeatable':
                return 'select';
            case 'guestblog':
            case 'feedback_large':
                return 'textarea';
            case 'radio':
            case 'likedislike':
                return 'radio';
            case 'checkbox':
            case 's_checkbox':
                return 'checkbox';
            case 'signature':
            case 'upload':
                return 'file';

            default:
                return 'text';
        }
    }

    public static function processValues($data, $type)
    {
        $formID = $data->form_id;
        $dataID = $data->data_id;
        $fields = $data->data->{$type};
        $processedValues = [];

        foreach ($fields as $index => $field) {
            if ($field['type'] == 'datetime') {
                $processedValues["{$field['m_type']}.$index"] =  self::processDateFieldValue($index, $field, $data);
            } else if ($field['type'] == 'feedback_matrix') {
                $processedValues["{$field['m_type']}.$index"] =   $field['rows'];
            } else if ($field['type'] == 'gps') {
                $processedValues["{$field['m_type']}.$index"] =   $field['lat'] . ", " .  $field['long'];
            } else if ($field['type'] == 'upload') {
                $processedValues["{$field['m_type']}.$index"] = self::processUploadFieldValue($index, $field, $data);
            } else if ($field['type'] == 'address') {
                $processedValues = array_merge($processedValues, self::processAddressFieldValue($index, $field, $data));
            } else {
                // $elementValueHelper = new \IPT_EForm_Form_Elements_Values($data->data_id, $data->form_id);
                // $elementValueHelper->reassign($data->data_id, $data);
                // $processedValues["{$field['m_type']}.$index"] =   $elementValueHelper->get_value($field['m_type'], $index);
                $processedValues["{$field['m_type']}.$index"] =   '';
                if (isset($field['value'])) {
                    $processedValues["{$field['m_type']}.$index"] =   $field['value'];
                } else if (isset($field['values'])) {
                    $processedValues["{$field['m_type']}.$index"] =   $field['values'];
                } else if (isset($field['options'])) {
                    $processedValues["{$field['m_type']}.$index"] =   $field['options'];
                } else if (isset($field['rows'])) {
                    $processedValues["{$field['m_type']}.$index"] =   $field['rows'];
                } else if (isset($field['order'])) {
                    $processedValues["{$field['m_type']}.$index"] =   $field['order'];
                }
            }
        }

        return $processedValues;
    }

    public static function processAddressFieldValue($index, $field, $data)
    {
        $processedValue = [];
        foreach ($field['values'] as $key => $value) {
            $processedValue["{$field['m_type']}.$index.$key"] = $value;
        }
        return $processedValue;
    }

    public static function processUploadFieldValue($index, $field, $data)
    {
        $processedValue = [];
        $elementValueHelper = new \IPT_EForm_Form_Elements_Values($data->data_id, $data->form_id);
        $elementValueHelper->reassign($data->data_id, $data);
        foreach ($field['id'] as $value) {
            $fileInfo = $elementValueHelper->value_upload($data->{$field['m_type']}[$index], $field, 'json', 'label', $value);
            foreach ($fileInfo as $f) {
                if (isset($f['guid'])) {
                    $processedValue[] = Common::filePath($f['guid']);
                }
            }
        }
        return $processedValue;
    }

    public static function processDateFieldValue($index, $field, $data)
    {
        $processedValue = '';
        $fieldInfo =  $data->{$field['m_type']}[$index];
        $dateTimeHelper = new DateTimeHelper();
        $f_date_format = $fieldInfo['settings']['date_format'];
        $f_time_format = $fieldInfo['settings']['time_format'];
        if ($f_date_format == 'mm/dd/yy') {
            $date_format = 'm/d/Y';
        } else if ($f_date_format == 'yy-mm-dd') {
            $date_format = 'Y-m-d';
        } else if ($f_date_format == 'dd.mm.yy') {
            $date_format = 'd.m.Y';
        } else {
            $date_format = 'd-m-Y';
        }

        if ($f_time_format == 'HH:mm:ss') {
            $time_format = 'H:i:s';
        } else {
            $time_format = 'h:i:s A';
        }

        $date_time_format = "$date_format $time_format";
        $processedValue = $dateTimeHelper->getFormated($field['value'], $date_time_format, wp_timezone(), 'Y-m-d\TH:i', null);
        return $processedValue;
    }
    public static function handleSubmission($data)
    {
        if (!($data instanceof \IPT_FSQM_Form_Elements_Data)) {
            return;
        }
        $form_id = $data->form_id;
        $entry = array_merge(
            self::processValues($data, 'pinfo'),
            self::processValues($data, 'freetype'),
            self::processValues($data, 'mcq')
        );


        if (!empty($form_id) && $flows = Flow::exists('WPEF', $form_id)) {
            Flow::execute('WPEF', $form_id, $entry, $flows);
        }
    }
}
