<?php
namespace BitCode\FI\Triggers\Registration;

use BitCode\FI\Core\Util\Hooks;
use BitCode\FI\Flow\Flow;

final class RegistrationController
{
    public static function info()
    {
        return [
            'name' => 'User Registration',
            'title' => 'User Registration.',
            'type' => 'form',
            'is_active' => true,
            'list' => [
                'action' => 'registration/get',
                'method' => 'get',
            ],
            'fields' => [
                'action' => 'registration/get/form',
                'method' => 'post',
                'data' => ['id'],
            ],

        ];
    }

    public function getAll()
    {
        $forms = [
            ['id' => 1, 'title' => 'Create New User'],
            ['id' => 2, 'title' => 'User Profile Update'],
            ['id' => 3, 'title' => 'User Login'],
            ['id' => 4, 'title' => 'User reset password'],
            ['id' => 5, 'title' => 'User delete account'],
        ];

        wp_send_json_success($forms);
    }

    public static function fields($triggerId)
    {
        $fields = [
            [
                'name' => 'user_email',
                'label' => 'Email',
                'type' => 'email',
            ],
            [
                'name' => 'user_login',
                'label' => 'Username',
                'type' => 'text',
            ],

            [
                'name' => 'nickname',
                'label' => 'Nickname',
                'type' => 'text',
            ],
            [
                'name' => 'display_name',
                'label' => 'Display Name',
                'type' => 'text',
            ],
            [
                'name' => 'first_name',
                'label' => 'First Name',
                'type' => 'text',
            ],
            [
                'name' => 'last_name',
                'label' => 'Last Name',
                'type' => 'text',
            ],
            [
                'name' => 'user_url',
                'label' => 'Website',
                'type' => 'url',
            ],
            [
                'name' => 'description',
                'label' => 'Biographical Info',
                'type' => 'text',
            ],
        ];

        if (in_array($triggerId, [3, 4, 5])) {
            unset($fields[4], $fields[5], $fields[7]);

            array_unshift($fields, [
                'name' => 'user_id',
                'label' => 'User Id',
                'type' => 'text',
            ]);

            $fields = array_values($fields);
        }
        return $fields;
    }

    public function get_a_form($data)
    {
        $responseData['fields'] = self::fields($data->id);
        $responseData['fields'][] = [
            'name' => 'user_pass',
            'label' => 'Password',
            'type' => 'password',
        ];

        wp_send_json_success($responseData);
    }

    public static function userCreate()
    {
        $newUserData = func_get_args()[1];

        $userCreateFlow = Flow::exists('Registration', 1);

        if ($userCreateFlow) {
            Flow::execute('Registration', 1, $newUserData, $userCreateFlow);
        }
    }

    public static function profileUpdate()
    {
        $userdata = func_get_args()[2];

        $userUpdateFlow = Flow::exists('Registration', 2);

        if ($userUpdateFlow) {
            Flow::execute('Registration', 2, $userdata, $userUpdateFlow);
        }
    }

    public static function wpLogin($userId, $data)
    {
        $userLoginFlow = Flow::exists('Registration', 3);

        if ($userLoginFlow) {
            $user = [];

            if (isset($data->data)) {
                $user['user_id'] = $userId;
                $user['user_login'] = $data->data->user_login;
                $user['user_email'] = $data->data->user_email;
                $user['user_url'] = $data->data->user_url;
                $user['nickname'] = $data->data->user_nicename;
                $user['display_name'] = $data->data->display_name;
            }
            Flow::execute('Registration', 3, $user, $userLoginFlow);
        }
    }

    public static function wpResetPassword($data)
    {
        $userResetPassFlow = Flow::exists('Registration', 4);

        if ($userResetPassFlow) {
            $user = [];
            if (isset($data->data)) {
                $user['user_id'] = $data->data->ID;
                $user['user_login'] = $data->data->user_login;
                $user['user_email'] = $data->data->user_email;
                $user['user_url'] = $data->data->user_url;
                $user['nickname'] = $data->data->user_nicename;
                $user['display_name'] = $data->data->display_name;
            }

            Flow::execute('Registration', 4, $user, $userResetPassFlow);
        }
    }

    public static function wpUserDeleted()
    {
        $data = func_get_args()[2];

        $userDeleteFlow = Flow::exists('Registration', 5);

        if ($userDeleteFlow) {
            $user = [];
            if (isset($data->data)) {
                $user['user_id'] = $data->data->ID;
                $user['user_login'] = $data->data->user_login;
                $user['user_email'] = $data->data->user_email;
                $user['user_url'] = $data->data->user_url;
                $user['nickname'] = $data->data->user_nicename;
                $user['display_name'] = $data->data->display_name;
            }

            Flow::execute('Registration', 5, $user, $userDeleteFlow);
        }
    }
}
