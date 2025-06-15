<?php

namespace BitCode\FI\Triggers\UltimateMember;

use BitCode\FI\Flow\Flow;

final class UltimateMemberController
{
    public static function info()
    {
        $plugin_path = self::pluginActive('get_name');
        return [
            'name' => 'UltimateMember',
            'title' => 'Ultimate Member is the #1 user profile & membership plugin for WordPress. The plugin makes it a breeze for users to sign-up and become members of your website.',
            'slug' => $plugin_path,
            'pro' => $plugin_path,
            'type' => 'form',
            'is_active' => is_plugin_active($plugin_path),
            'activation_url' => wp_nonce_url(self_admin_url('plugins.php?action=activate&amp;plugin=' . $plugin_path . '&amp;plugin_status=all&amp;paged=1&amp;s'), 'activate-plugin_' . $plugin_path),
            'install_url' => wp_nonce_url(self_admin_url('update.php?action=install-plugin&plugin=' . $plugin_path), 'install-plugin_' . $plugin_path),
            'list' => [
                'action' => 'ultimatemember/get',
                'method' => 'get',
            ],
            'fields' => [
                'action' => 'ultimatemember/get/form',
                'method' => 'post',
                'data' => ['id']
            ],
        ];
    }

    public static function pluginActive()
    {
        if (class_exists('UM')) {
            return true;
        }
        return false;
    }

    public function getAll()
    {
        if (!self::pluginActive()) {
            wp_send_json_error(__('Ultimate Member is not installed or activated', 'bit-integrations'));
        }

        $loginForms = UltimateMemberHelper::getAllLoginAndRegistrationForm('login');
        $registrationForms = UltimateMemberHelper::getAllLoginAndRegistrationForm('register');

        $types = array_merge([
            [ 'id' =>'roleSpecificChange',
             'title' => 'User\'s role changes to a specific role'],
             [ 'id' =>'roleChange',
             'title' => 'User\'s role change'],
        ], $loginForms, $registrationForms);
        $ultimateMember_action = [];
        foreach ($types as $type) {
            $ultimateMember_action[] = (object)[
                'id' => $type['id'],
                'title' => $type['title'],
            ];
        }
        wp_send_json_success($ultimateMember_action);
    }

    public function get_a_form($data)
    {
        if (!self::pluginActive()) {
            wp_send_json_error(__('Ultimate Member is not installed or activated', 'bit-integrations'));
        }
        if (empty($data->id)) {
            wp_send_json_error(__('Trigger type doesn\'t exists', 'bit-integrations'));
        }
        $fields = UltimateMemberHelper::fields($data->id);

        if (empty($fields)) {
            wp_send_json_error(__('Trigger doesn\'t exists any field', 'bit-integrations'));
        }

        $responseData['fields'] = $fields;
        $id = $data->id;
        if ($id == 'roleSpecificChange') {
            $responseData['allRole'] = UltimateMemberHelper::getRoles();
        }
        wp_send_json_success($responseData);
    }

    public static function handleUserLogViaForm($um_args)
    {
        
        if ( !isset( $um_args['form_id']) || !function_exists( 'um_user') ) {
        	return;
        }
        $user_id = um_user( 'ID' );
        $form_id = $um_args['form_id'];
        $flows = Flow::exists('UltimateMember', $form_id);
        if (empty($flows)) {
            return;
        }
        $finalData = UltimateMemberHelper::getUserInfo($user_id);
        $finalData['username'] = $um_args['username'];
        if ($finalData) {
            Flow::execute('UltimateMember', $form_id, $finalData, $flows);
        }
    }

    public static function handleUserRegisViaForm($user_id, $um_args)
    {
        $form_id = $um_args['form_id'];
        $flows = Flow::exists('UltimateMember', $form_id);
        if (empty($flows)) {
            return;
        }
        if (!empty($um_args['submitted'])) {
            Flow::execute('UltimateMember', $form_id, $um_args['submitted'], $flows);
        }
    }

    public static function handleUserRoleChange($user_id, $role, $old_roles)
    {
        $form_id = 'roleChange';
        $flows = Flow::exists('UltimateMember', $form_id);
        if (empty($flows)) {
            return;
        }
        $finalData = UltimateMemberHelper::getUserInfo($user_id);
        $finalData['role'] = $role;

        if ($finalData) {
            Flow::execute('UltimateMember', $form_id, $finalData, $flows);
        }
    }

    public static function handleUserSpecificRoleChange($user_id, $role, $old_roles)
    {
        $form_id = 'roleSpecificChange';
        $flows = Flow::exists('UltimateMember', $form_id);
        if (empty($flows)) {
            return;
        }
        $flowDetails = json_decode($flows[0]->flow_details);
        $selectedRole = !empty($flowDetails->selectedRole) ? $flowDetails->selectedRole : [];
        $finalData = UltimateMemberHelper::getUserInfo($user_id);
        $finalData['role'] = $role;
        if ($finalData && $role === $selectedRole) {
            Flow::execute('UltimateMember', $form_id, $finalData, $flows);
        }
    }

    public static function getUMrole(){
        $roles = UltimateMemberHelper::getRoles();
        wp_send_json_success($roles);
    }
}
