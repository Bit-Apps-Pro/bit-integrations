<?php

namespace BitCode\FI\Triggers\ActionHook;

use ReflectionClass;
use BitCode\FI\Flow\Flow;
use BitCode\FI\Core\Util\Helper;

class ActionHookController
{
    public static function handle(...$args)
    {
        if ($flows = Flow::exists('ActionHook', current_action())) {
            foreach ($flows as $flow) {
                $flowDetails = json_decode($flow->flow_details);

                if (!isset($flowDetails->primaryKey)) {
                    continue;
                }

                $args = static::convertToSimpleArray($args);
                $primaryKeyValue = Helper::extractValueFromPath($args, $flowDetails->primaryKey->key, 'ActionHook');

                if ($flowDetails->primaryKey->value === $primaryKeyValue) {
                    $fieldKeys = [];
                    $formatedData = [];

                    if ($flowDetails->body->data && \is_array($flowDetails->body->data)) {
                        $fieldKeys = array_map(function ($field) use ($args) {
                            return $field->key;
                        }, $flowDetails->body->data);
                    } elseif (isset($flowDetails->field_map) && \is_array($flowDetails->field_map)) {
                        $fieldKeys = array_map(function ($field) use ($args) {
                            return $field->formField;
                        }, $flowDetails->field_map);
                    }

                    foreach ($fieldKeys as $key) {
                        $formatedData[$key] = Helper::extractValueFromPath($args, $key, 'ActionHook');
                    }

                    Flow::execute('ActionHook', current_action(), $formatedData, [$flow]);
                }
            }
        }

        return rest_ensure_response(['status' => 'success']);
    }

    private static function convertToSimpleArray($value)
    {
        if (\is_object($value)) {
            $value = static::convertObjectToArray($value);
        }

        if (\is_array($value)) {
            foreach ($value as $key => $subValue) {
                $value[$key] = static::convertToSimpleArray($subValue);
            }
        }

        return $value;
    }

    private static function convertObjectToArray($object)
    {
        $reflection = new ReflectionClass($object);
        $properties = $reflection->getProperties();

        $array = [];
        foreach ($properties as $property) {
            $property->setAccessible(true);
            $name = $property->getName();
            $value = $property->getValue($object);

            $name = preg_replace('/^\x00(?:\*\x00|\w+\x00)/', '', $name);

            $array[$name] = static::convertToSimpleArray($value);
        }

        return $array;
    }
}
