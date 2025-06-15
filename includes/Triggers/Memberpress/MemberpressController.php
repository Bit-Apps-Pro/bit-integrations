<?php
namespace BitCode\FI\Triggers\Memberpress;

use BitCode\FI\Flow\Flow;

final class MemberpressController
{
    public static function info()
    {
        $plugin_path = self::pluginActive('get_name');
        return [
            'name' => 'Memberpress',
            'title' => 'Memberpress.',
            'slug' => $plugin_path,
            'pro' => $plugin_path,
            'type' => 'form',
            'is_active' => is_plugin_active($plugin_path),
            'activation_url' => wp_nonce_url(self_admin_url('plugins.php?action=activate&amp;plugin=' . $plugin_path . '&amp;plugin_status=all&amp;paged=1&amp;s'), 'activate-plugin_' . $plugin_path),
            'install_url' => wp_nonce_url(self_admin_url('update.php?action=install-plugin&plugin=' . $plugin_path), 'install-plugin_' . $plugin_path),
            'list' => [
                'action' => 'memberpress/get',
                'method' => 'get',
            ],
            'fields' => [
                'action' => 'memberpress/get/form',
                'method' => 'post',
                'data' => ['id']
            ],
        ];
    }

    public static function pluginActive($option = null)
    {
        if (is_plugin_active('memberpress/memberpress.php')) {
            return $option === 'get_name' ? 'memberpress/memberpress.php' : true;
        } else {
            return false;
        }
    }

    public function getAll()
    {
        if (!self::pluginActive()) {
            wp_send_json_error(__('Memberpress is not installed or activated', 'bit-integrations'));
        }

        $types = ['A user purchases a one-time subscription membership', 'A user purchases a recurring subscription membership', 'User cancels a membership', 'A user\'s subscribe membership expires', 'A user\'s subscribe membership paused.'];

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
            wp_send_json_error(__('Memberpress is not installed or activated', 'bit-integrations'));
        }
        if (empty($data->id)) {
            wp_send_json_error(__('Trigger type doesn\'t exists', 'bit-integrations'));
        }
        $fields = self::fields($data->id);

        if (empty($fields)) {
            wp_send_json_error(__('Trigger doesn\'t exists any field', 'bit-integrations'));
        }

