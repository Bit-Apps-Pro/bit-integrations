<?php
namespace BitCode\FI\Triggers\SureCart;

final class SureCartHelper
{
    public static function mapFields($id)
    {
        if ($id == 1) {
            $fields = [
                'Store Name' => (object) [
                    'fieldKey' => 'store_name',
                    'fieldName' => 'Store Name',
                ],
                'Store Url' => (object) [
                    'fieldKey' => 'store_url',
                    'fieldName' => 'Store Url',
                ],
                'Product Id' => (object) [
                    'fieldKey' => 'product_id',
                    'fieldName' => 'Product Id',
                ],
                'Product Name' => (object) [
                    'fieldKey' => 'product_name',
                    'fieldName' => 'Product Name',
                ],
                'Product Description' => (object) [
                    'fieldKey' => 'product_description',
                    'fieldName' => 'Product Description',
                ],
                'Product Thumb' => (object) [
                    'fieldKey' => 'product_thumb',
                    'fieldName' => 'Product Thumb',
                ],
                'Product Thumb Id' => (object) [
                    'fieldKey' => 'product_thumb_id',
                    'fieldName' => 'Product Thumb Id',
                ],
                'Product Price Id' => (object) [
                    'fieldKey' => 'product_price_id',
                    'fieldName' => 'Product Price Id',
                ],
                'Order Number' => (object) [
                    'fieldKey' => 'order_number',
                    'fieldName' => 'Order Number',
                ],
                'Product Price' => (object) [
                    'fieldKey' => 'product_price',
                    'fieldName' => 'Product Price',
                ],
                'Product Quantity' => (object) [
                    'fieldKey' => 'product_quantity',
                    'fieldName' => 'Product Quantity',
                ],
                'Max Price amount' => (object) [
                    'fieldKey' => 'max_price_amount',
                    'fieldName' => 'Max Price amount',
                ],
                'Min Price amount' => (object) [
                    'fieldKey' => 'min_price_amount',
                    'fieldName' => 'Min Price amount',
                ],
                'Order Id' => (object) [
                    'fieldKey' => 'order_id',
                    'fieldName' => 'Order Id',
                ],
                'Order Date' => (object) [
                    'fieldKey' => 'order_date',
                    'fieldName' => 'Order Date',
                ],
                'Order Status' => (object) [
                    'fieldKey' => 'order_status',
                    'fieldName' => 'Order Status',
                ],
                'Order Paid Amount' => (object) [
                    'fieldKey' => 'order_paid_amount',
                    'fieldName' => 'Order Paid Amount',
                ],
                'Payment Currency' => (object) [
                    'fieldKey' => 'payment_currency',
                    'fieldName' => 'Payment Currency',
                ],
                'Payment Method' => (object) [
                    'fieldKey' => 'payment_method',
                    'fieldName' => 'Payment Method',
                ],
                'customer_id' => (object) [
                    'fieldKey' => 'customer_id',
                    'fieldName' => 'Customer Id',
                ],
                'Subscriptions Id' => (object) [
                    'fieldKey' => 'subscriptions_id',
                    'fieldName' => 'Subscriptions Id',
                ],
            ];
        } elseif ($id == 2 || $id == 3) {
            $fields = [
                'Store Name' => (object) [
                    'fieldKey' => 'store_name',
                    'fieldName' => 'Store Name',
                ],
                'Store Url' => (object) [
                    'fieldKey' => 'store_url',
                    'fieldName' => 'Store Url',
                ],
                'Purchase Id' => (object) [
                    'fieldKey' => 'purchase_id',
                    'fieldName' => 'Purchase Id',
                ],
                'Revoke Date' => (object) [
                    'fieldKey' => 'revoke_date',
                    'fieldName' => 'Revoke Date',
                ],
                'Customer Id' => (object) [
                    'fieldKey' => 'customer_id',
                    'fieldName' => 'Customer Id',
                ],
                'Product Id' => (object) [
                    'fieldKey' => 'product_id',
                    'fieldName' => 'Product Id',
                ],
                'Product Description' => (object) [
                    'fieldKey' => 'product_description',
                    'fieldName' => 'Product Description',
                ],
                'Product_name' => (object) [
                    'fieldKey' => 'product_name',
                    'fieldName' => 'Product Name',
                ],
                'Product Image_id' => (object) [
                    'fieldKey' => 'product_image_id',
                    'fieldName' => 'Product Image Id',
                ],
                'Product Price' => (object) [
                    'fieldKey' => 'product_price',
                    'fieldName' => 'Product Price',
                ],
                'Product Currency' => (object) [
                    'fieldKey' => 'product_currency',
                    'fieldName' => 'Product Currency',
                ],
            ];
        }
        return $fields;
    }

