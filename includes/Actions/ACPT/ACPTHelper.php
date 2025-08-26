<?php

namespace BitCode\FI\Actions\ACPT;

use BitCode\FI\Core\Util\Common;

class ACPTHelper
{
    public static function generateReqDataFromFieldMap($data, $fieldMap)
    {
        $dataFinal = [];
        foreach ($fieldMap as $value) {
            $triggerValue = $value->formField;
            $actionValue = $value->acptFormField;

            $dataFinal[$actionValue] = ($triggerValue === 'custom' && !empty($value->customValue))
                ? Common::replaceFieldWithValue($value->customValue, $data)
                : $data[$triggerValue];
        }

        return $dataFinal;
    }

    public static function cptValidateRequired($finalData)
    {
        $required = [
            'post_name'      => __('Post Name', 'bit-integrations'),
            'singular_label' => __('Singular Label', 'bit-integrations'),
            'plural_label'   => __('Plural Label', 'bit-integrations'),
        ];

        foreach ($required as $key => $label) {
            if (empty($finalData[$key])) {
                return [
                    'success' => false,
                    'message' => \sprintf(__('Required field %s is empty', 'bit-integrations'), $label),
                    'code'    => 422,
                ];
            }
        }
    }

    public static function buildLabels($fieldValues, $labelFieldsMap)
    {
        return self::generateReqDataFromFieldMap($fieldValues, $labelFieldsMap ?? []);
    }

    public static function buildSettings(&$finalData, $utilities)
    {
        $settings = (array) ($utilities ?? []);

        $liftKeys = ['rest_base', 'menu_position', 'capability_type', 'custom_rewrite', 'custom_query_var'];

        foreach ($liftKeys as $key) {
            if (!empty($finalData[$key])) {
                $settings[$key] = $finalData[$key];

                unset($finalData[$key]);
            }
        }

        $optionalFlags = ['publicly_queryable', 'query_var', 'rewrite'];
        foreach ($optionalFlags as $key) {
            if (!empty($settings[$key])) {
                $settings[$key] = (string) $settings[$key];
            }
        }

        return array_filter($settings);
    }
}
