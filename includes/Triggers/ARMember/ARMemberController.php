<?php
namespace BitCode\FI\Triggers\ARMember;

use BitCode\FI\Flow\Flow;
use BitCode\FI\Triggers\ARMember\ARMemberHelper;

final class ARMemberController
{
    public static function info()
    {
        $plugin_path = self::pluginActive('get_name');
        return [
            'name' => 'ARMember',
            'title' => 'ARMember is one-of-its kind WordPress Membership Plugin that provides all genres of membership related functionality in a symmetrical way.',
            'slug' => $plugin_path,
            'pro' => $plugin_path,
            'type' => 'form',
            'is_active' => is_plugin_active($plugin_path),
            'activation_url' => wp_nonce_url(self_admin_url('plugins.php?action=activate&amp;plugin=' . $plugin_path . '&amp;plugin_status=all&amp;paged=1&amp;s'), 'activate-plugin_' . $plugin_path),
            'install_url' => wp_nonce_url(self_admin_url('update.php?action=install-plugin&plugin=' . $plugin_path), 'install-plugin_' . $plugin_path),
            'list' => [
                'action' => 'armember/get',
                'method' => 'get',
            ],
            'fields' => [
                'action' => 'armember/get/form',
                'method' => 'post',
                'data' => ['id']
            ],
        ];
    }

    public static function pluginActive($option = null)
    {

        if(class_exists('ARMember')){
            return true;
        }
        return false;
    }

    public function getAll()
    {
        if (!self::pluginActive()) {
            wp_send_json_error(__('ARMember is not installed or activated', 'bit-integrations'));
        }

        $types = [
           '101' => 'A user register by ARMember form',
           '101_2' => 'A user update profile by ARMember form',
           '101_3' => 'Add member by Admin',
           '4' => 'A user cancel subscription',
           '5' => 'Admin change user subscription plan',
           '6' => 'A user renew subscription plan',
        ];

        $armember_action = [];
        foreach ($types as $index => $type) {
            $armember_action[] = (object)[
                'id' => $index,
                'title' => $type,
            ];
        }
        wp_send_json_success($armember_action);
    }

    public function get_a_form($data)
    {
        if (!self::pluginActive()) {
            wp_send_json_error(__('ARMember is not installed or activated', 'bit-integrations'));
        }
        if (empty($data->id)) {
            wp_send_json_error(__('Trigger type doesn\'t exists', 'bit-integrations'));
        }
        $fields = ARMemberHelper::fields($data->id);

        if (empty($fields)) {
            wp_send_json_error(__('Trigger doesn\'t exists any field', 'bit-integrations'));
        }

        $responseData['fields'] = $fields;

        wp_send_json_success($responseData);
    }

    public static function handleRegisterForm($user_id, $post_data)
    {
        if(array_key_exists('arm_form_id', $post_data) === false){
            return;
        }
        $form_id = $post_data['arm_form_id'];
        $flows = Flow::exists('ARMember', $form_id = $post_data['arm_form_id']);
        if (empty($flows)) {
            return;
        }
        $userInfo = ARMemberHelper::getUserInfo($user_id);
        $post_data['user_id'] = $user_id;
        $post_data['nickname'] = $userInfo['nickname'];
        $post_data['avatar_url'] = $userInfo['avatar_url'];
        if (!empty($form_id) && $flows) {
            Flow::execute('ARMember', $form_id, $post_data, $flows);
        }
    }

    public static function handleUpdateUserByForm($user_ID, $posted_data){
        if(array_key_exists('form_random_key', $posted_data) === false){
            return;
        }
        $form_id = str_starts_with($posted_data['form_random_key'], '101');
        if(!$form_id){
            return;
        }
        $form_id = '101_2';
        $flows = Flow::exists('ARMember', $form_id);
        if (empty($flows)) {
            return;
        }
        $userInfo = ARMemberHelper::getUserInfo($user_ID);
        $posted_data['user_id'] = $user_ID;
        $posted_data['nickname'] = $userInfo['nickname'];
        $posted_data['avatar_url'] = $userInfo['avatar_url'];
        Flow::execute('ARMember', $form_id, $posted_data, $flows);
    }

    public static function handleMemberAddByAdmin($user_id, $post_data)
    {
        if(array_key_exists('action', $post_data) === false){
            return;
        }
        $form_id = $post_data['form'];
        if(!$form_id){
            return;
        }
        $form_id = '101_3';
        $flows = Flow::exists('ARMember', $form_id);
        if (empty($flows)) {
            return;
        }
        $userInfo = ARMemberHelper::getUserInfo($user_id);
        $post_data['user_id'] = $user_id;
        $post_data['nickname'] = $userInfo['nickname'];
        $post_data['avatar_url'] = $userInfo['avatar_url'];
        if (!empty($form_id) && $flows) {
            Flow::execute('ARMember', $form_id, $post_data, $flows);
        }
    }

    public static function handleCancelSubscription($user_id, $plan_id){
        $flows = Flow::exists('ARMember', '4');
        if (empty($flows)) {
            return;
        }
        $finalData = ARMemberHelper::userAndPlanData($user_id, $plan_id);
        if ($flows) {
            Flow::execute('ARMember', '4', $finalData, $flows);
        }
    }

    public static function handlePlanChangeAdmin($user_id, $plan_id){
        $flows = Flow::exists('ARMember', '5');
        if (empty($flows)) {
            return;
        }
        $finalData = ARMemberHelper::userAndPlanData($user_id, $plan_id);
        if ($flows) {
            Flow::execute('ARMember', '5', $finalData, $flows);
        }
    }
    
    public static function handleRenewSubscriptionPlan($user_id, $plan_id){
        $flows = Flow::exists('ARMember', '6');
        if (empty($flows)) {
            return;
        }
        $finalData = ARMemberHelper::userAndPlanData($user_id, $plan_id);
        if ($flows) {
            Flow::execute('ARMember', '6', $finalData, $flows);
        }
    }
}
