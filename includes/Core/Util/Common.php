<?php

namespace BitCode\FI\Core\Util;

final class Common
{
    public static function replaceFieldWithValue($dataToReplaceField, $fieldValues)
    {
        if (empty($dataToReplaceField)) {
            return $dataToReplaceField;
        }

        if (\is_string($dataToReplaceField)) {
            $dataToReplaceField = static::replaceFieldWithValueHelper($dataToReplaceField, $fieldValues);
        } elseif (\is_array($dataToReplaceField)) {
            foreach ($dataToReplaceField as $field => $value) {
                if (\is_array($value) && \count($value) === 1) {
                    $dataToReplaceField[$field] = static::replaceFieldWithValueHelper($value[0], $fieldValues);
                } elseif (\is_array($value)) {
                    $dataToReplaceField[$field] = static::replaceFieldWithValue($value, $fieldValues);
                } else {
                    $dataToReplaceField[$field] = static::replaceFieldWithValueHelper($value, $fieldValues);
                }
            }
        }

        return $dataToReplaceField;
    }

    /**
     * isEmpty function check ('0', 0, 0.0) is exists
     *
     * @param string $val
     *
     * @return bool
     */
    public static function isEmpty($val)
    {
        return (bool) (empty($val) && !\in_array($val, ['0', 0, 0.0], true));
    }

    /**
     * Replaces file url with dir path
     *
     * @param array|string $file Single or multiple files URL
     *
     * @return string|array
     */
    public static function filePath($file)
    {
        $upDir = wp_upload_dir();
        $fileBaseURL = $upDir['baseurl'];
        $fileBasePath = $upDir['basedir'];
        if (\is_array($file)) {
            $path = [];
            foreach ($file as $fileIndex => $fileUrl) {
                $path[$fileIndex] = str_replace($fileBaseURL, $fileBasePath, $fileUrl);
            }
        } else {
            $path = str_replace($fileBaseURL, $fileBasePath, $file);
        }

        return $path;
    }

    /**
     * Replaces dir path with url
     *
     * @param array|string $file Single or multiple files path
     *
     * @return string|array
     */
    public static function fileUrl($file)
    {
        $upDir = wp_upload_dir();
        $fileBaseURL = $upDir['baseurl'];
        $fileBasePath = str_replace('\\', '/', $upDir['basedir']);

        if (\is_array($file)) {
            $Url = [];
            foreach ($file as $fileIndex => $fileUrl) {
                $Url[$fileIndex] = str_replace($fileBaseURL, $fileBasePath, $fileUrl);
            }
        } else {
            $Url = str_replace($fileBasePath, $fileBaseURL, $file);
        }

        return $Url;
    }

