<?php

namespace BitCode\FI\Triggers\Breakdance;

use WP_Error;

class BreakdanceHelper
{
    public static function setFields($data, $form)
    {
        // Create a mapping for quick access
        $formFields = array_column($form, null, 'name');
        $allFields  = [
            ['name' => self::findKeyPath($data, 'formId'), 'type' => 'text', 'label' => "Form Id ({$data['formId']})", 'value' => $data['formId']],
            ['name' => self::findKeyPath($data, 'postId'), 'type' => 'text', 'label' => "Post Id ({$data['postId']})", 'value' => $data['postId']]
        ];

        // Process fields data
        foreach ($data['fields'] as $key => $value) {
            $formKey = "fields[$key]";
            if (isset($formFields[$formKey]) && $formFields[$formKey]['type'] != 'file') {
                $label = strlen($value) > 20 ? substr($value, 0, 20) . '...' : $value;

                $allFields[] = [
                    'name'  => self::findKeyPath($data['fields'], $key, ['fields']),
                    'type'  => $formFields[$formKey]['type'],
                    'label' => $formFields[$formKey]['label'] . ' (' . $label . ')',
                    'value' => $value
                ];
            }
        }

        // Process files data
        foreach ($data['files'] as $key => $files) {
            $formKey = "fields[$key]";
            if (isset($formFields[$formKey])) {
                $urls = array_column($files, 'url');

                $allFields[] = [
                    'name'  => self::findKeyPath($data['files'], $key, ['files']),
                    'type'  => $formFields[$formKey]['type'],
                    'label' => $formFields[$formKey]['label'],
                    'value' => $urls
                ];
            }
        }

        return $allFields;
    }

    public static function findKeyPath(array $data, string $searchKey, array $currentPath = [])
    {
        foreach ($data as $key => $value) {
            $path   = $currentPath;
            $path[] = $key;

            if (is_object($value)) {
                $value = (array) $value;
            }
            if ($key === $searchKey) {
                return implode('.', $path);
            }
            if (is_array($value)) {
                $foundPath = self::findKeyPath($value, $searchKey, $path);
                if ($foundPath) {
                    return $foundPath;
                }
            }
        }

        return null;
    }
}
