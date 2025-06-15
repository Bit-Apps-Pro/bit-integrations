<?php

namespace BitCode\FI\Triggers\PaidMembershipPro;

use BitCode\FI\Flow\Flow;

final class PaidMembershipProController
{
    public static function info()
    {
        $plugin_path = self::pluginActive('get_name');
        return [
            'name' => 'Paid Membership Pro',
            'title' => 'PaidMembershipPro.',
            'slug' => $plugin_path,
            'pro' => $plugin_path,
            'type' => 'form',
            'is_active' => is_plugin_active($plugin_path),
            'activation_url' => wp_nonce_url(self_admin_url('plugins.php?action=activate&amp;plugin=' . $plugin_path . '&amp;plugin_status=all&amp;paged=1&amp;s'), 'activate-plugin_' . $plugin_path),
            'install_url' => wp_nonce_url(self_admin_url('update.php?action=install-plugin&plugin=' . $plugin_path), 'install-plugin_' . $plugin_path),
            'list' => [
                'action' => 'paidmembershippro/get',
                'method' => 'get',
            ],
            'fields' => [
                'action' => 'paidmembershippro/get/form',
                'method' => 'post',
                'data' => ['id']
            ],
        ];
    }

    public static function pluginActive($option = null)
    {
        if (is_plugin_active('paid-memberships-pro/paid-memberships-pro.php')) {
            return $option === 'get_name' ? 'paid-memberships-pro/paid-memberships-pro.php' : true;
        }
        return false;
    }

    public function getAll()
    {
        if (!self::pluginActive()) {
            wp_send_json_error(__('Paid Membership Pro is not installed or activated', 'bit-integrations'));
        }

        $types = ['An admin assigns a membership level to a user', 'User cancels a membership', 'User purchases a membership', 'User\'s subscription to a membership expires'];

        $affiliate_action = [];
        foreach ($types as $index => $type) {
            $affiliate_action[] = (object)[
                'id' => $index + 1,
                'title' => $type,
            ];
        }
        wp_send_json_success($affiliate_action);
    }

    public function get_a_form($data)
    {
        if (!self::pluginActive()) {
            wp_send_json_error(__('Paid Membership Pro is not installed or activated', 'bit-integrations'));
        }
        if (empty($data->id)) {
            wp_send_json_error(__('Trigger type doesn\'t exists', 'bit-integrations'));
        }
        $fields = self::fields($data->id);

        if (empty($fields)) {
            wp_send_json_error(__('Trigger doesn\'t exists any field', 'bit-integrations'));
        }
        if ($data->id === '1' || $data->id === '2' || $data->id === '3' || $data->id === '4') {
            $levels = self::all_memberships();
            $responseData['AllMembershipLevels'] = $levels;
        }
        $responseData['fields'] = $fields;
        wp_send_json_success($responseData);
    }

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

        if ($id === '1' || $id === '2' || $id === '3' || $id === '4') {
            $membershipFields = PaidMembershipProHelper::getPaidMembershipProField();
            $userFields = PaidMembershipProHelper::getUserField();
            $fields = array_merge($membershipFields, $userFields);
        }