    /**
     * Helps to verify condition
     *
     * @param array $condition Conditional logic
     * @param array $data      Trigger data
     *
     * @return bool
     */
    public static function checkCondition($condition, $data)
    {
        if (\is_array($condition)) {
            foreach ($condition as $sskey => $ssvalue) {
                if (!\is_string($ssvalue)) {
                    $isCondition = self::checkCondition($ssvalue, $data);
                    if ($sskey === 0) {
                        $conditionSatus = $isCondition;
                    }
                    if ($sskey - 1 >= 0 && \is_string($condition[$sskey - 1])) {
                        switch (strtolower($condition[$sskey - 1])) {
                            case 'or':
                                $conditionSatus = $conditionSatus || $isCondition;

                                break;

                            case 'and':
                                $conditionSatus = $conditionSatus && $isCondition;

                                break;

                            default:
                                break;
                        }
                    }
                }
            }

            return (bool) $conditionSatus;
        }
        $condition->val = self::replaceFieldWithValue($condition->val, $data);

        if (\is_array($data[$condition->field]) || \is_object($data[$condition->field])) {
            $fieldValue = $data[$condition->field];
            $valueToCheck = explode(',', $condition->val);
            $isArr = true;
        } else {
            $fieldValue = $data[$condition->field];
            $valueToCheck = $condition->val;
            $isArr = false;
        }
        switch ($condition->logic) {
            case 'equal':
                if ($isArr) {
                    if (\count($valueToCheck) !== \count($fieldValue)) {
                        return false;
                    }
                    $checker = 0;
                    foreach ($valueToCheck as $key => $value) {
                        if (!empty($fieldValue) && \in_array($value, $fieldValue)) {
                            $checker = $checker + 1;
                        }
                    }

                    return (bool) ($checker === \count($valueToCheck) && \count($valueToCheck) === \count($fieldValue))

                    ;
                }

                return $fieldValue === $valueToCheck;

            case 'not_equal':
                if ($isArr) {
                    $valueToCheckLenght = \count($valueToCheck);
                    if ($valueToCheckLenght !== \count($fieldValue)) {
                        return true;
                    }
                    $checker = 0;
                    foreach ($valueToCheck as $key => $value) {
                        if (!\in_array($value, $fieldValue)) {
                            ++$checker;
                        }
                    }

                    return $valueToCheckLenght === $checker;
                }

                return $fieldValue !== $valueToCheck;

            case 'null':
                return empty($data[$condition->field]);

            case 'not_null':
                return !empty($data[$condition->field]);

            case 'contain':
                if (empty($fieldValue)) {
                    return false;
                }
                if ($isArr) {
                    $checker = 0;
                    foreach ($valueToCheck as $key => $value) {
                        if (\in_array($value, $fieldValue)) {
                            $checker = $checker + 1;
                        }
                    }

                    return (bool) ($checker > 0)

                    ;
                }

                return stripos($fieldValue, $valueToCheck) !== false;

            case 'contain_all':
                if (empty($fieldValue)) {
                    return false;
                }
                if ($isArr) {
                    $checker = 0;
                    foreach ($valueToCheck as $key => $value) {
                        if (\in_array($value, $fieldValue)) {
                            $checker = $checker + 1;
                        }
                    }

                    return (bool) ($checker >= \count($valueToCheck))

                    ;
                }

                return stripos($fieldValue, $valueToCheck) !== false;

            case 'not_contain':
                if (empty($fieldValue)) {
                    return false;
                }
                if ($isArr) {
                    $checker = 0;
                    foreach ($valueToCheck as $key => $value) {
                        if (!\in_array($value, $fieldValue)) {
                            $checker = $checker + 1;
                        }
                    }

                    return (bool) ($checker === \count($valueToCheck))

                    ;
                }

                return stripos($fieldValue, $valueToCheck) === false;

            case 'greater':
                if (empty($fieldValue)) {
                    return false;
                }

                return $data[$condition->field] > $condition->val;

            case 'less':
                if (empty($fieldValue)) {
                    return false;
                }

                return $fieldValue < $valueToCheck;

            case 'greater_or_equal':
                if (empty($fieldValue)) {
                    return false;
                }

                return $fieldValue >= $valueToCheck;

            case 'less_or_equal':
                if (empty($fieldValue)) {
                    return false;
                }

                return $fieldValue <= $valueToCheck;

            case 'start_with':
                if (empty($fieldValue)) {
                    return false;
                }

                return stripos($fieldValue, $valueToCheck) === 0;

            case 'end_with':
                if (empty($fieldValue)) {
                    return false;
                }
                $fieldValue = $fieldValue;
                $fieldValueLength = \strlen($fieldValue);
                $compareValue = strtolower($valueToCheck);
                $compareValueLength = \strlen($valueToCheck);
                $fieldValueEnds = strtolower(substr($fieldValue, $fieldValueLength - $compareValueLength, $fieldValueLength));

                return $compareValue === $fieldValueEnds;

            default:
                return false;
        }
    }

    public static function loadPluginTextDomain($domain, $path)
    {
        load_plugin_textdomain($domain, false, $path);
    }

    private static function replaceFieldWithValueHelper($stringToReplaceField, $fieldValues)
    {
        if (empty($stringToReplaceField)) {
            return $stringToReplaceField;
        }
        $fieldPattern = '/\${\w[^ ${}]*}/';
        preg_match_all($fieldPattern, $stringToReplaceField, $matchedField);
        $uniqueFieldsInStr = array_unique($matchedField[0]);
        foreach ($uniqueFieldsInStr as $field) {
            $fieldName = substr($field, 2, \strlen($field) - 3);
            $smartTagValue = SmartTags::getSmartTagValue($fieldName, true);
            if (isset($fieldValues[$fieldName]) && !self::isEmpty($fieldValues[$fieldName])) {
                $stringToReplaceField = !\is_array($fieldValues[$fieldName]) ? str_replace($field, $fieldValues[$fieldName], $stringToReplaceField)
                    : str_replace(['"' . $field . '"', $field], wp_json_encode($fieldValues[$fieldName], true), $stringToReplaceField);
            } elseif (!empty($smartTagValue)) {
                $stringToReplaceField = str_replace($field, $smartTagValue, $stringToReplaceField);
            } else {
                $stringToReplaceField = str_replace($field, '', $stringToReplaceField);
            }
        }

        return $stringToReplaceField;
    }
}
