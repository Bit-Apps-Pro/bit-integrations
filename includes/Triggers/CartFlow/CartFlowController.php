<?php

namespace BitCode\FI\Triggers\CartFlow;

use BitCode\FI\Flow\Flow;

final class CartFlowController
{
    public static function info()
    {
        $plugin_path = self::pluginActive('get_name');
        return [
            'name' => 'CartFlow',
            'title' => '
            CartFlows is a sales funnel builder for WordPress. It allows you to quickly and easily build sales funnels using your page builder of choice.',
            'slug' => $plugin_path,
            'pro' => $plugin_path,
            'type' => 'form',
            'is_active' => is_plugin_active($plugin_path),
            'activation_url' => wp_nonce_url(self_admin_url('plugins.php?action=activate&amp;plugin=' . $plugin_path . '&amp;plugin_status=all&amp;paged=1&amp;s'), 'activate-plugin_' . $plugin_path),
            'install_url' => wp_nonce_url(self_admin_url('update.php?action=install-plugin&plugin=' . $plugin_path), 'install-plugin_' . $plugin_path),
            'list' => [
                'action' => 'cartflow/get',
                'method' => 'get',
            ],
            'fields' => [
                'action' => 'cartflow/get/form',
                'method' => 'post',
                'data' => ['id']
            ],
        ];
    }

    public static function pluginActive($option = null)
    {
        if (is_plugin_active('cartflows/cartflows.php')) {
            return $option === 'get_name' ? 'cartflows/cartflows.php' : true;
        } else {
            return false;
        }
    }

    public static function handle_order_create_wc($order_id, $importType)
    {
        if (!is_plugin_active('woocommerce/woocommerce.php')) {
            return false;
        }

        $order = wc_get_order($order_id);
        $metaData = get_post_meta($order_id);
        $finalData = [];
        foreach ($metaData as $key => $value) {
            $finalData[ltrim($key, '_')] = $value[0];
        }
        $finalData['order_products'] = self::accessOrderData($order);
        $finalData['order_id'] = $order_id;
        $chekoutPageId = (int)$metaData['_wcf_checkout_id'][0];

        if (!empty($order_id) && $flows = Flow::exists('CartFlow', $chekoutPageId)) {
            Flow::execute('CartFlow', $chekoutPageId, $finalData, $flows);
        }
    }

    public function getAllForms()
    {
        if (!self::pluginActive()) {
            wp_send_json_error(__('CartFlows is not installed or activated', 'bit-integrations'));
        }

        $posts = self::getCartFlowPosts();

        $all_forms = [];
        if ($posts) {
            foreach ($posts as $form) {
                $all_forms[] = (object)[
                    'id' => $form->ID,
                    'title' => $form->post_title,
                    'post_id' => $form->ID,
                ];
            }
        }
        wp_send_json_success($all_forms);
    }

    public function getFormFields($data)
    {
        if (!self::pluginActive()) {
            wp_send_json_error(__('CartFlow is not installed or activated', 'bit-integrations'));
        }
        if (empty($data->id) && empty($data->postId)) {
            wp_send_json_error(__('Form doesn\'t exists', 'bit-integrations'));
        }

        $fields = self::fields($data);
        if (empty($fields)) {
            wp_send_json_error(__('Form doesn\'t exists any field', 'bit-integrations'));
        }

        $responseData['fields'] = $fields;
        $responseData['postId'] = $data->postId;
        wp_send_json_success($responseData);
    }

    public static function fields($data)
    {
        if (!isset($data->postId)) {
            return;
        }
        $FormFieldsInstance = new \CartflowsProAdmin\AdminCore\Ajax\FormFields();
        $allFields = $FormFieldsInstance->get_checkout_fields('billing', $data->postId);

        $fields = [];

        foreach ($allFields as $key => $val) {
            $fields[$key] = (object) [
                'fieldKey' => $key,
                'fieldName' => $val['label'],
            ];
        }

        $fields['order_products'] = (object) [
            'fieldKey' => 'order_products',
            'fieldName' => 'Order Products',
        ];
        $fields['order_id'] = (object) [
            'fieldKey' => 'order_id',
            'fieldName' => 'Order ID',
        ];

        foreach ($fields as $field) {
            $fieldsNew[] = [
                'name' => $field->fieldKey,
                'type' => 'text',
                'label' => $field->fieldName,
            ];
        }
        return $fieldsNew;
    }

    private static function getCartFlowPosts()
    {
        global $wpdb;
        return $wpdb->get_results(
            $wpdb->prepare(
                "SELECT ID, post_title FROM $wpdb->posts
                LEFT JOIN $wpdb->postmeta ON ($wpdb->posts.ID = $wpdb->postmeta.post_id)
                WHERE $wpdb->posts.post_status = 'publish' AND ($wpdb->posts.post_type = 'cartflows_step') AND $wpdb->postmeta.meta_key = 'wcf_fields_billing'"
            )
        );
    }

    private static function getCartFlowPostMeta(int $form_id)
    {
        global $wpdb;
        $postMeta = $wpdb->get_results(
            $wpdb->prepare(
                "SELECT meta_value FROM $wpdb->postmeta WHERE post_id=%d AND meta_key='wcf_fields_billing' LIMIT 1",
                $form_id
            )
        );
        return unserialize($postMeta[0]->meta_value);
    }

    public static function accessOrderData($order)
    {
        $line_items_all = [];
        $count = 0;
        foreach ($order->get_items() as $item_id => $item) {
            $product_id = $item->get_product_id();
            $variation_id = $item->get_variation_id();
            $product = $item->get_product();
            $product_name = $item->get_name();
            $quantity = $item->get_quantity();
            $subtotal = $item->get_subtotal();
            $total = $item->get_total();
            $subtotal_tax = $item->get_subtotal_tax();
            $taxclass = $item->get_tax_class();
            $taxstat = $item->get_tax_status();
            $label = 'line_items_';
            $count++;
            $line_items_all['line_items'][] = (object)[
                'product_id' => $product_id,
                'variation_id' => $variation_id,
                'product_name' => $product_name,
                'quantity' => $quantity,
                'subtotal' => $subtotal,
                'total' => $total,
                'subtotal_tax' => $subtotal_tax,
                'tax_class' => $taxclass,
                'tax_status' => $taxstat,
            ];
        }
        return $line_items_all;
    }
}