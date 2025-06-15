<?php

namespace BitCode\FI\Core\Util;

final class Common
{
    public static function replaceFieldWithValue($dataToReplaceField, $fieldValues)
    {
        if (empty($dataToReplaceField)) {
            return $dataToReplaceField;
        }

        if (is_string($dataToReplaceField)) {
            $dataToReplaceField = static::replaceFieldWithValueHelper($dataToReplaceField, $fieldValues);
        } elseif (is_array($dataToReplaceField)) {
            foreach ($dataToReplaceField as $field => $value) {
                if (is_array($value) && count($value) === 1) {
                    $dataToReplaceField[$field] = static::replaceFieldWithValueHelper($value[0], $fieldValues);
                } elseif (is_array($value)) {
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

     * @return boolean
     */
    public static function isEmpty($val)
    {
        if (empty($val) && !in_array($val, ['0', 0, 0.0], true)) {
            return true;
        }

        return false;
    }

    private static function replaceFieldWithValueHelper($stringToReplaceField, $fieldValues)
    {

        if (empty($stringToReplaceField)) {
            return $stringToReplaceField;
        }
        $fieldPattern = '/\${\w[^ ${}]*}/';
        preg_match_all($fieldPattern, $stringToReplaceField, $matchedField);
        $uniqueFieldsInStr = array_unique($matchedField[0]);
        foreach ($uniqueFieldsInStr as $key => $value) {
            $fieldName = substr($value, 2, strlen($value) - 3);
            $smartTagValue = SmartTags::getSmartTagValue($fieldName, true);
            if (isset($fieldValues[$fieldName]) && !self::isEmpty($fieldValues[$fieldName])) {
                $stringToReplaceField = !is_array($fieldValues[$fieldName]) ? str_replace($value, $fieldValues[$fieldName], $stringToReplaceField) :
                    str_replace($value, wp_json_encode($fieldValues[$fieldName]), $stringToReplaceField);
            } elseif (!empty($smartTagValue)) {
                $stringToReplaceField = str_replace($value, $smartTagValue, $stringToReplaceField);
            } else {
                $stringToReplaceField = str_replace($value, '', $stringToReplaceField);
            }
            // error_log(print_r($stringToReplaceField, true));
        }
        // die;
        return $stringToReplaceField;
    }

    /**
     * Replaces file url with dir path
     *
     * @param Array | String $file Single or multiple files URL
     *
     * @return String | Array
     */
    public static function filePath($file)
    {
        $upDir = wp_upload_dir();
        $fileBaseURL = $upDir['baseurl'];
        $fileBasePath = $upDir['basedir'];
        if (is_array($file)) {
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
     * Helps to verify condition
     *
     * @param Array $condition Conditional logic
     * @param Array $data      Trigger data
     *
     * @return boolean
     */
    public static function checkCondition($condition, $data)
    {
        if (is_array($condition)) {
            foreach ($condition as $sskey => $ssvalue) {
                if (!is_string($ssvalue)) {
                    $isCondition = self::checkCondition($ssvalue, $data);
                    if ($sskey === 0) {
                        $conditionSatus = $isCondition;
                    }
                    if ($sskey - 1 >= 0 && is_string($condition[$sskey - 1])) {
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
        } else {
            $condition->val = self::replaceFieldWithValue($condition->val, $data);

            if (is_array($data[$condition->field]) || is_object($data[$condition->field])) {
                $fieldValue = $data[$condition->field];
                $valueToCheck = \explode(',', $condition->val);
                $isArr = true;
            } else {
                $fieldValue = $data[$condition->field];
                $valueToCheck = $condition->val;
                $isArr = false;
            }
            switch ($condition->logic) {
                case 'equal':
                    if ($isArr) {
                        if (count($valueToCheck) !== count($fieldValue)) {
                            return false;
                        }
                        $checker = 0;
                        foreach ($valueToCheck as $key => $value) {
                            if (!empty($fieldValue) && \in_array($value, $fieldValue)) {
                                $checker = $checker + 1;
                            }
                        }
                        if ($checker === count($valueToCheck) && count($valueToCheck) === count($fieldValue)) {
                            return true;
                        }
                        return false;
                    }
                    return $fieldValue === $valueToCheck;

                case 'not_equal':
                    if ($isArr) {
                        $valueToCheckLenght = count($valueToCheck);
                        if ($valueToCheckLenght !== count($fieldValue)) {
                            return true;
                        }
                        $checker = 0;
                        foreach ($valueToCheck as $key => $value) {
                            if (!in_array($value, $fieldValue)) {
                                $checker += 1;
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
                        if ($checker > 0) {
                            return true;
                        }
                        return false;
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
                        if ($checker >= count($valueToCheck)) {
                            return true;
                        }
                        return false;
                    }
                    return stripos($fieldValue, $valueToCheck) !== false;

                case 'not_contain':
                    if (empty($fieldValue)) {
                        return false;
                    }
                    if ($isArr) {
                        $checker = 0;
                        foreach ($valueToCheck as $key => $value) {
                            if (!in_array($value, $fieldValue)) {
                                $checker = $checker + 1;
                            }
                        }
                        if ($checker === count($valueToCheck)) {
                            return true;
                        }
                        return false;
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
                    $fieldValueLength = strlen($fieldValue);
                    $compareValue = strtolower($valueToCheck);
                    $compareValueLength = strlen($valueToCheck);
                    $fieldValueEnds = strtolower(substr($fieldValue, $fieldValueLength - $compareValueLength, $fieldValueLength));
                    return $compareValue === $fieldValueEnds;

                default:
                    return false;
            }
        }
    }
}
