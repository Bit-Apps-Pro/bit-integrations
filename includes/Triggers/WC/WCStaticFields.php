<?php

namespace BitCode\FI\Triggers\WC;

use BitCode\FI\Core\Util\Helper;

class WCStaticFields
{
    public static function getWCOrderFields($id)
    {
        $fields = array_merge(static::checkoutBasicFields(), static::getOrderACFFields(), static::getCheckoutCustomFields(), static::getFlexibleCheckoutFields());

        if (\defined('WC_VERSION') && version_compare(WC_VERSION, '8.5.1', '>=')) {
            $fields = array_merge($fields, static::checkoutUpgradeFields());
        }

        if ($id == 10) {
            $fields = array_merge($fields, static::specificOrderProductFields());
        } elseif ($id == 17) {
            $fields = array_merge([
                'specified_product_by_category' => (object) [
                    'fieldKey'  => 'specified_product_by_category',
                    'fieldName' => __('Specified Product By Category', 'bit-integrations')
                ],
            ], $fields);
        }

        return $fields;
    }

    private static function getOrderACFFields()
    {
        if (!class_exists('ACF')) {
            return [];
        }

        $fields = [];
        $acfFieldGroups = Helper::acfGetFieldGroups(['shop_order']);

        foreach ($acfFieldGroups as $group) {
            $acfFields = acf_get_fields($group['ID']);

            foreach ($acfFields as $field) {
                $fields[$field['label']] = (object) [
                    'fieldKey'  => $field['_name'],
                    'fieldName' => $field['label']
                ];
            }
        }

        return $fields;
    }

    private static function getCheckoutCustomFields()
    {
        $fields = [];
        $checkoutFields = WC()->checkout()->get_checkout_fields();

        foreach ($checkoutFields as $group) {
            foreach ($group as $field) {
                if (!empty($field['custom']) && $field['custom']) {
                    $fields[$field['name']] = (object) [
                        'fieldKey'  => $field['name'],
                        'fieldName' => $field['label']
                    ];
                }
            }
        }

        return $fields;
    }

    private static function getFlexibleCheckoutFields()
    {
        if (Helper::proActionFeatExists('WC', 'getFlexibleCheckoutFields')) {
            return apply_filters('btcbi_woocommerce_flexible_checkout_fields', []);
        }

        return [];
    }

