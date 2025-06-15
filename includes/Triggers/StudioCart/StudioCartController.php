<?php

namespace BitCode\FI\Triggers\StudioCart;

use BitCode\FI\Flow\Flow;

final class StudioCartController
{
    protected static $actions = [
        "newOrderCreated" => [
            "id" => 2,
            "title" => "New Order Created"
        ],
    ];

    public static function info()
    {
        $plugin_path = self::pluginActive('get_name');
        return [
            'name'           => 'StudioCart',
            'title'          => 'Build high-converting checkout pages and sales funnels on your own website. No coding required.',
            'slug'           => $plugin_path,
            'pro'            => 'studiocart-pro/studiocart.php',
            'type'           => 'form',
            'is_active'      => self::pluginActive(),
            'activation_url' => wp_nonce_url(self_admin_url('plugins.php?action=activate&amp;plugin=' . $plugin_path . '&amp;plugin_status=all&amp;paged=1&amp;s'), 'activate-plugin_' . $plugin_path),
            'install_url'    => wp_nonce_url(self_admin_url('update.php?action=install-plugin&plugin=' . $plugin_path), 'install-plugin_' . $plugin_path),
            'list'           => [
                'action' => 'studiocart/get',
                'method' => 'get',
            ],
            'fields'         => [
                'action' => 'studiocart/get/form',
                'method' => 'post',
                'data'   => ['id']
            ],
        ];
    }

    public static function pluginActive($option = null)
    {
        if (is_plugin_active('studiocart-pro/studiocart.php')) {
            return $option === 'get_name' ? 'studiocart-pro/studiocart.php' : true;
        } elseif (is_plugin_active('studiocart/studiocart.php')) {
            return $option === 'get_name' ? 'studiocart/studiocart.php' : true;
        } else {
            return false;
        }
    }

    public static function newOrderCreated($status, $order_data, $order_type = 'main')
    {
        $flows = Flow::exists('StudioCart', self::$actions['newOrderCreated']['id']);

        if (!$flows) {
            return;
        }

        $data = [];
        foreach ($order_data as $key => $field_value) {
            $data[$key] = $field_value;
        }

        Flow::execute('StudioCart', self::$actions['newOrderCreated']['id'], $data, $flows);
    }

    public function getAll()
    {
        if (!self::pluginActive()) {
            wp_send_json_error(__('Studiocart is not installed or activated', 'bit-integrations'));
        }

        $sc_actions = [];
        foreach (self::$actions as $action) {
            $sc_actions[] = (object)[
                'id' => $action['id'],
                'title' => $action['title'],
            ];
        }
        wp_send_json_success($sc_actions);
    }

    public function get_a_form($data)
    {
        if (!self::pluginActive()) {
            wp_send_json_error(__('Studiocart is not installed or activated', 'bit-integrations'));
        }
        if (empty($data->id)) {
            wp_send_json_error(__('Form doesn\'t exists', 'bit-integrations'));
        }
        $fields = self::fields($data->id);
        if (empty($fields)) {
            wp_send_json_error(__('Form doesn\'t exists any field', 'bit-integrations'));
        }

        $responseData['fields'] = $fields;
        wp_send_json_success($responseData);
    }

    public static function fields($selectedAction)
    {
        $fieldDetails = [];
        if ($selectedAction == self::$actions['newOrderCreated']['id']) {
            $fieldDetails = self::getNewOrderFields();
        }

        $fields = [];

        foreach ($fieldDetails as $field) {
            $fields[] = [
                'name'  => $field['key'],
                'type' => $field['type'],
                'label' => $field['label'],
            ];
        }

        return $fields;
    }

