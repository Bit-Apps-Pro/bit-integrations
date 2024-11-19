<?php

namespace BitCode\FI\Actions\Voxel;

class VoxelHelper
{
    public static function updateVoxelPost($finalData, $postType, $postId)
    {
        if (!class_exists('Voxel\Post') || !class_exists('Voxel\Post_Type')) {
            return false;
        }

        $post = \Voxel\Post::force_get($postId);

        if (!$post) {
            return false;
        }

        $postType = \Voxel\Post_Type::get($postType);
        $postFields = $postType->get_fields();

        if (!\is_array($postFields) || empty($postFields)) {
            return false;
        }

        foreach ($postFields as $postField) {
            $fieldType = $postField->get_type();

            if (\in_array($fieldType, ['ui-step', 'ui-html', 'ui-heading', 'ui-image', 'repeater'], true)) {
                continue;
            }

            $fieldKey = $postField->get_key();
            $field = $post->get_field($fieldKey);

            switch ($fieldType) {
                case 'event-date':
                case 'recurring-date':
                    $eventDateValue = VoxelHelper::getEventFieldData($fieldKey, $finalData);

                    if (!empty($eventDateValue)) {
                        $field->update([$eventDateValue]);
                    }

                    break;
                case 'location':
                    $locationValue = VoxelHelper::getLocationFieldData($fieldKey, $finalData);

                    if (!empty($locationValue)) {
                        $field->update($locationValue);
                    }

                    break;
                case 'work-hours':
                    $finalWorkHours = VoxelHelper::getWorkHoursFieldData($fieldKey, $finalData);

                    if (!empty($finalWorkHours)) {
                        $field->update([$finalWorkHours]);
                    }

                    break;
                case 'file':
                case 'image':
                case 'profile-avatar':
                case 'gallery':
                case 'cover':
                    $attachmentValues = [];

                    if (!\is_array($finalData[$fieldKey]) && !empty($finalData[$fieldKey])) {
                        $attchmentIds = explode(',', $finalData[$fieldKey]);

                        foreach ($attchmentIds as $attchmentId) {
                            $attachmentValues[] = [
                                'source'  => 'existing',
                                'file_id' => (int) $attchmentId,
                            ];
                        }
                    }

                    if (!empty($attachmentValues)) {
                        $field->update($attachmentValues);
                    }

                    break;
                case 'post-relation':
                    if (!empty($finalData[$fieldKey])) {
                        $value = array_map(
                            function ($postRelationId) {
                                return (int) $postRelationId;
                            },
                            explode(',', $finalData[$fieldKey])
                        );

                        if (!empty($value)) {
                            $field->update($value);
                        }
                    }

                    break;
                case 'taxonomy':
                    if (!empty($finalData[$fieldKey])) {
                        $value = explode(',', $finalData[$fieldKey]);

                        if (!empty($value)) {
                            $field->update($value);
                        }
                    }

                    break;
                case 'product':
                    if (!empty($finalData[$fieldKey])) {
                        $productData = explode(',', $finalData[$fieldKey]);
                        $previousData = $field->get_value();
                        $updatedData = array_merge($previousData ?? [], $productData);
                        $field->update($updatedData);
                    }

                    break;
                default:
                    if (!empty($finalData[$fieldKey])) {
                        $field->update($finalData[$fieldKey]);
                    }

                    break;
            }
        }
    }

    public static function getEventFields($fieldKey, $postField)
    {
        return [
            [
                'key'      => $fieldKey . '_event_start_date',
                'label'    => wp_sprintf(__('Event Start Date (%s)', 'bit-integrations'), $postField->get_label()),
                'required' => false,
            ],
            [
                'key'      => $fieldKey . '_event_end_date',
                'label'    => wp_sprintf(__('Event End Date (%s)', 'bit-integrations'), $postField->get_label()),
                'required' => false,
            ],
            [
                'key'      => $fieldKey . '_event_frequency',
                'label'    => wp_sprintf(__('Event Frequency (%s)', 'bit-integrations'), $postField->get_label()),
                'required' => false,
            ],
            [
                'key'      => $fieldKey . '_repeat_every',
                'label'    => wp_sprintf(__('Event unit (%s)', 'bit-integrations'), $postField->get_label()),
                'required' => false,
            ],
            [
                'key'      => $fieldKey . '_event_until',
                'label'    => wp_sprintf(__('Event Until (%s)', 'bit-integrations'), $postField->get_label()),
                'required' => false,
            ],
        ];
    }