        foreach ($fields as $field) {
            $fieldsNew[] = [
                'name' => $field->fieldKey,
                'type' => 'text',
                'label' => $field->fieldName,
            ];
        }
        return $fieldsNew;
    }

    public static function perches_membershhip_level_by_administator($level_id, $user_id, $cancel_level)
    {
        if ($level_id == 0) {
            return;
        }
        global $wpdb;
        $levels = $wpdb->get_results($wpdb->prepare("SELECT * FROM $wpdb->pmpro_membership_levels WHERE id = %d", $level_id));
        $userData = self::getUserInfo($user_id);
        $finalData = array_merge($userData, (array)$levels[0]);
        $flows = Flow::exists('PaidMembershipPro', 1);
        $flowDetails = json_decode($flows[0]->flow_details);
        $selectedMembershipLevel = !empty($flowDetails->selectedMembershipLevel) ? $flowDetails->selectedMembershipLevel : [];
        if ($flows && $level_id === $selectedMembershipLevel || $selectedMembershipLevel === 'any') {
            Flow::execute('PaidMembershipPro', 1, $finalData, $flows);
        }
    }

    public static function cancel_membershhip_level($level_id, $user_id, $cancel_level)
    {
        if (0 !== absint($level_id)) {
            return;
        }
        global $wpdb;
        $levels = $wpdb->get_results($wpdb->prepare("SELECT * FROM $wpdb->pmpro_membership_levels WHERE id = %d", $cancel_level));
        $userData = self::getUserInfo($user_id);
        $finalData = array_merge($userData, (array)$levels[0]);
        $flows = Flow::exists('PaidMembershipPro', 2);
        $flowDetails = json_decode($flows[0]->flow_details);
        $selectedMembershipLevel = !empty($flowDetails->selectedMembershipLevel) ? $flowDetails->selectedMembershipLevel : [];
        if ($flows && ($cancel_level == $selectedMembershipLevel || $selectedMembershipLevel === 'any')) {
            Flow::execute('PaidMembershipPro', 2, $finalData, $flows);
        }
    }

    public static function perches_membership_level($user_id, $morder)
    {
        $user = $morder->getUser();
        $membership = $morder->getMembershipLevel();
        $user_id = $user->ID;
        $membership_id = $membership->id;

        global $wpdb;
        $levels = $wpdb->get_results($wpdb->prepare("SELECT * FROM $wpdb->pmpro_membership_levels WHERE id = %d", $membership_id));
        $userData = self::getUserInfo($user_id);
        $finalData = array_merge($userData, (array)$levels[0]);
        $flows = Flow::exists('PaidMembershipPro', 3);
        $flowDetails = json_decode($flows[0]->flow_details);
        $selectedMembershipLevel = !empty($flowDetails->selectedMembershipLevel) ? $flowDetails->selectedMembershipLevel : [];
        if ($flows && ($membership_id == $selectedMembershipLevel || $selectedMembershipLevel === 'any')) {
            Flow::execute('PaidMembershipPro', 3, $finalData, $flows);
        }
    }

    public static function expiry_membership_level($user_id, $membership_id)
    {
        global $wpdb;
        $levels = $wpdb->get_results($wpdb->prepare("SELECT * FROM $wpdb->pmpro_membership_levels WHERE id = %d", $membership_id));
        $userData = self::getUserInfo($user_id);
        $finalData = array_merge($userData, (array)$levels[0]);
        $flows = Flow::exists('PaidMembershipPro', 4);
        $flowDetails = json_decode($flows[0]->flow_details);
        $selectedMembershipLevel = !empty($flowDetails->selectedMembershipLevel) ? $flowDetails->selectedMembershipLevel : [];
        if ($flows && ($membership_id == $selectedMembershipLevel || $selectedMembershipLevel === 'any')) {
            Flow::execute('PaidMembershipPro', 4, $finalData, $flows);
        }
    }

    public static function all_memberships($label = null, $option_code = 'PMPMEMBERSHIP')
    {
        global $wpdb;
        $levels = $wpdb->get_results($wpdb->prepare("SELECT * FROM $wpdb->pmpro_membership_levels ORDER BY id ASC"));
        $allLevels = [];
        if ($levels) {
            foreach ($levels as $level) {
                $allLevels[] = [
                    'membershipId' => $level->id,
                    'membershipTitle' => $level->name,
                ];
            }
        }

        $allLevels = array_merge($allLevels, [[
            'membershipId' => 'any',
            'membershipTitle' => 'Any Membership Level',
        ]]);
        return $allLevels;
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

    public static function getAllPaidMembershipProLevel()
    {
        $getAllMembership = self::all_memberships();
        wp_send_json_success($getAllMembership);
    }
}