    public static function SureCartDataProcess($data, $product, $accountDetails)
    {
        $purchaseFinalData = self::purchase_data_process($data['id']);
        return [
            'store_name' => $accountDetails['name'],
            'store_url' => $accountDetails['url'],
            'product_name' => $product['name'],
            'product_id' => $product['id'],
            'product_description' => $product['description'],
            'product_thumb_id' => $purchaseFinalData['product_thumb_id'],
            'product_thumb' => $purchaseFinalData['product_thumb'],
            'product_price' => $product->price,
            'product_price_id' => $purchaseFinalData['product_price_id'],
            'product_quantity' => $data['quantity'],
            'max_price_amount' => $product['metrics']->max_price_amount,
            'min_price_amount' => $product['metrics']->min_price_amount,
            'order_id' => $purchaseFinalData['order_id'],
            'order_paid_amount' => $data['order_paid_amount'],
            'payment_currency' => $accountDetails['currency'],
            'payment_method' => $purchaseFinalData['payment_method'],
            'customer_id' => $data['customer_id'],
            'subscriptions_id' => $purchaseFinalData['subscriptions_id'],
            'order_number' => $purchaseFinalData['order_number'],
            'order_date' => $purchaseFinalData['order_date'],
            'order_status' => $purchaseFinalData['order_status'],
            'order_paid_amount' => $purchaseFinalData['order_paid_amount'],
            'order_subtotal' => $purchaseFinalData['order_subtotal'],
            'order_total' => $purchaseFinalData['order_total'],

        ];
    }

    public static function purchase_data_process($id)
    {
        $purchase_data = self::purchase_details($id);
        $price = self::get_price($purchase_data);
        $chekout = $purchase_data->initial_order->checkout;
        $sanitizeData = [
            'product' => $purchase_data->product->name,
            'product_id' => $purchase_data->product->id,
            'product_thumb_id' => isset($purchase_data->product->image) ? $purchase_data->product->image : '',
            'product_thumb' => isset($purchase_data->product->image_url) ? $purchase_data->product->image_url : '',
            'product_price_id' => isset($price->id) ? $price->id : '',
            'order_id' => $purchase_data->initial_order->id,
            'subscription_id' => isset($purchase_data->subscription->id) ? $purchase_data->subscription->id : '',
            'order_number' => $purchase_data->initial_order->number,
            'order_date' => date(get_option('date_format', 'F j, Y'), $purchase_data->initial_order->created_at),
            'order_status' => $purchase_data->initial_order->status,
            'order_paid_amount' => self::format_amount($chekout->charge->amount),
            'order_subtotal' => self::format_amount($chekout->subtotal_amount),
            'order_total' => self::format_amount($chekout->total_amount),
            'payment_method' => isset($chekout->payment_method->processor_type) ? $chekout->payment_method->processor_type : '',
        ];
        return $sanitizeData;
    }

    public static function purchase_details($id)
    {
        return \SureCart\Models\Purchase::with(['initial_order', 'order.checkout', 'checkout.shipping_address', 'checkout.payment_method', 'checkout.discount', 'discount.coupon', 'checkout.charge', 'product', 'product.downloads', 'download.media', 'license.activations', 'line_items', 'line_item.price', 'subscription'])->find($id);
    }

    public static function get_price($purchase_data)
    {
        if (empty($purchase_data->line_items->data[0])) {
            return;
        }

        $line_item = $purchase_data->line_items->data[0];

        return $line_item->price;
    }

    public static function format_amount($amount)
    {
        return $amount / 100;
    }
}
