<?php
namespace BitCode\FI\Triggers\FF;

use BitCode\FI\Core\Util\Common;
use BitCode\FI\Core\Util\DateTimeHelper;
use BitCode\FI\Flow\Flow;
use FluentForm\App\Modules\Form\FormFieldsParser;

final class FFController
{
    public static function info()
    {
        $plugin_path = 'fluentform/fluentform.php';
        return [
            'name' => 'Fluent Forms',
            'title' => 'Contact Form Plugin - Fastest Contact Form Builder Plugin for WordPress by Fluent Forms.',
            'slug' => $plugin_path,
            'type' => 'form',
            'is_active' => function_exists('wpFluent'),
            'activation_url' => wp_nonce_url(self_admin_url('plugins.php?action=activate&amp;plugin=' . $plugin_path . '&amp;plugin_status=all&amp;paged=1&amp;s'), 'activate-plugin_' . $plugin_path),
            'install_url' => wp_nonce_url(self_admin_url('update.php?action=install-plugin&plugin=' . $plugin_path), 'install-plugin_' . $plugin_path),
            'list' => [
                'action' => 'ff/get',
                'method' => 'get',
            ],
            'fields' => [
                'action' => 'ff/get/form',
                'method' => 'post',
                'data' => ['id']
            ],
        ];
    }

    public function getAll()
    {
        if (!function_exists('wpFluent')) {
            wp_send_json_error(__('Fluent Form is not installed or activated', 'bit-integrations'));
        }
        $forms = wpFluent()->table('fluentform_forms')->select('id', 'title')->get();
        $all_forms = [];
        foreach ($forms as $form) {
            $all_forms[] = (object)[
                'id' => $form->id,
                'title' => $form->title
            ];
        }
        wp_send_json_success($all_forms);
    }

    private static function _getFieldLabel($field)
    {
        if (property_exists($field->settings, 'label') && $field->settings->label) {
            return $field->settings->label;
        } elseif (property_exists($field->settings, 'admin_field_label') && $field->settings->admin_field_label) {
            return $field->settings->admin_field_label;
        } elseif (is_object($field->attributes) && property_exists($field->attributes, 'name') && $field->attributes->name) {
            return $field->attributes->name;
        }
        return '';
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
        if (!function_exists('wpFluent')) {
            return [];
        }
        $form = wpFluent()->table('fluentform_forms')->where('id', $form_id)->first();

        $fieldDetails = FormFieldsParser::getFields($form);
        if (empty($fieldDetails)) {
            return [];
        }

        $fields = [];
        foreach ($fieldDetails as  $field) {
            if (isset($field->fields)) {
                $name = isset($field->attributes->name) ? $field->attributes->name . ':' : '';

                foreach ($field->fields as $key => $singleField) {
                    $extraName = $singleField->attributes->name;
                    if ($name === 'repeater_field:') {
                        $extraName = $key;
                    }

                    $fields[] = [
                        'name' => $name . $extraName,
                        'type' => isset($singleField->attributes->type) ? $singleField->attributes->type : $singleField->element,
                        'label' => self::_getFieldLabel($singleField),
                    ];
                }
            } elseif (isset($field->columns)) {
                foreach ($field->columns as $key => $column) {
                    if (!isset($column->fields)) {
                        continue;
                    }
                    foreach ($column->fields as $columnField) {
                        if (isset($columnField->fields)) {
                            $name = isset($columnField->attributes->name) ? $columnField->attributes->name . ':' : '';
                            foreach ($columnField->fields as $key => $singleField) {
                                if ((int)$singleField->settings->visible !== 1) {
                                    continue;
                                }
                                $extraName = $singleField->attributes->name;
                                if ($name === 'repeater_field:') {
                                    $extraName = $key;
                                }

                                $fields[] = [
                                    'name' => $name . $extraName,
                                    'type' => isset($singleField->attributes->type) ? $singleField->attributes->type : $singleField->element,
                                    'label' => self::_getFieldLabel($singleField),
                                ];
                            }
                        } else {
                            $attributes = $columnField->attributes;
                            $fields[] = [
                                'name' => $attributes->name,
                                'type' => isset($attributes->type) ? $attributes->type : $columnField->element,
                                'label' => self::_getFieldLabel($columnField),
                            ];
                        }
                    }
                }
            } else {
                $attributes = $field->attributes;
                $fields[] = [
                    'name' => $attributes->name,
                    'type' => isset($attributes->type) ? $attributes->type : $field->element,
                    'label' => self::_getFieldLabel($field),
                ];
            }
        }
        return $fields;
    }

    public static function handle_ff_submit($entryId, $formData, $form)
    {
        $form_id = $form->id;
        if (!empty($form_id) && $flows = Flow::exists('FF', $form_id)) {
            foreach ($formData as $primaryFld => $primaryFldValue) {
                if ($primaryFld === 'repeater_field') {
                    foreach ($primaryFldValue as $secondaryFld => $secondaryFldValue) {
                        foreach ($secondaryFldValue as $tertiaryFld => $tertiaryFldValue) {
                            $formData["$primaryFld:$secondaryFld-$tertiaryFld"] = $tertiaryFldValue;
                        }
                    }
                }
                if (is_array($primaryFldValue) && array_keys($primaryFldValue) !== range(0, count($primaryFldValue) - 1)) {
                    foreach ($primaryFldValue as $secondaryFld => $secondaryFldValue) {
                        $formData["$primaryFld:$secondaryFld"] = $secondaryFldValue;
                    }
                }
            }

            if (isset($form->form_fields) && isset(json_decode($form->form_fields)->fields)) {
                $formFields = json_decode($form->form_fields)->fields;
                foreach ($formFields as $fieldInfo) {
                    $attributes = $fieldInfo->attributes;
                    $type = isset($attributes->type) ? $attributes->type : $fieldInfo->element;
                    if ($type === 'file') {
                        $formData[$attributes->name] = Common::filePath($formData[$attributes->name]);
                    }
                    if (property_exists($fieldInfo, 'element') && $fieldInfo->element === 'input_date') {
                        $dateTimeHelper = new DateTimeHelper();
                        $currentDateFormat = $fieldInfo->settings->date_format;
                        $formData[$attributes->name] = $dateTimeHelper->getFormated($formData[$attributes->name], $currentDateFormat, wp_timezone(), 'Y-m-d\TH:i:sP', null);
                    }
                }
            }

            Flow::execute('FF', $form_id, $formData, $flows);
        }
    }
}