        if ($data->id === '1') {
            $oneTimeMembership = self::getOneTimeSubscriptions();
            $responseData['oneTimeMembership'] = $oneTimeMembership ? $oneTimeMembership : [];
        } elseif ($data->id === '2' || $data->id === '5') {
            $recurringMembership = self::getRecurringSubscriptions();
            if ($data->id === '5') {
                $recurringMembership = array_merge([['membershipId' => 'any', 'membershipTitle' => 'Any Membership']], $recurringMembership);
            }
            $responseData['recurringMembership'] = $recurringMembership ? $recurringMembership : [];
        } elseif ($data->id === '3' || $data->id === '4') {
            $allMemberships = self::all_memberpress_products();
            $allMemberships = array_merge([['membershipId' => 'any', 'membershipTitle' => 'Any Membership']], $allMemberships);
            $responseData['allMemberships'] = $allMemberships;
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

        if ($id === '1' || $id === '2') {
            $oneTimefields = MemberpressHelper::getOneTimeField();
            $usersFields = MemberpressHelper::getUserField();
            $fields = array_merge($usersFields, $oneTimefields);
        } elseif ($id === '3' || $id === '4' || $id === '5') {
            $membershipCancelFields = MemberpressHelper::getMembershipCancelField();
            $usersFields = MemberpressHelper::getUserField();
            $fields = array_merge($usersFields, $membershipCancelFields);
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

    public static function getOneTimeSubscriptions()
    {
        $posts = get_posts([
            // 's'                 => $search,
            'post_type' => 'memberpressproduct',
            'posts_per_page' => 20,
            // 'page'              => $page,
            'post_status' => 'publish',
            'meta_query' => [
                [
                    'key' => '_mepr_product_period_type',
                    'value' => 'lifetime',
                    'compare' => '=',
                ]
            ]
        ]);

        foreach ($posts as $post) {
            $results[] = [
                'membershipId' => $post->ID,
                'membershipTitle' => $post->post_title,
            ];
        }
        return $results;
    }

    public static function getRecurringSubscriptions()
    {
        $posts = get_posts([
            'post_type' => 'memberpressproduct',
            'posts_per_page' => 20,
            'post_status' => 'publish',
            'meta_query' => [
                [
                    'key' => '_mepr_product_period_type',
                    'value' => 'lifetime',
                    'compare' => '!=',
                ]
            ]
        ]);

        foreach ($posts as $post) {
            $results[] = [
                'membershipId' => $post->ID,
                'membershipTitle' => $post->post_title,
            ];
        }
        return $results;
    }

    public function all_memberpress_products($label = null, $option_code = 'MPPRODUCT', $args = [])
    {
        $posts = get_posts([
            'post_type' => 'memberpressproduct',
            'posts_per_page' => 999,
            'post_status' => 'publish',
            'meta_query' => [
                'relation' => 'OR',
                [
                    'key' => '_mepr_product_period_type',
                    'value' => 'lifetime',
                    'compare' => '!=',
                ],
                [
                    'key' => '_mepr_product_period_type',
                    'value' => 'lifetime',
                    'compare' => '=',
                ],
            ],
        ]);

        foreach ($posts as $post) {
            $results[] = [
                'membershipId' => $post->ID,
                'membershipTitle' => $post->post_title,
            ];
        }
        return $results;
    }

    public static function oneTimeMembershipSubscribe(\MeprEvent $event)
    {
        $transaction = $event->get_data();
        $product = $transaction->product();
        $product_id = $product->ID;
        $user_id = absint($transaction->user()->ID);
        if ('lifetime' !== (string) $product->period_type) {
            return;
        }

        $postData = get_post($product_id);
        $userData = self::getUserInfo($user_id);
        $finalData = array_merge((array)$postData, $userData);

        if ($user_id && $flows = Flow::exists('Memberpress', 1)) {
            Flow::execute('Memberpress', 1, $finalData, $flows);
        }
    }

    public static function recurringMembershipSubscribe(\MeprEvent $event)
    {
        $transaction = $event->get_data();
        $product = $transaction->product();
        $product_id = $product->ID;
        $user_id = absint($transaction->user()->ID);
        if ('lifetime' === (string) $product->period_type) {
            return;
        }

        $postData = get_post($product_id);
        $userData = self::getUserInfo($user_id);
        $finalData = array_merge((array)$postData, $userData);

        if ($user_id && $flows = Flow::exists('Memberpress', 2)) {
            Flow::execute('Memberpress', 2, $finalData, $flows);
        }
    }

    public static function membershipSubscribeCancel($old_status, $new_status, $subscription)
    {
        $old_status = (string) $old_status;
        $new_status = (string) $new_status;

        if ($old_status === $new_status && $new_status !== 'cancelled') {
            return;
        }

        $product_id = $subscription->rec->product_id;
        $user_id = intval($subscription->rec->user_id);
        $userData = self::getUserInfo($user_id);
        $finalData = array_merge((array)$subscription->rec, $userData);

        $flows = Flow::exists('Memberpress', 3);
        if (!$flows) {
            return;
        }

        $flowDetails = json_decode($flows[0]->flow_details);
        $selectedCancelMembership = !empty($flowDetails->selectedCancelMembership) ? $flowDetails->selectedCancelMembership : [];

        if ($product_id === $selectedCancelMembership || $selectedCancelMembership === 'any') {
            Flow::execute('Memberpress', 3, $finalData, $flows);
        }
    }

    public static function membershipSubscribePaused($old_status, $new_status, $subscription)
    {
        $old_status = (string) $old_status;
        $new_statuss = (string) $new_status;

        if ($new_statuss !== 'suspended') {
            return;
        }
        $product_id = $subscription->rec->product_id;
        $user_id = intval($subscription->rec->user_id);
        $userData = self::getUserInfo($user_id);
        $finalData = array_merge((array)$subscription->rec, $userData);

        $flows = Flow::exists('Memberpress', 5);
        if (!$flows) {
            return;
        }

        $flowDetails = json_decode($flows[0]->flow_details);
        $selectedRecurringMembership = !empty($flowDetails->selectedRecurringMembership) ? $flowDetails->selectedRecurringMembership : [];

        if ($product_id === $selectedRecurringMembership || $selectedRecurringMembership === 'any') {
            Flow::execute('Memberpress', 5, $finalData, $flows);
        }
    }

    public static function membershipSubscribeExpire(\MeprEvent $event)
    {
        $transaction = $event->get_data();
        $product = $transaction->product();
        $product_id = $product->ID;
        $user_id = absint($transaction->user()->ID);

        $postData = get_post($product_id);
        $userData = self::getUserInfo($user_id);
        $finalData = array_merge((array)$postData, $userData);

        $flows = Flow::exists('Memberpress', 4);
        if (!$flows) {
            return;
        }

        $flowDetails = json_decode($flows[0]->flow_details);
        $selectedCancelMembership = !empty($flowDetails->selectedCancelMembership) ? $flowDetails->selectedCancelMembership : [];

        if ($product_id === $selectedCancelMembership || $selectedCancelMembership === 'any') {
            Flow::execute('Memberpress', 4, $finalData, $flows);
        }
    }

    // for edit fetching data
    public static function getAllMembership()
    {
        $allMemberships = self::all_memberpress_products();
        wp_send_json_success($allMemberships);
    }

    public static function getAllOnetimeMembership()
    {
        $oneTimeMembership = self::getOneTimeSubscriptions();
        wp_send_json_success($oneTimeMembership);
    }

    public static function getAllRecurringMembership()
    {
        $recurringMembership = self::getRecurringSubscriptions();
        wp_send_json_success($recurringMembership);
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
