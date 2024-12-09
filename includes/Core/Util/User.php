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

        return static::formattedData($user);
    }

    public static function currentUser()
    {
        if (!is_user_logged_in()) {
            return [];
        }

        $current_user = wp_get_current_user();

        return static::formattedData($current_user);
    }

    private static function formattedData(WP_user $user)
    {
        return [
            'wp_user_id'         => $user->ID,
            'wp_user_login'      => $user->user_login,
            'wp_display_name'    => $user->display_name,
            'wp_user_first_name' => $user->user_firstname,
            'wp_user_last_name'  => $user->user_lastname,
            'wp_user_email'      => $user->user_email,
            'wp_user_registered' => $user->user_registered,
            'wp_user_role'       => $user->roles,
        ];
    }
}
