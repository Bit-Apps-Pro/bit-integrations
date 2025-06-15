<?php
namespace BitCode\FI\controller;

final class UserController
{
    public function __construct()
    {
        //
    }

    public function getWpUsers()
    {
        $users = get_users(['fields' => ['display_name', 'ID']]);

        wp_send_json_success($users);
    }

    public function getUserRoles()
    {
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