    protected static function getNewOrderFields()
    {
        return [[
            'key' => 'id',
            'type' => 'text',
            'label' => 'order_id',
        ], [
            'key' => 'date',
            'type' => 'text',
            'label' => 'date',
        ], [
            'key' => 'transaction_id',
            'type' => 'text',
            'label' => 'transaction_id',
        ], [
            'key' => 'status',
            'type' => 'text',
            'label' => 'status',
        ], [
            'key' => 'payment_status',
            'type' => 'text',
            'label' => 'payment_status',
        ], [
            'key' => 'custom_fields_post_data',
            'type' => 'text',
            'label' => 'custom_fields_post_data',
        ], [
            'key' => 'custom_fields',
            'type' => 'text',
            'label' => 'custom_fields',
        ], [
            'key' => 'custom_prices',
            'type' => 'text',
            'label' => 'custom_prices',
        ], [
            'key' => 'product_id',
            'type' => 'text',
            'label' => 'product_id',
        ], [
            'key' => 'product_name',
            'type' => 'text',
            'label' => 'product_name',
        ], [
            'key' => 'page_id',
            'type' => 'text',
            'label' => 'page_id',
        ], [
            'key' => 'page_url',
            'type' => 'text',
            'label' => 'page_url',
        ], [
            'key' => 'item_name',
            'type' => 'text',
            'label' => 'item_name',
        ], [
            'key' => 'plan',
            'type' => 'text',
            'label' => 'plan',
        ], [
            'key' => 'plan_id',
            'type' => 'text',
            'label' => 'plan_id',
        ], [
            'key' => 'option_id',
            'type' => 'text',
            'label' => 'option_id',
        ], [
            'key' => 'invoice_total',
            'type' => 'text',
            'label' => 'invoice_total',
        ], [
            'key' => 'invoice_subtotal',
            'type' => 'text',
            'label' => 'invoice_subtotal',
        ], [
            'key' => 'amount',
            'type' => 'text',
            'label' => 'amount',
        ], [
            'key' => 'main_offer_amt',
            'type' => 'text',
            'label' => 'main_offer_amt',
        ], [
            'key' => 'pre_tax_amount',
            'type' => 'text',
            'label' => 'pre_tax_amount',
        ], [
            'key' => 'tax_amount',
            'type' => 'text',
            'label' => 'tax_amount',
        ], [
            'key' => 'auto_login',
            'type' => 'text',
            'label' => 'auto_login',
        ], [
            'key' => 'coupon',
            'type' => 'text',
            'label' => 'coupon',
        ], [
            'key' => 'coupon_id',
            'type' => 'text',
            'label' => 'coupon_id',
        ], [
            'key' => 'on_sale',
            'type' => 'text',
            'label' => 'on_sale',
        ], [
            'key' => 'accept_terms',
            'type' => 'text',
            'label' => 'accept_terms',
        ], [
            'key' => 'accept_privacy',
            'type' => 'text',
            'label' => 'accept_privacy',
        ], [
            'key' => 'consent',
            'type' => 'text',
            'label' => 'consent',
        ], [
            'key' => 'order_log',
            'type' => 'text',
            'label' => 'order_log',
        ], [
            'key' => 'order_bumps',
            'type' => 'text',
            'label' => 'order_bumps',
        ], [
            'key' => 'us_parent',
            'type' => 'text',
            'label' => 'us_parent',
        ], [
            'key' => 'ds_parent',
            'type' => 'text',
            'label' => 'ds_parent',
        ], [
            'key' => 'order_parent',
            'type' => 'text',
            'label' => 'order_parent',
        ], [
            'key' => 'order_type',
            'type' => 'text',
            'label' => 'order_type',
        ], [
            'key' => 'subscription_id',
            'type' => 'text',
            'label' => 'subscription_id',
        ], [
            'key' => 'firstname',
            'type' => 'text',
            'label' => 'firstname',
        ], [
            'key' => 'lastname',
            'type' => 'text',
            'label' => 'lastname',
        ], [
            'key' => 'first_name',
            'type' => 'text',
            'label' => 'first_name',
        ], [
            'key' => 'last_name',
            'type' => 'text',
            'label' => 'last_name',
        ], [
            'key' => 'customer_name',
            'type' => 'text',
            'label' => 'customer_name',
        ], [
            'key' => 'customer_id',
            'type' => 'text',
            'label' => 'customer_id',
        ], [
            'key' => 'email',
            'type' => 'text',
            'label' => 'email',
        ], [
            'key' => 'phone',
            'type' => 'text',
            'label' => 'phone',
        ], [
            'key' => 'country',
            'type' => 'text',
            'label' => 'country',
        ], [
            'key' => 'address1',
            'type' => 'text',
            'label' => 'address1',
        ], [
            'key' => 'address2',
            'type' => 'text',
            'label' => 'address2',
        ], [
            'key' => 'city',
            'type' => 'text',
            'label' => 'city',
        ], [
            'key' => 'state',
            'type' => 'text',
            'label' => 'state',
        ], [
            'key' => 'zip',
            'type' => 'text',
            'label' => 'zip',
        ], [
            'key' => 'ip_address',
            'type' => 'text',
            'label' => 'ip_address',
        ], [
            'key' => 'user_account',
            'type' => 'text',
            'label' => 'user_account',
        ], [
            'key' => 'pay_method',
            'type' => 'text',
            'label' => 'pay_method',
        ], [
            'key' => 'gateway_mode',
            'type' => 'text',
            'label' => 'gateway_mode',
        ], [
            'key' => 'currency',
            'type' => 'text',
            'label' => 'currency',
        ], [
            'key' => 'tax_rate',
            'type' => 'text',
            'label' => 'tax_rate',
        ], [
            'key' => 'tax_desc',
            'type' => 'text',
            'label' => 'tax_desc',
        ], [
            'key' => 'tax_data',
            'type' => 'text',
            'label' => 'tax_data',
        ], [
            'key' => 'tax_type',
            'type' => 'text',
            'label' => 'tax_type',
        ], [
            'key' => 'vat_number',
            'type' => 'text',
            'label' => 'vat_number',
        ], [
            'key' => 'stripe_tax_id',
            'type' => 'text',
            'label' => 'stripe_tax_id',
        ]];
    }
}
