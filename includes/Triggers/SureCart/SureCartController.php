<?php
namespace BitCode\FI\Triggers\SureCart;

use BitCode\FI\Flow\Flow;
use SureCart\Models\Product;

final class SureCartController
{
    public static function info()
    {
        $plugin_path = self::pluginActive('get_name');
        return [
            'name' => 'SureCart',
            'title' => 'SureCart was made to make ecommerce easy with a simple to use, all-in-one platform, that anyone can set up in just a few minutes.',
            'slug' => $plugin_path,
            'pro' => $plugin_path,
            'type' => 'form',
            'is_active' => is_plugin_active($plugin_path),
            'activation_url' => wp_nonce_url(self_admin_url('plugins.php?action=activate&amp;plugin=' . $plugin_path . '&amp;plugin_status=all&amp;paged=1&amp;s'), 'activate-plugin_' . $plugin_path),
            'install_url' => wp_nonce_url(self_admin_url('update.php?action=install-plugin&plugin=' . $plugin_path), 'install-plugin_' . $plugin_path),
            'list' => [
                'action' => 'surecart/get',
                'method' => 'get',
            ],
            'fields' => [
                'action' => 'surecart/get/form',
                'method' => 'post',
                'data' => ['id']
            ],
        ];
    }

    public static function pluginActive($option = null)
    {
        if (is_plugin_active('surecart/surecart.php')) {
            return $option === 'get_name' ? 'surecart/surecart.php' : true;
        }
        return false;
    }

    public function getAll()
    {
        if (!self::pluginActive()) {
            wp_send_json_error(__('SureCart is not installed or activated', 'bit-integrations'));
        }

        $types = ['User perches a product', 'User revoke perches a product', 'User unrevoked perches product'];

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
            wp_send_json_error(__('SureCart is not installed or activated', 'bit-integrations'));
        }
        if (empty($data->id)) {
            wp_send_json_error(__('Trigger type doesn\'t exists', 'bit-integrations'));
        }
        $fields = self::fields($data->id);

        if (empty($fields)) {
            wp_send_json_error(__('Trigger doesn\'t exists any field', 'bit-integrations'));
        }

        if ($data->id == 1 || $data->id == 2 || $data->id == 3) {
            $responseData['allProduct'] = self::getAllProduct();
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

        $fields = SureCartHelper::mapFields($id);

        foreach ($fields as $field) {
            $fieldsNew[] = [
                'name' => $field->fieldKey,
                'type' => 'text',
                'label' => $field->fieldName,
            ];
        }
        return $fieldsNew;
    }

    public static function getAllProduct()
    {
        foreach (Product::get() as $product) {
            $products[] = [
                'product_id' => $product->id,
                'product_name' => $product->name,
            ];
        }

        $allProducts = array_merge([[
            'product_id' => 'any',
            'product_name' => 'Any Product',
        ]], $products);

        return $allProducts;
    }

    public static function surecart_purchase_product($data)
    {
        if (!self::pluginActive()) {
            wp_send_json_error(__('SureCart is not installed or activated', 'bit-integrations'));
        }
        $accountDetails = \SureCart\Models\Account::find();
        $product = Product::find($data['product_id']);
        $finalData = SureCartHelper::SureCartDataProcess($data, $product, $accountDetails);
        $flows = Flow::exists('SureCart', 1);
        if (!$flows) {
            return;
        }
        $flowDetails = json_decode($flows[0]->flow_details);
        $selectedProduct = !empty($flowDetails->selectedProduct) ? $flowDetails->selectedProduct : [];

        if ($flows && ($data['product_id'] == $selectedProduct || $selectedProduct === 'any')) {
            Flow::execute('SureCart', 1, $finalData, $flows);
        }
    }

    public static function get_sureCart_all_product()
    {
        $allProduct = self::getAllProduct();
        wp_send_json_success($allProduct);
    }

    public static function surecart_purchase_revoked($data)
    {
        $accountDetails = \SureCart\Models\Account::find();
        $finalData = [
            'store_name' => $accountDetails['name'],
            'store_url' => $accountDetails['url'],
            'purchase_id' => $data->id,
            'revoke_date' => $data->revoked_at,
            'customer_id' => $data->customer,
            'product_id' => $data->product->id,
            'product_description' => $data->product->description,
            'product_name' => $data->product->name,
            'product_image_id' => $data->product->image,
            'product_price' => ($data->product->prices->data[0]->full_amount) / 100,
            'product_currency' => $data->product->prices->data[0]->currency,

        ];

        $flows = Flow::exists('SureCart', 2);
        if (!$flows) {
            return;
        }

        $flowDetails = json_decode($flows[0]->flow_details);
        $selectedProduct = !empty($flowDetails->selectedProduct) ? $flowDetails->selectedProduct : [];

        if ($flows && ($data->product->id == $selectedProduct || $selectedProduct === 'any')) {
            Flow::execute('SureCart', 2, $finalData, $flows);
        }
    }

    public static function surecart_purchase_unrevoked($data)
    {
        $accountDetails = \SureCart\Models\Account::find();
        $finalData = [
            'store_name' => $accountDetails['name'],
            'store_url' => $accountDetails['url'],
            'purchase_id' => $data->id,
            'revoke_date' => $data->revoked_at,
            'customer_id' => $data->customer,
            'product_id' => $data->product->id,
            'product_description' => $data->product->description,
            'product_name' => $data->product->name,
            'product_image_id' => $data->product->image,
            'product_price' => ($data->product->prices->data[0]->full_amount) / 100,
            'product_currency' => $data->product->prices->data[0]->currency,
        ];

        $flows = Flow::exists('SureCart', 3);
        if (!$flows) {
            return;
        }

        $flowDetails = json_decode($flows[0]->flow_details);
        $selectedProduct = !empty($flowDetails->selectedProduct) ? $flowDetails->selectedProduct : [];

        if ($flows && ($data->product->id == $selectedProduct || $selectedProduct === 'any')) {
            Flow::execute('SureCart', 3, $finalData, $flows);
        }
    }
}