    public static function getLocationFields($fieldKey, $postField)
    {
        return [
            [
                'key'      => $fieldKey . '_address',
                'label'    => __('Address', 'bit-integrations') . ' (' . $postField->get_label() . ')',
                'label'    => wp_sprintf(__('Address (%s)', 'bit-integrations'), $postField->get_label()),
                'required' => false,
            ],
            [
                'key'      => $fieldKey . '_latitude',
                'label'    => wp_sprintf(__('Latitude (%s)', 'bit-integrations'), $postField->get_label()),
                'required' => false,
            ],
            [
                'key'      => $fieldKey . '_longitude',
                'label'    => wp_sprintf(__('Longitude (%s)', 'bit-integrations'), $postField->get_label()),
                'required' => false,
            ],
        ];
    }

    public static function getWorkHoursFields($fieldKey, $postField)
    {
        return [
            [
                'key'      => $fieldKey . '_work_days',
                'label'    => wp_sprintf(__('Work Days (%s)', 'bit-integrations'), $postField->get_label()),
                'required' => false,
            ],
            [
                'key'      => $fieldKey . '_work_hours',
                'label'    => wp_sprintf(__('Work Hours (%s)', 'bit-integrations'), $postField->get_label()),
                'required' => false,
            ],
            [
                'key'      => $fieldKey . '_work_status',
                'label'    => wp_sprintf(__('Work Status (%s)', 'bit-integrations'), $postField->get_label()),
                'required' => false,
            ],
        ];
    }

    public static function getCommonFieldsAndMap($selectedTask, $isUpdateTask)
    {
        $fields = $fieldMap = [];

        switch ($selectedTask) {
            case VoxelTasks::NEW_PROFILE:
                $fields[] = [
                    'key'      => 'user_email',
                    'label'    => __('User Email', 'bit-integrations'),
                    'required' => !$isUpdateTask,
                ];

                $fieldMap[] = (object) ['formField' => '', 'voxelField' => 'user_email'];

                break;

            case VoxelTasks::UPDATE_PROFILE:
                $fields[] = [
                    'key'      => 'profile_id',
                    'label'    => __('Profile ID', 'bit-integrations'),
                    'required' => true,
                ];

                $fieldMap[] = (object) ['formField' => '', 'voxelField' => 'profile_id'];

                break;

            default:
                $fields[] = [
                    'key'      => 'post_author_email',
                    'label'    => __('Post Author Email', 'bit-integrations'),
                    'required' => !$isUpdateTask,
                ];

                $fieldMap[] = (object) ['formField' => '', 'voxelField' => 'post_author_email'];

                break;
        }

        return ['fields' => $fields, 'fieldMap' => $fieldMap];
    }

    private static function getEventFieldData(string $fieldKey, array $finalData)
    {
        $fields = [
            'event_start_date' => 'start',
            'event_end_date'   => 'end',
            'event_frequency'  => 'frequency',
            'repeat_every'     => 'unit',
            'event_until'      => 'until'
        ];

        return VoxelHelper::getFieldData($fields, $fieldKey, $finalData);
    }

    private static function getLocationFieldData(string $fieldKey, array $finalData)
    {
        $fields = [
            'address'   => 'address',
            'latitude'  => 'latitude',
            'longitude' => 'longitude',
        ];

        return VoxelHelper::getFieldData($fields, $fieldKey, $finalData);
    }

    private static function getWorkHoursFieldData(string $fieldKey, array $finalData)
    {
        $finalWorkHours = [];

        if (!empty($finalData[$fieldKey . '_work_days'])) {
            $days = preg_split('/, ?/', $finalData[$fieldKey . '_work_days']);
            $finalWorkHours['days'] = $days;
        }

        if (!empty($finalData[$fieldKey . '_work_hours'])) {
            $multiHours = preg_split('/, ?/', $finalData[$fieldKey . '_work_hours']);
            $formattedHours = [];

            foreach ($multiHours as $hours) {
                $splitHours = preg_split('/ ?- ?/', $hours);
                $formattedHours[] = [
                    'from' => isset($splitHours[0]) ? $splitHours[0] : '',
                    'to'   => isset($splitHours[1]) ? $splitHours[1] : '',
                ];
            }

            $finalWorkHours['hours'] = $formattedHours;
        }

        if (!empty($finalData[$fieldKey . '_work_status'])) {
            $finalWorkHours['status'] = $finalData[$fieldKey . '_work_status'];
        }

        return $finalWorkHours;
    }

    /**
     * @param array  $fileds    receives field key and field data key (key value pair)
     * @param string $fieldKey
     * @param array  $finalData
     *
     * @return array
     */
    private static function getFieldData(array $fields, string $fieldKey, array $finalData)
    {
        $data = [];

        foreach ($fields as $key => $value) {
            if (!empty($finalData[$fieldKey . '_' . $key])) {
                $data[$value] = $finalData[$fieldKey . '_' . $key];
            }
        }

        return $data;
    }
}
