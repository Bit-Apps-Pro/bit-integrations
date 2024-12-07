<?php

namespace BitCode\FI\Core\Util;

use WP_User;

class User
{
    public static function get($id)
    {
        if (empty($id)) {
            return [];
        }

        $user = new WP_User($id);

        if (empty($user->user_email)) {
            return [];
        }

        return [
            'wp_user_id'      => $user->ID,
            'user_login'      => $user->user_login,
            'display_name'    => $user->display_name,
            'user_firstname'  => $user->user_firstname,
            'user_lastname'   => $user->user_lastname,
            'user_email'      => $user->user_email,
            'user_registered' => $user->user_registered,
            'user_role'       => $user->roles,
        ];
    }
}
