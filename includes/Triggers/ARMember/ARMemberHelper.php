<?php

namespace BitCode\FI\Triggers\ARMember;

class ARMemberHelper
{
    public static function fields($id)
    {
        if (empty($id)) {
            wp_send_json_error(
                __(
                    'Requested parameter is empty',
                    'bit-integrations'
                ),
                400
            );
        }

        $userFields = [
            'User Id' => (object) [
                'fieldKey' => 'user_id',
                'fieldName' => 'User Id'
            ],
            'First Name' => (object) [
                'fieldKey' => 'first_name',
                'fieldName' => 'First Name'
            ],
            'Last Name' => (object) [
                'fieldKey' => 'last_name',
                'fieldName' => 'Last Name'
            ],
            'Nick Name' => (object) [
                'fieldKey' => 'nickname',
                'fieldName' => 'Nick Name'
            ],
            'Avatar URL' => (object) [
                'fieldKey' => 'avatar_url',
                'fieldName' => 'Avatar URL'
            ],
            'Email' => (object) [
                'fieldKey' => 'user_email',
                'fieldName' => 'Email',
            ],
        ];

        if ($id == '101' || $id == '101_2' || $id == '101_3') {
            $fields = $userFields;
        } elseif ($id == '4' || $id == '5' || $id == '6') {
            $fields = [
                'User Id' => (object) [
                    'fieldKey' => 'user_id',
                    'fieldName' => 'User Id'
                ],
                'User Nick Name' => (object) [
                    'fieldKey' => 'arm_user_nicename',
                    'fieldName' => 'User Nick Name'
                ],
                'User Email' => (object) [
                    'fieldKey' => 'arm_user_email',
                    'fieldName' => 'User Email'
                ],
                'Display Name' => (object) [
                    'fieldKey' => 'arm_display_name',
                    'fieldName' => 'Display Name'
                ],
                'Subscription Plan' => (object) [
                    'fieldKey' => 'arm_subscription_plan',
                    'fieldName' => 'Subscription Plan'
                ],
                'Subscription Plan ID' => (object) [
                    'fieldKey' => 'arm_subscription_plan_id',
                    'fieldName' => 'Subscription Plan ID'
                ],
                'Access Type' => (object)[
                    'fieldKey' => 'access_type',
                    'fieldName' => 'Access Type'
                ],
                'Payment Type' => (object) [
                    'fieldKey' => 'payment_type',
                    'fieldName' => 'Payment Type'
                ],
                'Price Text' => (object) [
                    'fieldKey' => 'price_text',
                    'fieldName' => 'Price Text'
                ],
                'Subscription Plan Amount' => (object) [
                    'fieldKey' => 'arm_subscription_plan_amount',
                    'fieldName' => 'Subscription Plan Amount'
                ],
                'Subscription Plan Description' => (object) [
                    'fieldKey' => 'arm_subscription_plan_description',
                    'fieldName' => 'Subscription Plan Description'
                ],
                'Subscription Plan Role' => (object)[
                    'fieldKey' => 'arm_subscription_plan_role',
                    'fieldName' => 'Subscription Plan Role'
                ]
            ];
        }

        foreach ($fields as $field) {
            $fieldsNew[] = [
                'name' => $field->fieldKey,
                'type' => 'text',
                'label' => $field->fieldName,
            ];
        }
        if ($id == '101' || $id == '101_2' || $id == '101_3') {
            $registerFormFields = self::getRegisterFormFields();
            if ($id == '101_3') {
                $registerFormFields = array_merge($registerFormFields, [
                    [
                        'name' => 'gender',
                        'type' => 'text',
                        'label' => 'Gender'
                    ],
                    [
                        'name' => 'arm_user_plan',
                        'type' => 'text',
                        'label' => 'ARMember User Plan'
                    ]
                ]);
            }
            return $fieldsNew = array_merge($fieldsNew, $registerFormFields);
        }
        return $fieldsNew;
    }

    public static function getRegisterFormFields()
    {
        $form_id = 101;
        global $wpdb, $ARMember;

        $all_raw_fields = $wpdb->get_results(
            $wpdb->prepare("SELECT arm_form_field_option FROM wp_arm_form_field WHERE arm_form_field_form_id = %d", $form_id),
            ARRAY_A
        );
        $allFields = [];
        foreach ($all_raw_fields as $singleFields) {
            $individualFields = [];
            $extractFields = maybe_unserialize($singleFields['arm_form_field_option']);
            foreach ($extractFields as $key => $exField) {
                if ($key == 'meta_key' || $key == 'label' || $key == 'type') {
                    $individualFields[$key === 'meta_key' ? 'name' : $key] = $exField;
                }
            }
            if ($individualFields['name'] != 'user_pass' && $individualFields['name'] != '') {
                $allFields[] = $individualFields;
            }
        }
        return $allFields;
    }

    public static function getUserInfo($user_id)
    {
        $userInfo = get_userdata($user_id);
        $user = [];
        if ($userInfo) {
            $userData = $userInfo->data;
            $user_meta = get_user_meta($user_id);
            $user = [
                'user_id' => $user_id,
                'first_name' => $user_meta['first_name'][0],
                'last_name' => $user_meta['last_name'][0],
                'user_email' => $userData->user_email,
                'nickname' => $userData->user_nicename,
                'avatar_url' => get_avatar_url($user_id),
            ];
        }
        return $user;
    }

    public static function getInfoPlan($plan_id)
    {
        global $wpdb;
        $table_name = $wpdb->prefix . 'arm_subscription_plans';
        $plan = $wpdb->get_row($wpdb->prepare("SELECT * FROM $table_name WHERE `arm_subscription_plan_id` = %d", $plan_id));
        if (empty($plan)) {
            return;
        }
        $fieldWithValue = [];
        $neededKeys = ['arm_subscription_plan_id', 'arm_subscription_plan_name', 'arm_subscription_plan_options', 'arm_subscription_plan_description', 'arm_subscription_plan_amount', 'arm_subscription_plan_amount', 'arm_subscription_plan_role'];
        foreach ($plan as $key => $value) {
            if (in_array($key, $neededKeys)) {
                if ($key == 'arm_subscription_plan_options') {
                    $value = maybe_unserialize($value);
                    foreach ($value as $k => $v) {
                        $fieldWithValue[$k] = $v;
                    }
                } else {
                    $fieldWithValue[$key] = $value;
                }
            }
        }
        return $fieldWithValue;
    }

    public static function armember_user_info($user_id)
    {
        global $wpdb;
        $table_name = $wpdb->prefix . 'arm_members';
        $userInfo = $wpdb->get_row($wpdb->prepare("SELECT * FROM $table_name WHERE `arm_user_id` = %d", $user_id));
        if (empty($userInfo)) {
            return;
        }

        $mapedFields = ['arm_user_nicename', 'arm_user_email', 'arm_display_name'];
        foreach ($userInfo as $key => $value) {
            if (in_array($key, $mapedFields)) {
                $armUserInfo[$key] = $value;
            }
        }
        return $armUserInfo;
    }

    public static function userAndPlanData($user_id, $plan_id)
    {
        $userInfo = self::armember_user_info($user_id);
        $finalData['user_id'] = $user_id;
        $finalData['arm_user_nicename'] = $userInfo['arm_user_nicename'];
        $finalData['arm_user_email'] = $userInfo['arm_user_email'];
        $finalData['arm_display_name'] = $userInfo['arm_display_name'];
        $finalData['plan_id'] = $plan_id;
        $planId_detail = self::getInfoPlan($plan_id);
        $finalData = array_merge($finalData, $planId_detail);
        return $finalData;
    }
}
