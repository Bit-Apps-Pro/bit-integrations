<?php

namespace BitCode\FI\Triggers\EDD;

use BitCode\FI\Flow\Flow;

final class EDDController
{
    public static function info()
    {
        $plugin_path = self::pluginActive('get_name');
        return [
            'name' => 'Easy Digital Downloads',
            'title' => 'From eBooks, to WordPress plugins, to PDF files and more, we make selling   digital products a breeze',
            'slug' => $plugin_path,
            'pro' => $plugin_path,
            'type' => 'form',
            'is_active' => is_plugin_active($plugin_path),
            'activation_url' => wp_nonce_url(self_admin_url('plugins.php?action=activate&amp;plugin=' . $plugin_path . '&amp;plugin_status=all&amp;paged=1&amp;s'), 'activate-plugin_' . $plugin_path),
            'install_url' => wp_nonce_url(self_admin_url('update.php?action=install-plugin&plugin=' . $plugin_path), 'install-plugin_' . $plugin_path),
            'list' => [
                'action' => 'edd/get',
                'method' => 'get',
            ],
            'fields' => [
                'action' => 'edd/get/form',
                'method' => 'post',
                'data' => ['id']
            ],
        ];
    }

    public static function pluginActive($option = null)
    {
        if (function_exists('EDD')) {
            return true;
        }
        return false;
    }

    public function getAll()
    {
        if (!self::pluginActive()) {
            wp_send_json_error(__('Easy Digital Downloads is not installed or activated', 'bit-integrations'));
        }

        $types = [
            'A user purchases a product',
            'Product purchase with a discount code',
            'User order refunded by stripe gateway',
        ];

        $edd_action = [];
        foreach ($types as $index => $type) {
            $edd_action[] = (object)[
                'id' => $index + 1,
                'title' => $type,
            ];
        }
        wp_send_json_success($edd_action);
    }

    public function get_a_form($data)
    {
        if (!self::pluginActive()) {
            wp_send_json_error(__('Easy Digital Downloads is not installed or activated', 'bit-integrations'));
        }
        if (empty($data->id)) {
            wp_send_json_error(__('Trigger type doesn\'t exists', 'bit-integrations'));
        }
        $fields = EDDHelper::fields($data->id);

        if (empty($fields)) {
            wp_send_json_error(__('Trigger doesn\'t exists any field', 'bit-integrations'));
        }

        $id = $data->id;
        if ($id == 1) {
            $responseData['allProduct'] = EDDHelper::allProducts();
        } elseif ($id == 2) {
            $responseData['allDiscountCode'] = EDDHelper::allDiscount();
        }

        $responseData['fields'] = $fields;
        wp_send_json_success($responseData);
    }

    public static function handlePurchaseProduct($payment_id)
    {

        $flows = Flow::exists('EDD', 1);
        if (!$flows) {
            return;
        }

        $cart_items = edd_get_payment_meta_cart_details($payment_id);
        if (!class_exists('\EDD_Payment') || empty($cart_items)) {
            return;
        }

        $payment = new \EDD_Payment($payment_id);

        foreach ($cart_items as $item) {
            $final_data = [
                'user_id' => $payment->user_id,
                'first_name' => $payment->first_name,
                'last_name' => $payment->last_name,
                'user_email' => $payment->email,
                'product_name' => $item['name'],
                'product_id' => $item['id'],
                'order_item_id' => $item['order_item_id'],
                'discount_codes' => $payment->discounts,
                'order_discounts' => $item['discount'],
                'order_subtotal' => $payment->subtotal,
                'order_total' => $payment->total,
                'order_tax' => $payment->tax,
                'payment_method' => $payment->gateway,
            ];
        }

        $flowDetails = json_decode($flows[0]->flow_details);
        $selectedProduct = !empty($flowDetails->selectedProduct) ? $flowDetails->selectedProduct : [];
        if ($flows && ($final_data['product_id'] == $selectedProduct || $selectedProduct === 'any')) {
            Flow::execute('EDD', 1, $final_data, $flows);
        }
    }
    public static function handlePurchaseProductDiscountCode($payment_id, $payment, $customer)
    {
        $flows = Flow::exists('EDD', 2);
        if (!$flows) {
            return;
        }

        $cart_items = edd_get_payment_meta_cart_details($payment_id);
        if (!class_exists('\EDD_Payment') || empty($cart_items)) {
            return;
        }

        $payment = new \EDD_Payment($payment_id);
        foreach ($cart_items as $item) {
            $final_data = [
                'user_id' => $payment->user_id,
                'first_name' => $payment->first_name,
                'last_name' => $payment->last_name,
                'user_email' => $payment->email,
                'product_name' => $item['name'],
                'product_id' => $item['id'],
                'order_item_id' => $item['order_item_id'],
                'discount_codes' => $payment->discounts,
                'order_discounts' => $item['discount'],
                'order_subtotal' => $payment->subtotal,
                'order_total' => $payment->total,
                'order_tax' => $payment->tax,
                'payment_method' => $payment->gateway,
                'status' => $payment->status,
            ];
        }

        $flowDetails = json_decode($flows[0]->flow_details);
        $selectedDiscount = !empty($flowDetails->selectedDiscount) ? $flowDetails->selectedDiscount : [];
        if ($flows && ($final_data['discount_codes'] == $selectedDiscount || $selectedDiscount === 'any')) {
            Flow::execute('EDD', 2, $final_data, $flows);
        }
    }

    public static function handleOrderRefunded($order_id)
    {
        $flows = Flow::exists('EDD', 3);
        if (!$flows) {
            return;
        }

        $order_detail   = edd_get_payment($order_id);
        $total_discount = 0;

        if (empty($order_detail)) {
            return;
        }

        $payment_id = $order_detail->ID;
        $user_id    = edd_get_payment_user_id($payment_id);

        if (! $user_id) {
            $user_id = wp_get_current_user()->ID;
        }

        $userInfo = EDDHelper::getUserInfo($user_id);

        $payment_info = [
            'first_name' => $userInfo['first_name'],
            'last_name' => $userInfo['last_name'],
            'nickname' => $userInfo['nickname'],
            'avatar_url' => $userInfo['avatar_url'],
            'user_email' => $userInfo['user_email'],
            'discount_codes'  => $order_detail->discounts,
            'order_discounts' => $total_discount,
            'order_subtotal'  => $order_detail->subtotal,
            'order_total'     => $order_detail->total,
            'order_tax'       => $order_detail->tax,
            'payment_method'  => $order_detail->gateway,
        ];

        Flow::execute('EDD', 3, $payment_info, $flows);
    }

    public static function getProduct()
    {
        $products = EDDHelper::allProducts();
        wp_send_json_success($products);
    }

    public static function getDiscount()
    {
        $discounts = EDDHelper::allDiscount();
        wp_send_json_success($discounts);
    }
}