    private static function checkoutBasicFields()
    {
        return [
            'Id' => (object) [
                'fieldKey'  => 'id',
                'fieldName' => __('Order Id', 'bit-integrations')
            ],
            'Order key' => (object) [
                'fieldKey'  => 'order_key',
                'fieldName' => __('Order Key', 'bit-integrations')
            ],
            'cart_tax' => (object) [
                'fieldKey'  => 'cart_tax',
                'fieldName' => __('Cart Tax', 'bit-integrations')
            ],
            'Currency' => (object) [
                'fieldKey'  => 'currency',
                'fieldName' => __('Currency', 'bit-integrations')
            ],
            'discount tax' => (object) [
                'fieldKey'  => 'discount_tax',
                'fieldName' => __('Discount Tax', 'bit-integrations')
            ],
            'discount_to_display' => (object) [
                'fieldKey'  => 'discount_to_display',
                'fieldName' => __('Discount To Display', 'bit-integrations')
            ],
            'discount total' => (object) [
                'fieldKey'  => 'discount_total',
                'fieldName' => __('Discount Total', 'bit-integrations')
            ],
            'shipping_tax' => (object) [
                'fieldKey'  => 'shipping_tax',
                'fieldName' => __('Shipping Tax', 'bit-integrations')
            ],
            'shipping total' => (object) [
                'fieldKey'  => 'shipping_total',
                'fieldName' => __('Shipping Total', 'bit-integrations')
            ],
            'total_tax' => (object) [
                'fieldKey'  => 'total_tax',
                'fieldName' => __('Total Tax', 'bit-integrations')
            ],
            'total' => (object) [
                'fieldKey'  => 'total',
                'fieldName' => __('Total', 'bit-integrations')
            ],
            'total_refunded' => (object) [
                'fieldKey'  => 'total_refunded',
                'fieldName' => __('Total Refunded', 'bit-integrations')
            ],
            'tax_refunded' => (object) [
                'fieldKey'  => 'tax_refunded',
                'fieldName' => __('Tax Refunded', 'bit-integrations')
            ],
            'total_shipping_refunded' => (object) [
                'fieldKey'  => 'total_shipping_refunded',
                'fieldName' => __('Total Shipping Refunded', 'bit-integrations')
            ],
            'total_qty_refunded' => (object) [
                'fieldKey'  => 'total_qty_refunded',
                'fieldName' => __('Total Qty Refunded', 'bit-integrations')
            ],
            'remaining_refund_amount' => (object) [
                'fieldKey'  => 'remaining_refund_amount',
                'fieldName' => __('remaining_refund_amount', 'bit-integrations')
            ],
            'Status' => (object) [
                'fieldKey'  => 'status',
                'fieldName' => __('Status', 'bit-integrations')
            ],
            'shipping_method' => (object) [
                'fieldKey'  => 'shipping_method',
                'fieldName' => __('shipping method', 'bit-integrations')
            ],
            'Created via' => (object) [
                'fieldKey'  => 'created_via',
                'fieldName' => __('Created Via', 'bit-integrations')
            ],
            'Date created' => (object) [
                'fieldKey'  => 'date_created',
                'fieldName' => __('Date created', 'bit-integrations')
            ],
            'date modified' => (object) [
                'fieldKey'  => 'date_modified',
                'fieldName' => __('Date Modified', 'bit-integrations')
            ],
            'date completed' => (object) [
                'fieldKey'  => 'date_completed',
                'fieldName' => __('Date completed', 'bit-integrations')
            ],
            'date paid' => (object) [
                'fieldKey'  => 'date_paid',
                'fieldName' => __('Date paid', 'bit-integrations')
            ],

            'prices_include_tax' => (object) [
                'fieldKey'  => 'prices_include_tax',
                'fieldName' => __('Prices Include Tax', 'bit-integrations')
            ],
            'customer_id' => (object) [
                'fieldKey'  => 'customer_id',
                'fieldName' => __('Customer Id', 'bit-integrations')
            ],
            'Billing First Name' => (object) [
                'fieldKey'  => 'billing_first_name',
                'fieldName' => __('Billing First Name', 'bit-integrations')
            ],
            'Billing Last Name' => (object) [
                'fieldKey'  => 'billing_last_name',
                'fieldName' => __('Billing Last Name', 'bit-integrations')
            ],
            'Billing Company' => (object) [
                'fieldKey'  => 'billing_company',
                'fieldName' => __('Billing Company', 'bit-integrations')
            ],
            'Billing Address 1' => (object) [
                'fieldKey'  => 'billing_address_1',
                'fieldName' => __('Billing Address 1', 'bit-integrations')
            ],
            'Billing Address 2' => (object) [
                'fieldKey'  => 'billing_address_2',
                'fieldName' => __('Billing Address 2', 'bit-integrations')
            ],
            'Billing City' => (object) [
                'fieldKey'  => 'billing_city',
                'fieldName' => __('Billing City', 'bit-integrations')
            ],
            'Billing Post Code' => (object) [
                'fieldKey'  => 'billing_postcode',
                'fieldName' => __('Billing Post Code', 'bit-integrations')
            ],
            'Billing Country' => (object) [
                'fieldKey'  => 'billing_country',
                'fieldName' => __('Billing Country', 'bit-integrations')
            ],
            'Billing State' => (object) [
                'fieldKey'  => 'billing_state',
                'fieldName' => __('Billing State', 'bit-integrations')
            ],
            'Billing Email' => (object) [
                'fieldKey'  => 'billing_email',
                'fieldName' => __('Billing Email', 'bit-integrations')
            ],
            'Billing Phone' => (object) [
                'fieldKey'  => 'billing_phone',
                'fieldName' => __('Billing Phone', 'bit-integrations')
            ],
            'Shipping First Name' => (object) [
                'fieldKey'  => 'shipping_first_name',
                'fieldName' => __('Shipping First Name', 'bit-integrations')
            ],
            'Shipping Last Name' => (object) [
                'fieldKey'  => 'shipping_last_name',
                'fieldName' => __('Shipping Last Name', 'bit-integrations')
            ],
            'Shipping Company' => (object) [
                'fieldKey'  => 'shipping_company',
                'fieldName' => __('Shipping Company', 'bit-integrations')
            ],
            'Shipping Address 1' => (object) [
                'fieldKey'  => 'shipping_address_1',
                'fieldName' => __('Shipping Address 1', 'bit-integrations')
            ],
            'Shipping Address 2' => (object) [
                'fieldKey'  => 'shipping_address_2',
                'fieldName' => __('Shipping Address 2', 'bit-integrations')
            ],
            'Shipping City' => (object) [
                'fieldKey'  => 'shipping_city',
                'fieldName' => __('Shipping City', 'bit-integrations')
            ],
            'Shipping Post Code' => (object) [
                'fieldKey'  => 'shipping_postcode',
                'fieldName' => __('Shipping Post Code', 'bit-integrations')
            ],
            'Shipping Country' => (object) [
                'fieldKey'  => 'shipping_country',
                'fieldName' => __('Shipping Country', 'bit-integrations')
            ],
            'Payment Method' => (object) [
                'fieldKey'  => 'payment_method',
                'fieldName' => __('Payment Method', 'bit-integrations')
            ],
            'Payment Method Title' => (object) [
                'fieldKey'  => 'payment_method_title',
                'fieldName' => __('Payment Method Title', 'bit-integrations')
            ],
            'Line Items' => (object) [
                'fieldKey'  => 'line_items',
                'fieldName' => __('Line Items', 'bit-integrations')
            ],
            'Line Items Quantity' => (object) [
                'fieldKey'  => 'line_items_quantity',
                'fieldName' => __('Line Items Quantity', 'bit-integrations')
            ],
            'Product Names' => (object) [
                'fieldKey'  => 'product_names',
                'fieldName' => __('Product Names', 'bit-integrations')
            ],
            'Order Receive URl' => (object) [
                'fieldKey'  => 'order_received_url',
                'fieldName' => __('order_received_url', 'bit-integrations')
            ],
            'Customer Note' => (object) [
                'fieldKey'  => 'customer_note',
                'fieldName' => __('Customer Note', 'bit-integrations')
            ],
        ];
    }

