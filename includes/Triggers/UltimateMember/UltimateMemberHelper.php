<?php

namespace BitCode\FI\Triggers\UltimateMember;

class UltimateMemberHelper
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
            'User ID' => [
                'name' => 'user_id',
                'label' => 'User ID'
            ],
            'First Name' => [
                'name' => 'first_name',
                'label' => 'First Name'
            ],
            'Last Name' => [
                'name' => 'last_name',
                'label' => 'Last Name'
            ],
            'Nick Name' => [
                'name' => 'nickname',
                'label' => 'Nick Name'
            ],
            'Avatar URL' => [
                'name' => 'avatar_url',
                'label' => 'Avatar URL'
            ],
            'Email' => [
                'name' => 'user_email',
                'label' => 'Email',
            ],
        ];

        if ($id == 'roleChange' || $id == 'roleSpecificChange') {
            $fields = $userFields;
            (array)$fields['Role'] = [
                'name' => 'role',
                'label' => 'Role'
            ];
        } else {
            $form_id      = absint($id);
            if (function_exists('UM')) {
                $um_fields = UM()->query()->get_attr('custom_fields', $form_id);
                $formType = UM()->query()->get_attr('mode', $form_id);

                if ($um_fields) {
                    $fields = [];
                    foreach ($um_fields as $field) {
                        if (isset($field['public']) && 1 === absint($field['public'])) {
                            $input_id    = $field['metakey'];
                            $input_title = $field['title'];
                            $token_id    = "$input_id";
                            $input_type  = $field['type'];
                            if ($token_id !== 'user_password') {
                                $fields[]    = array(
                                    'name'         => $token_id,
                                    'label'       => $input_title,
                                    'type'       => $input_type,
                                );
                            }
                        }
                    }
                    if ($formType == 'login') {
                        $fields = array_merge($fields, $userFields);
                    }
                }
            }
        }
        foreach ($fields as $field) {
            $fieldsNew[] = [
                'name' => $field['name'],
                'type' => array_key_exists('type', $field) ? $field['type'] : 'text',
                'label' => $field['label'],
            ];
        }
        return $fieldsNew;
    }

    public static function getAllLoginAndRegistrationForm($formType)
    {
        $args = array(
            'posts_per_page'   => 999,
            'orderby'          => 'title',
            'order'            => 'ASC',
            'post_type'        => 'um_form',
            'post_status'      => 'publish',
            'suppress_filters' => true,
            'fields'           => array('ids', 'titles'),
            'meta_query'       => array(
                array(
                    'key'     => '_um_mode',
                    'value'   => $formType,
                    'compare' => 'LIKE',
                ),
            ),
        );


        $forms_list = get_posts($args);
        $formName = ucfirst($formType);
        foreach ($forms_list as $form) {
            $allForms[] = [
                'id' => "$form->ID",
                'title' => "$formName via $form->post_title",
            ];
        }
        return $allForms;
    }

    public static function getRoles()
    {
        $roles = [];
        foreach (wp_roles()->roles as $role_name => $role_info) {
            $roles[] = [
                'name' => $role_name,
                'label' => $role_info['name'],
            ];
        }
        return $roles;
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
}
