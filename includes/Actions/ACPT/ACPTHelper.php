<?php

namespace BitCode\FI\Actions\ACPT;

use BitCode\FI\Core\Util\Common;
use BitCode\FI\Core\Util\Helper;

class ACPTHelper
{
    public static function generateReqDataFromFieldMap($data, $fieldMap)
    {
        $dataFinal = [];
        foreach ($fieldMap as $value) {
            $triggerValue = $value->formField;
            $actionValue = $value->acptFormField;

            if (empty($actionValue)) {
                continue;
            }

            $dataFinal[$actionValue] = ($triggerValue === 'custom' && !empty($value->customValue))
                ? Common::replaceFieldWithValue($value->customValue, $data)
                : $data[$triggerValue];
        }

        return $dataFinal;
    }

    public static function cptValidateRequired($finalData, $isUpdate = false)
    {
        $required = [
            'post_name'      => __('Post Name', 'bit-integrations'),
            'singular_label' => __('Singular Label', 'bit-integrations'),
            'plural_label'   => __('Plural Label', 'bit-integrations'),
        ];

        if ($isUpdate) {
            $required = array_merge(
                [
                    'slug' => __('Slug', 'bit-integrations')
                ],
                $required
            );
        }

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

    public static function taxonomyValidateRequired($finalData, $isUpdate = false)
    {
        $requiredFields = [
            'slug'           => __('Slug', 'bit-integrations'),
            'singular_label' => __('Singular Label', 'bit-integrations'),
            'plural_label'   => __('Plural Label', 'bit-integrations'),
        ];

        return self::validateFields($requiredFields, $finalData);
    }

    public static function optionPageValidateRequired($finalData)
    {
        $requiredFields = [
            'pageTitle'  => __('Page Title', 'bit-integrations'),
            'menuTitle'  => __('Menu Title', 'bit-integrations'),
            'capability' => __('Capability', 'bit-integrations'),
            'menuSlug'   => __('Menu Slug', 'bit-integrations'),
            'position'   => __('Menu Position', 'bit-integrations'),
        ];

        return self::validateFields($requiredFields, $finalData);
    }

    public static function buildLabels($fieldValues, $labelFieldsMap, $defaultKey)
    {
        $labels = self::generateReqDataFromFieldMap($fieldValues, $labelFieldsMap ?? []);

        return empty($labels) ? [$defaultKey => ''] : $labels;
    }

    public static function buildSettings(&$finalData, $utilities)
    {
        $settings = (array) ($utilities ?? []);

        $liftKeys = ['rest_base', 'menu_position', 'capability_type', 'custom_rewrite', 'custom_query_var', 'default_term'];

        foreach ($liftKeys as $key) {
            if (!empty($finalData[$key])) {
                $settings[$key] = $finalData[$key];

                unset($finalData[$key]);
            }
        }

        $optionalFlags = ['publicly_queryable', 'query_var', 'rewrite', 'default_term', 'sort'];
        foreach ($optionalFlags as $key) {
            if (!empty($settings[$key])) {
                $settings[$key] = (string) $settings[$key];
            }
        }

        if (!empty($settings['capabilities'])) {
            $settings['capabilities'] = Helper::convertStringToArray($settings['capabilities']);
        }

        $settings = array_filter($settings);

        return empty($settings) ? ['public' => false] : $settings;
    }

    public static function prepareCPTData($finalData, $fieldValues, $integrationDetails)
    {
        $finalData['labels'] = ACPTHelper::buildLabels($fieldValues, $integrationDetails->label_field_map ?? [], 'menu_name');
        $finalData['settings'] = ACPTHelper::buildSettings($finalData, $integrationDetails->utilities ?? []);
        $finalData['supports'] = Helper::convertStringToArray($integrationDetails->supports ?? []);

        return wp_json_encode($finalData, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    }

    public static function prepareTaxonomyData($finalData, $fieldValues, $integrationDetails)
    {
        $finalData['labels'] = ACPTHelper::buildLabels($fieldValues, $integrationDetails->label_field_map ?? [], 'name');
        $finalData['settings'] = ACPTHelper::buildSettings($finalData, $integrationDetails->utilities ?? []);
        $finalData['singular'] = $finalData['singular_label'];
        $finalData['plural'] = $finalData['plural_label'];

        unset($finalData['singular_label'], $finalData['plural_label']);

        return wp_json_encode($finalData, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    }

    public static function validateResponse($response)
    {
        return !$response
            ? ['error' => wp_sprintf(__('%s plugin is not installed or activate', 'bit-integrations'), 'Bit Integration Pro')]
            : $response;
    }

    private static function validateFields($requiredFields, $finalData)
    {
        foreach ($requiredFields as $key => $label) {
            if (empty($finalData[$key])) {
                return [
                    'success' => false,
                    'message' => \sprintf(__('Required field %s is empty', 'bit-integrations'), $label),
                    'code'    => 422,
                ];
            }
        }
    }
}