    private static function checkoutUpgradeFields()
    {
        return [
            'Device Type' => (object) [
                'fieldKey'  => '_wc_order_attribution_device_type',
                'fieldName' => __('Device Type', 'bit-integrations')
            ],
            'Referring source' => (object) [
                'fieldKey'  => '_wc_order_attribution_referrer',
                'fieldName' => __('Referring source', 'bit-integrations')
            ],
            'Session Count' => (object) [
                'fieldKey'  => '_wc_order_attribution_session_count',
                'fieldName' => __('Session Count', 'bit-integrations')
            ],
            'Session Entry' => (object) [
                'fieldKey'  => '_wc_order_attribution_session_entry',
                'fieldName' => __('Session Entry', 'bit-integrations')
            ],
            'Session page views' => (object) [
                'fieldKey'  => '_wc_order_attribution_session_pages',
                'fieldName' => __('Session page views', 'bit-integrations')
            ],
            'Session Start Time' => (object) [
                'fieldKey'  => '_wc_order_attribution_session_start_time',
                'fieldName' => __('Session Start Time', 'bit-integrations')
            ],
            'Source Type' => (object) [
                'fieldKey'  => '_wc_order_attribution_source_type',
                'fieldName' => __('Source Type', 'bit-integrations')
            ],
            'User Agent' => (object) [
                'fieldKey'  => '_wc_order_attribution_user_agent',
                'fieldName' => __('User Agent', 'bit-integrations')
            ],
            'Origin' => (object) [
                'fieldKey'  => '_wc_order_attribution_utm_source',
                'fieldName' => __('Origin', 'bit-integrations')
            ],
        ];
    }

    private static function specificOrderProductFields()
    {
        return [
            'product_id' => (object) [
                'fieldKey'  => 'product_id',
                'fieldName' => __('Product Id', 'bit-integrations')
            ],
            'variation_id' => (object) [
                'fieldKey'  => 'variation_id',
                'fieldName' => __('Variation Id', 'bit-integrations')
            ],
            'product_name' => (object) [
                'fieldKey'  => 'product_name',
                'fieldName' => __('Product Name', 'bit-integrations')
            ],
            'quantity' => (object) [
                'fieldKey'  => 'quantity',
                'fieldName' => __('Quantity', 'bit-integrations')
            ],
            'subtotal' => (object) [
                'fieldKey'  => 'subtotal',
                'fieldName' => __('Subtotal', 'bit-integrations')
            ],
            'total' => (object) [
                'fieldKey'  => 'total',
                'fieldName' => __('Total', 'bit-integrations')
            ],
            'subtotal_tax' => (object) [
                'fieldKey'  => 'subtotal_tax',
                'fieldName' => __('Subtotal Tax', 'bit-integrations')
            ],
            'tax_class' => (object) [
                'fieldKey'  => 'tax_class',
                'fieldName' => __('Tax Class', 'bit-integrations')
            ],
            'tax_status' => (object) [
                'fieldKey'  => 'tax_status',
                'fieldName' => __('Tax Status', 'bit-integrations')
            ],
        ];
    }
}
