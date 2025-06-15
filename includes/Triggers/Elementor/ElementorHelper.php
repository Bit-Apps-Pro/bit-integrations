<?php

namespace BitCode\FI\Triggers\Elementor;

use BitCode\FI\Core\Util\Helper;

class ElementorHelper
{
    public static function extractRecordData($record)
    {
        return [
            'id'           => $record->get_form_settings('id'),
            'form_post_id' => $record->get_form_settings('form_post_id'),
            'edit_post_id' => $record->get_form_settings('edit_post_id'),
            'fields'       => $record->get('fields'),
            'files'        => $record->get('files'),
        ];
    }

    public static function fetchFlows($formId, $reOrganizeId)
    {
        global $wpdb;

        return $wpdb->get_results(
            $wpdb->prepare(
                "SELECT * FROM {$wpdb->prefix}btcbi_flow
                WHERE status = true 
                AND triggered_entity = %s 
                AND (triggered_entity_id = %s
                OR triggered_entity_id = %s
                OR triggered_entity_id = %s)",
                'Elementor',
                'elementor_pro/forms/new_record',
                $formId,
                $reOrganizeId
            )
        );
    }

    public static function isPrimaryKeysMatch($recordData, $flowDetails)
    {
        foreach ($flowDetails->primaryKey as $primaryKey) {
            if ($primaryKey->value != Helper::extractValueFromPath($recordData, $primaryKey->key, 'Breakdance')) {
                return false;
            }
        }

        return true;
    }

    public static function prepareDataForFlow($record)
    {
        $data = [];
        foreach ($record->get('fields') as $field) {
            if ($field['type'] == 'upload') {
                $data[$field['id']] = explode(',', $field['value']);
            } else {
                $data[$field['id']] = $field['value'];
            }
        }

        return $data;
    }

    public static function setFields($formData)
    {
        $allFields = [
            ['name' => 'id', 'type' => 'text', 'label' => wp_sprintf(__('Form Id (%s)', 'bit-integrations'), $formData['id']), 'value' => $formData['id']],
            ['name' => 'form_post_id', 'type' => 'text', 'label' => wp_sprintf(__('Form Post Id (%s)', 'bit-integrations'), $formData['form_post_id']), 'value' => $formData['form_post_id']],
            ['name' => 'edit_post_id', 'type' => 'text', 'label' => wp_sprintf(__('Edit Post Id (%s)', 'bit-integrations'), $formData['edit_post_id']), 'value' => $formData['edit_post_id']],
        ];

        // Process fields data
        foreach ($formData['fields'] as $key => $field) {
            if ($field['type'] != 'upload') {
                $value = $field['type'] == 'checkbox' && \is_array($field['raw_value']) && \count($field['raw_value']) == 1 ? $field['raw_value'][0] : $field['raw_value'];
                $labelValue = \is_string($value) && \strlen($value) > 20 ? substr($value, 0, 20) . '...' : $value;

                $allFields[] = [
                    'name'  => "fields.{$key}.raw_value",
                    'type'  => $field['type'],
                    'label' => $field['title'] . ' (' . $labelValue . ')',
                    'value' => $value
                ];
            }
        }

        // Process files data
        foreach ($formData['files'] as $key => $file) {
            if (!empty($file)) {
                $fieldTitle = !empty($formData['fields'][$key]['title']) ? $formData['fields'][$key]['title'] : 'Files';

                $allFields[] = [
                    'name'  => "files.{$key}.url",
                    'type'  => 'file',
                    'label' => $fieldTitle,
                    'value' => $file['url']
                ];
            }
        }

        return $allFields;
    }
}
