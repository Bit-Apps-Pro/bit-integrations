<?php

namespace BitCode\FI\controller;

use BitCode\FI\Core\Util\Capabilities;

final class UserController
{
    public function __construct()
    {
        //
    }

    public function getWpUsers()
    {
        if (Capabilities::Check('list_users') || Capabilities::Check('bit_integrations_manage_integrations')) {
            wp_send_json_error();
        }

        $users = get_users(['fields' => ['display_name', 'ID']]);

        wp_send_json_success($users);
    }

    public function getUserRoles()
    {
        if (Capabilities::Check('manage_options') || Capabilities::Check('bit_integrations_manage_integrations')) {
            wp_send_json_error();
        }
        global $wp_roles;
        $roles = [];
        $key = 0;
        foreach ($wp_roles->get_names() as $index => $role) {
            $key++;
            $roles[$key]['key'] = $index;
            $roles[$key]['name'] = $role;
        }
        wp_send_json_success($roles, 200);
    }
}
