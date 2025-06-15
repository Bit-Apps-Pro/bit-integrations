<?php
namespace BitCode\FI\Triggers\SolidAffiliate;

use BitCode\FI\Flow\Flow;

final class SolidAffiliateController
{
    public static function info()
    {
        $plugin_path = self::pluginActive('get_name');
        return [
            'name' => 'Solid Affiliate',
            'title' => 'Solid Affiliate is a WordPress plugin that makes it easy to build an affiliate program for any WooCommerce store .',
            'slug' => $plugin_path,
            'pro' => $plugin_path,
            'type' => 'form',
            'is_active' => is_plugin_active($plugin_path),
            'activation_url' => wp_nonce_url(self_admin_url('plugins.php?action=activate&amp;plugin=' . $plugin_path . '&amp;plugin_status=all&amp;paged=1&amp;s'), 'activate-plugin_' . $plugin_path),
            'install_url' => wp_nonce_url(self_admin_url('update.php?action=install-plugin&plugin=' . $plugin_path), 'install-plugin_' . $plugin_path),
            'list' => [
                'action' => 'solidaffiliate/get',
                'method' => 'get',
            ],
            'fields' => [
                'action' => 'solidaffiliate/get/form',
                'method' => 'post',
                'data' => ['id']
            ],
        ];
    }

    public static function pluginActive($option = null)
    {
        if (is_plugin_active('solid_affiliate/plugin.php')) {
            return $option === 'get_name' ? 'solid_affiliate/plugin.php' : true;
        } else {
            return false;
        }
    }

    public function getAll()
    {
        if (!self::pluginActive()) {
            wp_send_json_error(__('Solid Affiliate is not installed or activated', 'bit-integrations'));
        }

        $types = ['Created new affiliate', 'Created new referral affiliate'];

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
            wp_send_json_error(__('Solid affiliate is not installed or activated', 'bit-integrations'));
        }
        if (empty($data->id)) {
            wp_send_json_error(__('Trigger type doesn\'t exists', 'bit-integrations'));
        }
        $fields = self::fields($data->id);

        if (empty($fields)) {
            wp_send_json_error(__('Trigger doesn\'t exists any field', 'bit-integrations'));
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

        if ($id === '1'){
            $fields = SolidAffiliateHelper::getAffiliateField();
        } elseif ($id === '2'){
            $fields = SolidAffiliateHelper::getReferralAffiliateField();
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

    public static function newSolidAffiliateCreated($affiliate)
    {
        $attributes = $affiliate->__get('attributes');

        $flows = Flow::exists('SolidAffiliate', 1);
        if (!$flows) {
            return;
        }

        Flow::execute('SolidAffiliate', 1, $attributes, $flows);
    }

    public static function newSolidAffiliateReferralCreated($referral_accepted)
    {
        $affiliateReferralData = $referral_accepted->__get('attributes');
        $flows = Flow::exists('SolidAffiliate', 2);
        if (!$flows) {
            return;
        }
        Flow::execute('SolidAffiliate', 2, $affiliateReferralData, $flows);
    }
}








// fields


        // if ($id == '1') {
        //     $fields = [
        //         'user_id' => (object)[
        //             'fieldKey' => 'user_id',
        //             'fieldName' => 'User ID',
        //         ],
        //         'first_name' => (object)[
        //             'fieldKey' => 'first_name',
        //             'fieldName' => 'First Name',
        //         ],

        //         'last_name' => (object)[
        //             'fieldKey' => 'last_name',
        //             'fieldName' => 'Last Name',
        //         ],
        //         'commission_type' => (object)[
        //             'fieldKey' => 'commission_type',
        //             'fieldName' => 'Commission Type',
        //         ],
        //         'commission_rate' => (object)[
        //             'fieldKey' => 'commission_rate',
        //             'fieldName' => 'Commission Rate',
        //         ],
        //         'payment_email' => (object)[
        //             'fieldKey' => 'payment_email',
        //             'fieldName' => 'Payment Email',
        //         ],
        //         'mailchimp_user_id' => (object) [
        //             'fieldKey' => 'mailchimp_user_id',
        //             'fieldName' => 'Mailchimp User ID',
        //         ],
        //         'affiliate_group_id' => (object) [
        //             'fieldKey' => 'affiliate_group_id',
        //             'fieldName' => 'Affiliate Group ID',
        //         ],
        //         'registration_notes' => (object) [
        //             'fieldKey' => 'registration_notes',
        //             'fieldName' => 'Registration Notes',
        //         ],
        //         'status' => (object)[
        //             'fieldKey' => 'status',
        //             'fieldName' => 'Status',
        //         ],
        //         'created_at' => (object) [
        //             'fieldKey' => 'created_at',
        //             'fieldName' => 'Created At',
        //         ],
        //         'updated_at' => (object) [
        //             'fieldKey' => 'updated_at',
        //             'fieldName' => 'Updated At',
        //         ],

        //     ];
        // } elseif ($id === '2') {
        //     $fields = [
        //         'affiliate_id' => (object)[
        //             'fieldKey' => 'affiliate_id',
        //             'fieldName' => 'Affiliate ID',
        //         ],
        //         'order_amount' => (object)[
        //             'fieldKey' => 'order_amount',
        //             'fieldName' => 'Order Amount',
        //         ],
        //         'commission_amount' => (object)[
        //             'fieldKey' => 'commission_amount',
        //             'fieldName' => 'Commission Amount',
        //         ],
        //         'referral_source' => (object)[
        //             'fieldKey' => 'referral_source',
        //             'fieldName' => 'Referral Source',
        //         ],
        //         'visit_id' => (object)[
        //             'fieldKey' => 'visit_id',
        //             'fieldName' => 'Visit ID',
        //         ],
        //         'coupon_id' => (object)[
        //             'fieldKey' => 'coupon_id',
        //             'fieldName' => 'Coupon ID',
        //         ],
        //         'customer_id' => (object)[
        //             'fieldKey' => 'customer_id',
        //             'fieldName' => 'Customer ID',
        //         ],
        //         'referral_type' => (object)[
        //             'fieldKey' => 'referral_type',
        //             'fieldName' => 'Referral Type',
        //         ],
        //         'description' => (object)[
        //             'fieldKey' => 'description',
        //             'fieldName' => 'Description',
        //         ],
        //         'order_source' => (object)[
        //             'fieldKey' => 'order_source',
        //             'fieldName' => 'Order Source',
        //         ],
        //         'order_id' => (object)[
        //             'fieldKey' => 'order_id',
        //             'fieldName' => 'Order ID',
        //         ],
        //         'payout_id' => (object)[
        //             'fieldKey' => 'payout_id',
        //             'fieldName' => 'Payout ID',
        //         ],
        //         'status' => (object)[
        //             'fieldKey' => 'status',
        //             'fieldName' => 'Status',
        //         ],
        //         'created_at' => (object) [
        //             'fieldKey' => 'created_at',
        //             'fieldName' => 'Created At',
        //         ],
        //         'updated_at' => (object) [
        //             'fieldKey' => 'updated_at',
        //             'fieldName' => 'Updated At',
        //         ]
        //     ];
        // }