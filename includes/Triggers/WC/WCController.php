<?php

namespace BitCode\FI\Triggers\WC;

use BitCode\FI\Flow\Flow;

final class WCController
{
    public static function info()
    {
        $plugin_path = 'woocommerce/woocommerce.php';
        return [
            'name' => 'Woocommerce',
            'title' => 'WooCommerce is the world’s most popular open-source eCommerce solution.',
            'slug' => $plugin_path,
            'pro' => 'woocommerce/woocommerce.php',
            'type' => 'form',
            'is_active' => is_plugin_active('woocommerce/woocommerce.php'),
            'activation_url' => wp_nonce_url(self_admin_url('plugins.php?action=activate&amp;plugin=' . $plugin_path . '&amp;plugin_status=all&amp;paged=1&amp;s'), 'activate-plugin_' . $plugin_path),
            'install_url' => wp_nonce_url(self_admin_url('update.php?action=install-plugin&plugin=' . $plugin_path), 'install-plugin_' . $plugin_path),
            'list' => [
                'action' => 'wc/get',
                'method' => 'get',
            ],
            'fields' => [
                'action' => 'wc/get/form',
                'method' => 'post',
                'data' => ['id']
            ],
        ];
    }

    public function getAll()
    {
        if (!class_exists('WooCommerce')) {
            wp_send_json_error(__('WooCommerce is not installed or activated', 'bit-integrations'));
        }
        $types = [
            'Customer-Create', 'Customer-Edit', 'Customer-Delete', 'Product-Create', 'Product-Edit', 'Product-Delete', 'Order-Create', 'Order-Edit', 'Order-Delete', 'Order-Specific-Product', 'Order-Status-Change-Specific-Status', 'User-Subscribes-Product', 'User-Cancel-Subscription-Product', 'Expired-Subscription-Product', 'Subscription-Product-Status-Change', 'Subscription-Trial-Period-End', 'Order-Specific-Category', 'Booking-Created', 'User reviews a product',
            'User purchases a variable product with selected variation'
        ];
        $wc_action = [];
        foreach ($types as $index => $type) {
            $wc_action[] = (object)[
                'id' => $index + 1,
                'title' => $type,
            ];
        }
        wp_send_json_success($wc_action);
    }

    public function get_trigger_field($data)
    {
        if (!class_exists('WooCommerce')) {
            wp_send_json_error(__('WooCommerce is not installed or activated', 'bit-integrations'));
        }
        if (empty($data->id)) {
            wp_send_json_error(__(' Doesn\'t exists', 'bit-integrations'));
        }
        $fields = self::fields($data->id);
        if (empty($fields)) {
            wp_send_json_error(__('Doesn\'t exists any field', 'bit-integrations'));
        }

        $responseData['fields'] = $fields;

        if ($data->id == 10 || $data->id == 19) {
            $responseData['products'] = WCHelper::getAllWcProducts($data->id);
        }

        if ($data->id == 11) {
            $orderStatuses = wc_get_order_statuses();
            $responseData['orderStatus'] = $orderStatuses;
        }

        if ($data->id == 12 || $data->id == 13 || $data->id == 14 || $data->id == 15 || $data->id == 16) {
            $allSubscriptions = self::getAllSubscriptions();
            $responseData['subscriptions'] = $allSubscriptions;
        }

        if ($data->id == 15) {
            $anyStatus = [
                'any_status' => 'Any Status',
            ];
            if (function_exists('wcs_get_subscription_statuses')) {
                $allSubscriptionStatus = wcs_get_subscription_statuses();
                $allSubscriptionStatus = array_merge($anyStatus, $allSubscriptionStatus);
            } else {
                $allSubscriptionStatus = $anyStatus;
            }
            $responseData['subscription_statuses'] = (array)$allSubscriptionStatus;
        }

        if ($data->id == 17) {
            $orderby = 'name';
            $order = 'asc';
            $hide_empty = false;
            $cat_args = [
                'orderby' => $orderby,
                'order' => $order,
                'hide_empty' => $hide_empty,
            ];

            $product_categories_list = get_terms('product_cat', $cat_args);
            if (empty($product_categories_list)) {
                return;
            }
            foreach ($product_categories_list as $key => $category) {
                $product_categories[] = [
                    'term_id' => (string)$category->term_id,
                    'name' => $category->name,
                ];
            }
            $responseData['allProductCategories'] = $product_categories;
        }
        if ($data->id == 20) {
            $responseData['allVariableProduct'] = WCHelper::getAllWcVariableProduct();
        }

        wp_send_json_success($responseData);
    }

    public static function fields($id)
    {
        if ($id <= 3) {
            $entity = 'customer';
        } elseif ($id <= 6) {
            $entity = 'product';
        } elseif ($id <= 11 || $id == 17 || $id == 20) {
            $entity = 'order';
        } elseif ($id <= 16) {
            $entity = 'subscription';
        } elseif ($id <= 18) {
            $entity = 'booking';
        } elseif ($id <= 19) {
            $entity = 'review';
        }

        if (empty($id)) {
            wp_send_json_error(
                __(
                    'Requested parameter is empty',
                    'bit-integrations'
                ),
                400
            );
        }
        $metabox = self::metaboxFields($entity);

        if ($entity === 'product') {
            $fields = [
                'Product Name' => (object) [
                    'fieldKey' => 'post_title',
                    'fieldName' => 'Product Name',
                    'required' => true
                ],
                'Product Description' => (object) [
                    'fieldKey' => 'post_content',
                    'fieldName' => 'Product Description'
                ],
                'Product Short Description' => (object) [
                    'fieldKey' => 'post_excerpt',
                    'fieldName' => 'Product Short Description'
                ],
                'Product ID' => (object) [
                    'fieldKey' => 'post_id',
                    'fieldName' => 'Product ID'
                ],
                'Post Date' => (object) [
                    'fieldKey' => 'post_date',
                    'fieldName' => 'Post Date'
                ],
                'Post Date GMT' => (object) [
                    'fieldKey' => 'post_date_gmt',
                    'fieldName' => 'Post Date GMT'
                ],
                'Product Status' => (object) [
                    'fieldKey' => 'post_status',
                    'fieldName' => 'Product Status'
                ],
                'Product Tag' => (object) [
                    'fieldKey' => 'tags_input',
                    'fieldName' => 'Product Tag'
                ],
                'Product Category' => (object) [
                    'fieldKey' => 'post_category',
                    'fieldName' => 'Product Category'
                ],
                'Catalog Visibility' => (object) [
                    'fieldKey' => '_visibility',
                    'fieldName' => 'Catalog Visibility'
                ],
                'Featured Product' => (object) [
                    'fieldKey' => '_featured',
                    'fieldName' => 'Featured Product'
                ],
                'Regular Price' => (object) [
                    'fieldKey' => '_regular_price',
                    'fieldName' => 'Regular Price'
                ],
                'Sale Price' => (object) [
                    'fieldKey' => '_sale_price',
                    'fieldName' => 'Sale Price'
                ],
                'Sale Price From Date' => (object) [
                    'fieldKey' => '_sale_price_dates_from',
                    'fieldName' => 'Sale Price From Date'
                ],
                'Sale Price To Date' => (object) [
                    'fieldKey' => '_sale_price_dates_to',
                    'fieldName' => 'Sale Price To Date'
                ],
                'SKU' => (object) [
                    'fieldKey' => '_sku',
                    'fieldName' => 'SKU'
                ],
                'Manage Stock' => (object) [
                    'fieldKey' => '_manage_stock',
                    'fieldName' => 'Manage Stock'
                ],
                'Stock Quantity' => (object) [
                    'fieldKey' => '_stock',
                    'fieldName' => 'Stock Quantity'
                ],
                'Allow Backorders' => (object) [
                    'fieldKey' => '_backorders',
                    'fieldName' => 'Allow Backorders'
                ],
                'Low Stock Threshold' => (object) [
                    'fieldKey' => '_low_stock_amount',
                    'fieldName' => 'Low Stock Threshold'
                ],
                'Stock Status' => (object) [
                    'fieldKey' => '_stock_status',
                    'fieldName' => 'Stock Status'
                ],
                'Sold Individually' => (object) [
                    'fieldKey' => '_sold_individually',
                    'fieldName' => 'Sold Individually'
                ],
                'Weight' => (object) [
                    'fieldKey' => '_weight',
                    'fieldName' => 'Weight'
                ],
                'Length' => (object) [
                    'fieldKey' => '_length',
                    'fieldName' => 'Length'
                ],
                'Width' => (object) [
                    'fieldKey' => '_width',
                    'fieldName' => 'Width'
                ],
                'Height' => (object) [
                    'fieldKey' => '_height',
                    'fieldName' => 'Height'
                ],
                'Purchase Note' => (object) [
                    'fieldKey' => '_purchase_note',
                    'fieldName' => 'Purchase Note'
                ],
                'Menu Order' => (object) [
                    'fieldKey' => 'menu_order',
                    'fieldName' => 'Menu Order'
                ],
                'Enable Reviews' => (object) [
                    'fieldKey' => 'comment_status',
                    'fieldName' => 'Enable Reviews'
                ],
                'Virtual' => (object) [
                    'fieldKey' => '_virtual',
                    'fieldName' => 'Virtual'
                ],
                'Downloadable' => (object) [
                    'fieldKey' => '_downloadable',
                    'fieldName' => 'Downloadable'
                ],
                'Download Limit' => (object) [
                    'fieldKey' => '_download_limit',
                    'fieldName' => 'Download Limit'
                ],
                'Download Expiry' => (object) [
                    'fieldKey' => '_download_expiry',
                    'fieldName' => 'Download Expiry'
                ],
                'Product Type' => (object) [
                    'fieldKey' => 'product_type',
                    'fieldName' => 'Product Type'
                ],
                'Product URL' => (object) [
                    'fieldKey' => '_product_url',
                    'fieldName' => 'Product URL'
                ],
            ];

            $acfFieldGroups = self::acfGetFieldGroups(['product']);
            foreach ($acfFieldGroups as $group) {
                $acfFields = acf_get_fields($group["ID"]);

                foreach ($acfFields as $field) {
                    $fields[$field['label']] = (object) [
                        'fieldKey'  => $field['_name'],
                        'fieldName' => $field['label']
                    ];
                }
            }

            $fields = array_merge($fields, $metabox['meta_fields']);

            $uploadFields = [
                'Product Image' => (object) [
                    'fieldKey' => '_product_image',
                    'fieldName' => 'Product Image'
                ],
                'Product Gallery' => (object) [
                    'fieldKey' => '_product_gallery',
                    'fieldName' => 'Product Gallery'
                ],
            ];
            $uploadFields = array_merge($uploadFields, $metabox['upload_fields']);

            $required = ['post_title'];
        } elseif ($entity === 'customer') {
            if ($id == 1) {
                $fields = [
                    'First Name' => (object) [
                        'fieldKey' => 'first_name',
                        'fieldName' => 'First Name'
                    ],
                    'Last Name' => (object) [
                        'fieldKey' => 'last_name',
                        'fieldName' => 'Last Name'
                    ],
                    'Email' => (object) [
                        'fieldKey' => 'user_email',
                        'fieldName' => 'Email',
                    ],
                    'Username' => (object) [
                        'fieldKey' => 'user_login',
                        'fieldName' => 'Username',
                    ],
                    'Password' => (object) [
                        'fieldKey' => 'user_pass',
                        'fieldName' => 'Password'
                    ],
                    'Display Name' => (object) [
                        'fieldKey' => 'display_name',
                        'fieldName' => 'Display Name'
                    ],
                    'Nickname' => (object) [
                        'fieldKey' => 'nickname',
                        'fieldName' => 'Nickname'
                    ],
                    'Website' => (object) [
                        'fieldKey' => 'user_url',
                        'fieldName' => 'Website'
                    ],
                ];
            } else {
                $fields = [
                    'Customer ID' => (object) [
                        'fieldKey' => 'customer_id',
                        'fieldName' => 'Customer ID'
                    ],
                    'First Name' => (object) [
                        'fieldKey' => 'first_name',
                        'fieldName' => 'First Name'
                    ],
                    'Last Name' => (object) [
                        'fieldKey' => 'last_name',
                        'fieldName' => 'Last Name'
                    ],
                    'Email' => (object) [
                        'fieldKey' => 'user_email',
                        'fieldName' => 'Email',
                    ],
                    'Username' => (object) [
                        'fieldKey' => 'user_login',
                        'fieldName' => 'Username',
                    ],
                    'Password' => (object) [
                        'fieldKey' => 'user_pass',
                        'fieldName' => 'Password'
                    ],
                    'Display Name' => (object) [
                        'fieldKey' => 'display_name',
                        'fieldName' => 'Display Name'
                    ],
                    'Nickname' => (object) [
                        'fieldKey' => 'nickname',
                        'fieldName' => 'Nickname'
                    ],
                    'Locale' => (object) [
                        'fieldKey' => 'locale',
                        'fieldName' => 'Locale'
                    ],
                    'Website' => (object) [
                        'fieldKey' => 'user_url',
                        'fieldName' => 'Website'
                    ],
                    'Billing First Name' => (object) [
                        'fieldKey' => 'billing_first_name',
                        'fieldName' => 'Billing First Name'
                    ],
                    'Billing Last Name' => (object) [
                        'fieldKey' => 'billing_last_name',
                        'fieldName' => 'Billing Last Name'
                    ],
                    'Billing Company' => (object) [
                        'fieldKey' => 'billing_company',
                        'fieldName' => 'Billing Company'
                    ],
                    'Billing Address 1' => (object) [
                        'fieldKey' => 'billing_address_1',
                        'fieldName' => 'Billing Address 1'
                    ],
                    'Billing Address 2' => (object) [
                        'fieldKey' => 'billing_address_2',
                        'fieldName' => 'Billing Address 2'
                    ],
                    'Billing City' => (object) [
                        'fieldKey' => 'billing_city',
                        'fieldName' => 'Billing City'
                    ],
                    'Billing Post Code' => (object) [
                        'fieldKey' => 'billing_postcode',
                        'fieldName' => 'Billing Post Code'
                    ],
                    'Billing Country' => (object) [
                        'fieldKey' => 'billing_country',
                        'fieldName' => 'Billing Country'
                    ],
                    'Billing State' => (object) [
                        'fieldKey' => 'billing_state',
                        'fieldName' => 'Billing State'
                    ],
                    'Billing Email' => (object) [
                        'fieldKey' => 'billing_email',
                        'fieldName' => 'Billing Email'
                    ],
                    'Billing Phone' => (object) [
                        'fieldKey' => 'billing_phone',
                        'fieldName' => 'Billing Phone'
                    ],
                    'Shipping First Name' => (object) [
                        'fieldKey' => 'shipping_first_name',
                        'fieldName' => 'Shipping First Name'
                    ],
                    'Shipping Last Name' => (object) [
                        'fieldKey' => 'shipping_last_name',
                        'fieldName' => 'Shipping Last Name'
                    ],
                    'Shipping Company' => (object) [
                        'fieldKey' => 'shipping_company',
                        'fieldName' => 'Shipping Company'
                    ],
                    'Shipping Address 1' => (object) [
                        'fieldKey' => 'shipping_address_1',
                        'fieldName' => 'Shipping Address 1'
                    ],
                    'Shipping Address 2' => (object) [
                        'fieldKey' => 'shipping_address_2',
                        'fieldName' => 'Shipping Address 2'
                    ],
                    'Shipping City' => (object) [
                        'fieldKey' => 'shipping_city',
                        'fieldName' => 'Shipping City'
                    ],
                    'Shipping Post Code' => (object) [
                        'fieldKey' => 'shipping_postcode',
                        'fieldName' => 'Shipping Post Code'
                    ],
                    'Shipping Country' => (object) [
                        'fieldKey' => 'shipping_country',
                        'fieldName' => 'Shipping Country'
                    ],
                    'Shipping State' => (object) [
                        'fieldKey' => 'shipping_state',
                        'fieldName' => 'Shipping State'
                    ],
                ];
            }
        } elseif ($entity === 'order') {
            $fields = [
                'Id' => (object) [
                    'fieldKey' => 'id',
                    'fieldName' => 'Order Id'
                ],
                'Order key' => (object) [
                    'fieldKey' => 'order_key',
                    'fieldName' => 'Order Key'
                ],
                'cart_tax' => (object) [
                    'fieldKey' => 'cart_tax',
                    'fieldName' => 'Cart Tax'
                ],
                'Currency' => (object) [
                    'fieldKey' => 'currency',
                    'fieldName' => 'Currency'
                ],
                'discount tax' => (object) [
                    'fieldKey' => 'discount_tax',
                    'fieldName' => 'Discount Tax'
                ],
                'discount_to_display' => (object) [
                    'fieldKey' => 'discount_to_display',
                    'fieldName' => 'Discount To Display'
                ],
                'discount total' => (object) [
                    'fieldKey' => 'discount_total',
                    'fieldName' => 'Discount Total'
                ],
                'shipping_tax' => (object) [
                    'fieldKey' => 'shipping_tax',
                    'fieldName' => 'Shipping Tax'
                ],
                'shipping total' => (object) [
                    'fieldKey' => 'shipping_total',
                    'fieldName' => 'Shipping Total'
                ],
                'total_tax' => (object) [
                    'fieldKey' => 'total_tax',
                    'fieldName' => 'Total Tax'
                ],
                'total' => (object) [
                    'fieldKey' => 'total',
                    'fieldName' => 'Total'
                ],
                'total_refunded' => (object) [
                    'fieldKey' => 'total_refunded',
                    'fieldName' => 'Total Refunded'
                ],
                'tax_refunded' => (object) [
                    'fieldKey' => 'tax_refunded',
                    'fieldName' => 'Tax Refunded'
                ],
                'total_shipping_refunded' => (object) [
                    'fieldKey' => 'total_shipping_refunded',
                    'fieldName' => 'Total Shipping Refunded'
                ],
                'total_qty_refunded' => (object) [
                    'fieldKey' => 'total_qty_refunded',
                    'fieldName' => 'Total Qty Refunded'
                ],
                'remaining_refund_amount' => (object) [
                    'fieldKey' => 'remaining_refund_amount',
                    'fieldName' => 'remaining_refund_amount'
                ],
                'Status' => (object) [
                    'fieldKey' => 'status',
                    'fieldName' => 'Status'
                ],
                'shipping_method' => (object) [
                    'fieldKey' => 'shipping_method',
                    'fieldName' => 'shipping method'
                ],
                'Created via' => (object) [
                    'fieldKey' => 'created_via',
                    'fieldName' => 'Created Via'
                ],
                'Date created' => (object) [
                    'fieldKey' => 'date_created',
                    'fieldName' => 'Date created'
                ],
                'date modified' => (object) [
                    'fieldKey' => 'date_modified',
                    'fieldName' => 'Date Modified'
                ],
                'date completed' => (object) [
                    'fieldKey' => 'date_completed',
                    'fieldName' => 'Date completed'
                ],
                'date paid' => (object) [
                    'fieldKey' => 'date_paid',
                    'fieldName' => 'Date paid'
                ],

                'prices_include_tax' => (object) [
                    'fieldKey' => 'prices_include_tax',
                    'fieldName' => 'Prices Include Tax'
                ],
                'customer_id' => (object) [
                    'fieldKey' => 'customer_id',
                    'fieldName' => 'Customer Id'
                ],
                'Billing First Name' => (object) [
                    'fieldKey' => 'billing_first_name',
                    'fieldName' => 'Billing First Name'
                ],
                'Billing Last Name' => (object) [
                    'fieldKey' => 'billing_last_name',
                    'fieldName' => 'Billing Last Name'
                ],
                'Billing Company' => (object) [
                    'fieldKey' => 'billing_company',
                    'fieldName' => 'Billing Company'
                ],
                'Billing Address 1' => (object) [
                    'fieldKey' => 'billing_address_1',
                    'fieldName' => 'Billing Address 1'
                ],
                'Billing Address 2' => (object) [
                    'fieldKey' => 'billing_address_2',
                    'fieldName' => 'Billing Address 2'
                ],
                'Billing City' => (object) [
                    'fieldKey' => 'billing_city',
                    'fieldName' => 'Billing City'
                ],
                'Billing Post Code' => (object) [
                    'fieldKey' => 'billing_postcode',
                    'fieldName' => 'Billing Post Code'
                ],
                'Billing Country' => (object) [
                    'fieldKey' => 'billing_country',
                    'fieldName' => 'Billing Country'
                ],
                'Billing State' => (object) [
                    'fieldKey' => 'billing_state',
                    'fieldName' => 'Billing State'
                ],
                'Billing Email' => (object) [
                    'fieldKey' => 'billing_email',
                    'fieldName' => 'Billing Email'
                ],
                'Billing Phone' => (object) [
                    'fieldKey' => 'billing_phone',
                    'fieldName' => 'Billing Phone'
                ],
                'Shipping First Name' => (object) [
                    'fieldKey' => 'shipping_first_name',
                    'fieldName' => 'Shipping First Name'
                ],
                'Shipping Last Name' => (object) [
                    'fieldKey' => 'shipping_last_name',
                    'fieldName' => 'Shipping Last Name'
                ],
                'Shipping Company' => (object) [
                    'fieldKey' => 'shipping_company',
                    'fieldName' => 'Shipping Company'
                ],
                'Shipping Address 1' => (object) [
                    'fieldKey' => 'shipping_address_1',
                    'fieldName' => 'Shipping Address 1'
                ],
                'Shipping Address 2' => (object) [
                    'fieldKey' => 'shipping_address_2',
                    'fieldName' => 'Shipping Address 2'
                ],
                'Shipping City' => (object) [
                    'fieldKey' => 'shipping_city',
                    'fieldName' => 'Shipping City'
                ],
                'Shipping Post Code' => (object) [
                    'fieldKey' => 'shipping_postcode',
                    'fieldName' => 'Shipping Post Code'
                ],
                'Shipping Country' => (object) [
                    'fieldKey' => 'shipping_country',
                    'fieldName' => 'Shipping Country'
                ],
                'Payment Method' => (object) [
                    'fieldKey' => 'payment_method',
                    'fieldName' => 'Payment Method'
                ],
                'Payment Method Title' => (object) [
                    'fieldKey' => 'payment_method_title',
                    'fieldName' => 'Payment Method Title'
                ],
                'Line Items' => (object) [
                    'fieldKey' => 'line_items',
                    'fieldName' => 'Line Items'
                ],
                'Order Receive URl' => (object) [
                    'fieldKey' => 'order_received_url',
                    'fieldName' => 'order_received_url'
                ],
                'Customer Note' => (object) [
                    'fieldKey' => 'customer_note',
                    'fieldName' => 'Customer Note'
                ],
            ];

            if (version_compare(WC_VERSION, '8.5.1', '>=')) {
                $fields += [
                    'Device Type' => (object) [
                        'fieldKey' => '_wc_order_attribution_device_type',
                        'fieldName' => 'Device Type'
                    ],
                    'Referring source' => (object) [
                        'fieldKey' => '_wc_order_attribution_referrer',
                        'fieldName' => 'Referring source'
                    ],
                    'Session Count' => (object) [
                        'fieldKey' => '_wc_order_attribution_session_count',
                        'fieldName' => 'Session Count'
                    ],
                    'Session Entry' => (object) [
                        'fieldKey' => '_wc_order_attribution_session_entry',
                        'fieldName' => 'Session Entry'
                    ],
                    'Session page views' => (object) [
                        'fieldKey' => '_wc_order_attribution_session_pages',
                        'fieldName' => 'Session page views'
                    ],
                    'Session Start Time' => (object) [
                        'fieldKey' => '_wc_order_attribution_session_start_time',
                        'fieldName' => 'Session Start Time'
                    ],
                    'Source Type' => (object) [
                        'fieldKey' => '_wc_order_attribution_source_type',
                        'fieldName' => 'Source Type'
                    ],
                    'User Agent' => (object) [
                        'fieldKey' => '_wc_order_attribution_user_agent',
                        'fieldName' => 'User Agent'
                    ],
                    'Origin' => (object) [
                        'fieldKey' => '_wc_order_attribution_utm_source',
                        'fieldName' => 'Origin'
                    ],
                ];
            }

            $acfFieldGroups = self::acfGetFieldGroups(['shop_order']);
            $checkoutFields = WC()->checkout()->get_checkout_fields();
            foreach ($acfFieldGroups as $group) {
                $acfFields = acf_get_fields($group["ID"]);

                foreach ($acfFields as $field) {
                    $fields[$field['label']] = (object) [
                        'fieldKey'  => $field['_name'],
                        'fieldName' => $field['label']
                    ];
                }
            }
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

            if ($id == 10) {
                $fieldProduct = [
                    'product_id' => (object) [
                        'fieldKey' => 'product_id',
                        'fieldName' => 'Product Id'
                    ],
                    'variation_id' => (object) [
                        'fieldKey' => 'variation_id',
                        'fieldName' => 'Variation Id'
                    ],
                    'product_name' => (object) [
                        'fieldKey' => 'product_name',
                        'fieldName' => 'Product Name'
                    ],
                    'quantity' => (object) [
                        'fieldKey' => 'quantity',
                        'fieldName' => 'Quantity'
                    ],
                    'subtotal' => (object) [
                        'fieldKey' => 'subtotal',
                        'fieldName' => 'Subtotal'
                    ],
                    'total' => (object) [
                        'fieldKey' => 'total',
                        'fieldName' => 'Total'
                    ],
                    'subtotal_tax' => (object) [
                        'fieldKey' => 'subtotal_tax',
                        'fieldName' => 'Subtotal Tax'
                    ],
                    'tax_class' => (object) [
                        'fieldKey' => 'tax_class',
                        'fieldName' => 'Tax Class'
                    ],
                    'tax_status' => (object) [
                        'fieldKey' => 'tax_status',
                        'fieldName' => 'Tax Status'
                    ],
                ];
                $fields = $fields + $fieldProduct;
            } elseif ($id == 17) {
                $fields = array_merge([
                    'specified_product_by_category' => (object) [
                        'fieldKey' => 'specified_product_by_category',
                        'fieldName' => 'Specified Product By Category'
                    ],
                ], $fields);
            }
        } elseif ($entity === 'subscription') {
            $fields = [
                'user_id' => (object) [
                    'fieldKey' => 'user_id',
                    'fieldName' => 'User Id'
                ],
                'product_id' => (object) [
                    'fieldKey' => 'product_id',
                    'fieldName' => 'Product Id'
                ],

                'product_title' => (object) [
                    'fieldKey' => 'product_title',
                    'fieldName' => 'Product Title'
                ],
                'product_url' => (object) [
                    'fieldKey' => 'product_url',
                    'fieldName' => 'Product Url'
                ],
                'product_featured_image_url' => (object) [
                    'fieldKey' => 'product_featured_image_url',
                    'fieldName' => 'Product Featured Image Url'
                ],
                'product_featured_image_id' => (object) [
                    'fieldKey' => 'product_featured_image_id',
                    'fieldName' => 'Product Featured Image Id'
                ],
                'product_quantity' => (object) [
                    'fieldKey' => 'product_quantity',
                    'fieldName' => 'Product Quantity'
                ],
                'order_total' => (object) [
                    'fieldKey' => 'order_total',
                    'fieldName' => 'Order Total'
                ],
                'subscription_id' => (object) [
                    'fieldKey' => 'subscription_id',
                    'fieldName' => 'Subscription Id'
                ],
                'subscription_status' => (object) [
                    'fieldKey' => 'subscription_status',
                    'fieldName' => 'Subscription Status'
                ],
                'subscription_trial_end_date' => (object) [
                    'fieldKey' => 'subscription_trial_end_date',
                    'fieldName' => 'Subscription Trial End Date'
                ],
                'subscription_end_date' => (object) [
                    'fieldKey' => 'subscription_end_date',
                    'fieldName' => 'Subscription End Date'
                ],
                'subscription_next_payment_date' => (object) [
                    'fieldKey' => 'subscription_next_payment_date',
                    'fieldName' => 'Subscription Next Payment Date'
                ],
            ];
        } elseif ($entity === 'booking') {
            $fields = [
                'Product Id' => (object) [
                    'fieldKey' => 'product_id',
                    'fieldName' => 'Product Id'
                ],
                'Product Name' => (object) [
                    'fieldKey' => 'product_name',
                    'fieldName' => 'Product Name'
                ],
                'Product Slug' => (object) [
                    'fieldKey' => 'product_slug',
                    'fieldName' => 'Product Slug'
                ],
                'Product Type' => (object) [
                    'fieldKey' => 'product_type',
                    'fieldName' => 'Product Type'
                ],
                'Product status' => (object) [
                    'fieldKey' => 'product_status',
                    'fieldName' => 'Product status'
                ],
                'Product Featured' => (object) [
                    'fieldKey' => 'product_featured',
                    'fieldName' => 'Product Featured'
                ],
                'Product Description' => (object) [
                    'fieldKey' => 'product_description',
                    'fieldName' => 'Product Description'
                ],
                'Product Short Description' => (object) [
                    'fieldKey' => 'product_short_description',
                    'fieldName' => 'Product Short Description'
                ],
                'Product Price' => (object) [
                    'fieldKey' => 'product_price',
                    'fieldName' => 'Product Price'
                ],
                'Product Regular Price' => (object) [
                    'fieldKey' => 'product_regular_price',
                    'fieldName' => 'Product Regular Price'
                ],
                'Product Sale Price' => (object) [
                    'fieldKey' => 'product_sale_price',
                    'fieldName' => 'Product Sale Price'
                ],
                'total Sales' => (object) [
                    'fieldKey' => 'total_sales',
                    'fieldName' => 'Total Sales'
                ],
                'Product Quantity' => (object) [
                    'fieldKey' => 'product_quantity',
                    'fieldName' => 'Product quantity'
                ],
                'Product SKU' => (object) [
                    'fieldKey' => 'product_sku',
                    'fieldName' => 'Product SKU'
                ],

                'Product Categories Ids' => (object) [
                    'fieldKey' => 'product_categories_ids',
                    'fieldName' => 'Product Categories Ids'
                ],
                'Stock Status' => (object) [
                    'fieldKey' => 'stock_status',
                    'fieldName' => 'Stock Status'
                ],
                'Product Tags' => (object) [
                    'fieldKey' => 'product_tags',
                    'fieldName' => 'Product Tags'
                ],
                'Image Url' => (object) [
                    'fieldKey' => 'image_url',
                    'fieldName' => 'Image Url'
                ],
                'Cost' => (object) [
                    'fieldKey' => 'cost',
                    'fieldName' => 'Cost'
                ],
                'Display Cost' => (object) [
                    'fieldKey' => 'display_cost',
                    'fieldName' => 'Display Cost'
                ],
                'Qty' => (object) [
                    'fieldKey' => 'qty',
                    'fieldName' => 'Qty'
                ],
                'Customer Id' => (object) [
                    'fieldKey' => 'customer_id',
                    'fieldName' => 'Customer Id'
                ],
                'Customer First Name' => (object) [
                    'fieldKey' => 'customer_first_name',
                    'fieldName' => 'Customer First Name'
                ],
                'Customer Last Name' => (object) [
                    'fieldKey' => 'customer_last_name',
                    'fieldName' => 'Customer Last Name'
                ],
                'Customer Email' => (object) [
                    'fieldKey' => 'customer_email',
                    'fieldName' => 'Customer Email'
                ],
                'Customer Nickname' => (object) [
                    'fieldKey' => 'customer_nickname',
                    'fieldName' => 'Customer Nickname'
                ],
            ];
        } elseif ($entity == 'review') {
            $fields = WCHelper::getReviewFields();
        }
        uksort($fields, 'strnatcasecmp');

        $fieldsNew = [];
        if (isset($uploadFields) && $uploadFields != null) {
            uksort($uploadFields, 'strnatcasecmp');
            foreach ($uploadFields as $field) {
                $fieldsNew[] = [
                    'name' => $field->fieldKey,
                    'type' => 'file',
                    'label' => $field->fieldName,
                ];
            }
        }
        $fields = array_merge($fields, $metabox['meta_fields']);
        foreach ($fields as $field) {
            if ($field->fieldKey === 'user_email' || $field->fieldKey === 'shipping_email' || $field->fieldKey === 'billing_email') {
                $fieldsNew[] = [
                    'name' => $field->fieldKey,
                    'type' => 'email',
                    'label' => $field->fieldName,
                ];
            } else {
                $fieldsNew[] = [
                    'name' => $field->fieldKey,
                    'type' => 'text',
                    'label' => $field->fieldName,
                ];
            }
        }
        return $fieldsNew;
    }

    public static function metaboxFields($module)
    {
        $fileTypes = [
            'image',
            'image_upload',
            'file_advanced',
            'file_upload',
            'single_image',
            'file',
            'image_advanced',
            'video'
        ];

        $metaboxFields = [];
        $metaboxUploadFields = [];

        if (function_exists('rwmb_meta')) {
            if ($module === 'customer') {
                $field_registry = rwmb_get_registry('field');
                $meta_boxes = $field_registry->get_by_object_type($object_type = 'user');
                $metaFields = isset($meta_boxes['user']) && is_array($meta_boxes['user']) ? array_values($meta_boxes['user']) : [];
            } else {
                $metaFields = array_values(rwmb_get_object_fields($module));
            }
            foreach ($metaFields as $index => $field) {
                if (!in_array($field['type'], $fileTypes)) {
                    $metaboxFields[$index] = (object) [
                        'fieldKey' => $field['id'],
                        'fieldName' => 'Metabox Field - ' . $field['name'],
                        'required' => $field['required'],
                    ];
                } else {
                    $metaboxUploadFields[$index] = (object) [
                        'fieldKey' => $field['id'],
                        'fieldName' => 'Metabox Field - ' . $field['name'],
                        'required' => $field['required'],
                    ];
                }
            }
        }

        return ['meta_fields' => $metaboxFields, 'upload_fields' => $metaboxUploadFields];
    }

    public static function formatUserMetaData($metadata)
    {
        $arr = [];
        foreach ($metadata as $key => $value) {
            $arr[$key] = $value[0];
        }
        return $arr;
    }

    public static function handle_customer_create($customer_id, $importType)
    {
        if (isset($importType['role']) && $importType['role'] !== 'customer') {
            return false;
        }
        $customer_data = (array) get_userdata($customer_id)->data;
        $customer_metadata = self::formatUserMetaData(get_user_meta($customer_id));
        $customer_values = array_merge_recursive($customer_data, $customer_metadata);

        if (!empty($customer_id) && $flows = Flow::exists('WC', 1)) {
            Flow::execute('WC', 1, $customer_values, $flows);
        }
    }

    public static function handle_customer_update($customer_id, $oldData, $newData)
    {
        if (isset($importType['role']) && $newData['role'] !== 'customer') {
            return false;
        }
        $customer_data = (array) $newData;
        $customer_metadata = self::formatUserMetaData(get_user_meta($customer_id));
        $newMeta = $customer_metadata;
        foreach ($customer_metadata as $key => $val) {
            if (array_key_exists($key, $customer_data)) {
                unset($newMeta[$key]);
            }
        };
        $customer_values = array_merge_recursive($customer_data, $newMeta);

        if (!empty($customer_id) && $flows = Flow::exists('WC', 2)) {
            Flow::execute('WC', 2, $customer_values, $flows);
        }
    }

    public static function handle_customer_delete($customer_id)
    {
        $user_meta = get_userdata($customer_id);
        $user_roles = $user_meta->roles;
        if (isset($importType['role']) && in_array('customer', $user_roles)) {
            return false;
        }
        $customer_data = ['customer_id' => $customer_id];
        if (!empty($customer_id) && $flows = Flow::exists('WC', 3)) {
            Flow::execute('WC', 3, $customer_data, $flows);
        }
    }

    public static function handle_product_action($new_status, $old_status, $post)
    {
        if (!class_exists('WooCommerce')) {
            return false;
        }
        if ($old_status === 'new') {
            return false;
        }
        $post_id = $post->ID;
        $productData = wc_get_product($post_id);

        if ($productData == false) {
            return false;
        }
        $type = $productData->post_type;
        if ($type != 'product') {
            return false;
        }
        if (($old_status === 'auto-draft' || $old_status === 'draft') && $new_status === 'publish') {
            add_action('save_post', [WCController::class, 'product_create'], 10, 1);
        } elseif ($old_status != 'auto-draft' && $old_status != 'draft' && $new_status === 'publish') {
            add_action('save_post', [WCController::class, 'product_update'], 10, 1);
        } elseif ($old_status === 'publish' && $new_status === 'trash') {
            $data = ['post_id' => $post_id];
            if (!empty($post_id) && $flows = Flow::exists('WC', 6)) {
                Flow::execute('WC', 6, $data, $flows);
            }
        } else {
            return false;
        }
    }

    public static function product_create($post_id)
    {
        $productData    = wc_get_product($post_id);
        $data           = self::accessProductData($productData);
        $acfFieldGroups = self::acfGetFieldGroups(['product']);

        foreach ($acfFieldGroups as $group) {
            $acfFields = acf_get_fields($group["ID"]);

            foreach ($acfFields as $field) {
                $data[$field['_name']] = get_post_meta($post_id, $field['_name'])[0];
            }
        }
        if (!empty($post_id) && $flows = Flow::exists('WC', 4)) {
            Flow::execute('WC', 4, $data, $flows);
        }
    }

    private static function acfGetFieldGroups($type = [])
    {
        if (class_exists('ACF')) {
            return array_filter(acf_get_field_groups(), function ($group) use ($type) {
                return $group["active"] && isset($group["location"][0][0]["value"]) && is_array($type) && in_array($group["location"][0][0]["value"], $type);
            });
        } else {
            return [];
        }
    }

    public static function product_update($post_id)
    {
        $productData    = wc_get_product($post_id);
        $data           = self::accessProductData($productData);
        $acfFieldGroups = self::acfGetFieldGroups(['product']);

        foreach ($acfFieldGroups as $group) {
            $acfFields = acf_get_fields($group["ID"]);

            foreach ($acfFields as $field) {
                $data[$field['_name']] = get_post_meta($post_id, $field['_name'])[0];
            }
        }
        if (!empty($post_id) && $flows = Flow::exists('WC', 5)) {
            Flow::execute('WC', 5, $data, $flows);
        }
    }

    public static function accessProductData($product)
    {
        if (!$product instanceof \WC_Product_Simple) {
            return [];
        }
        $image_id = $product->get_image_id();
        $image_url = wp_get_attachment_image_url($image_id, 'full');

        $productIds = $product->get_gallery_image_ids();
        $gallery_images = [];
        if (count($productIds)) {
            foreach ($productIds as $id) {
                $gallery_images[] = wp_get_attachment_image_url($id, 'full');
            }
        }

        $data = [
            'post_id' => $product->get_id(),
            'post_title' => $product->get_name(),
            'post_content' => $product->get_description(),
            'post_excerpt' => $product->get_short_description(),
            'post_date' => $product->get_date_created(),
            'post_date_gmt' => $product->get_date_modified(),
            'post_status' => $product->get_status(),
            'tags_input' => $product->get_tag_ids(),
            'post_category' => wc_get_product_category_list($product->get_id()),
            '_visibility' => $product->get_catalog_visibility(),
            '_featured' => $product->get_featured(),
            '_regular_price' => $product->get_regular_price(),
            '_sale_price' => $product->get_sale_price(),
            '_sale_price_dates_from' => $product->get_date_on_sale_from(),
            '_sale_price_dates_to' => $product->get_date_on_sale_to(),
            '_sku' => $product->get_sku(),
            '_manage_stock' => $product->get_manage_stock(),
            '_stock' => $product->get_stock_quantity(),
            '_backorders' => $product->get_backorders(),
            '_low_stock_amount' => 1,
            '_stock_status' => $product->get_stock_status(),
            '_sold_individually' => $product->get_sold_individually(),
            '_weight' => $product->get_weight(),
            '_length' => $product->get_length(),
            '_width' => $product->get_width(),
            '_height' => $product->get_height(),
            '_purchase_note' => $product->get_purchase_note(),
            'menu_order' => $product->get_menu_order(),
            'comment_status' => $product->get_reviews_allowed(),
            '_virtual' => $product->get_virtual(),
            '_downloadable' => $product->get_downloadable(),
            '_download_limit' => $product->get_download_limit(),
            '_download_expiry' => $product->get_download_expiry(),
            'product_type' => $product->get_type(),
            '_product_url' => get_permalink($product->get_id()),
            '_tax_status' => $product->get_tax_status(),
            '_tax_class' => $product->get_tax_class(),
            '_product_image' => $image_url,
            '_product_gallery' => $gallery_images,
        ];
        return $data;
    }

    public static function accessOrderData($order)
    {
        // var_dump(get_class($order), 'class');
        // Automattic\WooCommerce\Admin\Overrides\Order
        // if (!$order instanceof WC_Product_Factory) {
        //     return [];
        // }
        $data = [
            'id' => $order->get_id(),
            'order_key' => $order->get_order_key(),
            'card_tax' => $order->get_cart_tax(),
            'currency' => $order->get_currency(),
            'discount_tax' => $order->get_discount_tax(),
            'discount_to_display' => $order->get_discount_to_display(),
            'discount_total' => $order->get_discount_total(),
            'fees' => $order->get_fees(),
            'shipping_tax' => $order->get_shipping_tax(),
            'shipping_total' => $order->get_shipping_total(),
            'tax_totals' => $order->get_tax_totals(),
            'total' => $order->get_total(),
            'total_refunded' => $order->get_total_refunded(),
            'total_tax_refunded' => $order->get_total_tax_refunded(),
            'total_shipping_refunded' => $order->get_total_shipping_refunded(),
            'total_qty_refunded' => $order->get_total_qty_refunded(),
            'remaining_refund_amount' => $order->get_remaining_refund_amount(),
            'shipping_method' => $order->get_shipping_method(),
            'date_created' => is_null($order->get_date_created()) ? $order->get_date_created() : $order->get_date_created()->format('Y-m-d H:i:s'),
            'date_modified' => is_null($order->get_date_modified()) ? $order->get_date_modified() : $order->get_date_modified()->format('Y-m-d H:i:s'),
            'date_completed' => is_null($order->get_date_completed()) ? $order->get_date_completed() : $order->get_date_completed()->format('Y-m-d H:i:s'),
            'date_paid' => is_null($order->get_date_paid()) ? $order->get_date_paid() : $order->get_date_paid()->format('Y-m-d H:i:s'),
            'customer_id' => $order->get_customer_id(),
            'created_via' => $order->get_created_via(),
            'customer_note' => $order->get_customer_note(),
            'billing_first_name' => $order->get_billing_first_name(),
            'billing_last_name' => $order->get_billing_last_name(),
            'billing_company' => $order->get_billing_company(),
            'billing_address_1' => $order->get_billing_address_1(),
            'billing_address_2' => $order->get_billing_address_2(),
            'billing_city' => $order->get_billing_city(),
            'billing_state' => $order->get_billing_state(),
            'billing_postcode' => $order->get_billing_postcode(),
            'billing_country' => $order->get_billing_country(),
            'billing_email' => $order->get_billing_email(),
            'billing_phone' => $order->get_billing_phone(),
            'shipping_first_name' => $order->get_shipping_first_name(),
            'shipping_last_name' => $order->get_shipping_last_name(),
            'shipping_company' => $order->get_shipping_company(),
            'shipping_address_1' => $order->get_shipping_address_1(),
            'shipping_address_2' => $order->get_shipping_address_2(),
            'shipping_city' => $order->get_shipping_city(),
            'shipping_state' => $order->get_shipping_state(),
            'shipping_postcode' => $order->get_shipping_postcode(),
            'shipping_country' => $order->get_shipping_country(),
            'payment_method' => $order->get_payment_method(),
            'payment_method_title' => $order->get_payment_method_title(),
            'status' => $order->get_status(),
            'checkout_order_received_url' => $order->get_checkout_order_received_url(),
            'customer_note' => $order->get_customer_note()
        ];
        if (version_compare(WC_VERSION, '8.5.1', '>=')) {
            $data += [
                '_wc_order_attribution_referrer'            => $order->get_meta('_wc_order_attribution_referrer'),
                '_wc_order_attribution_user_agent'          => $order->get_meta('_wc_order_attribution_user_agent'),
                '_wc_order_attribution_utm_source'          => $order->get_meta('_wc_order_attribution_utm_source'),
                '_wc_order_attribution_device_type'         => $order->get_meta('_wc_order_attribution_device_type'),
                '_wc_order_attribution_source_type'         => $order->get_meta('_wc_order_attribution_source_type'),
                '_wc_order_attribution_session_count'       => $order->get_meta('_wc_order_attribution_session_count'),
                '_wc_order_attribution_session_entry'       => $order->get_meta('_wc_order_attribution_session_entry'),
                '_wc_order_attribution_session_pages'       => $order->get_meta('_wc_order_attribution_session_pages'),
                '_wc_order_attribution_session_start_time'  => $order->get_meta('_wc_order_attribution_session_start_time'),
            ];
        }

        $line_items = [];
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
            $product_unit_price = $product->get_price();
            $label = 'line_items_';
            $productSku = $product->get_sku();
            $count++;
            $itemData = [
                'product_id' => $product_id,
                'variation_id' => $variation_id,
                'product_name' => $product_name,
                'quantity' => $quantity,
                'subtotal' => $subtotal,
                'total' => $total,
                'subtotal_tax' => $subtotal_tax,
                'tax_class' => $taxclass,
                'tax_status' => $taxstat,
                'product_sku' => $productSku,
                'product_unit_price' => $product_unit_price,
            ];
            $acfFieldGroups = self::acfGetFieldGroups(['product']);

            foreach ($acfFieldGroups as $group) {
                $acfFields = acf_get_fields($group["ID"]);

                foreach ($acfFields as $field) {
                    $itemData[$field['_name']] = get_post_meta($product_id, $field['_name'])[0];
                }
            }

            $line_items_all['line_items'][] = (object) $itemData;
        }
        $data += $line_items_all;
        return $data;
    }

    public static function handle_order_create($order_id, $fields)
    {
        if (!is_plugin_active('woocommerce/woocommerce.php')) {
            return false;
        }

        $order = wc_get_order($order_id);
        $data = self::accessOrderData($order);
        $triggerd = [8, 9, 11, 12, 13, 14, 15, 16];
        $acfFieldGroups = self::acfGetFieldGroups(['shop_order']);
        $checkoutFields = WC()->checkout()->get_checkout_fields();

        foreach ($acfFieldGroups as $group) {
            $acfFields = acf_get_fields($group["ID"]);

            foreach ($acfFields as $field) {
                $meta                   = get_post_meta($order_id, $field['_name']);
                $data[$field['_name']]  = is_array($meta) && !empty($meta) ? $meta[0] : $meta;
            }
        }
        foreach ($checkoutFields as $group) {
            foreach ($group as $field) {
                if (!empty($field['custom']) && $field['custom']) {
                    $data[$field['name']] = $fields[$field['name']];
                }
            }
        }

        for ($i = 7; $i <= 17; $i++) {
            if (in_array($i, $triggerd)) {
                continue;
            }
            if ($i == 7) {
                $flows = Flow::exists('WC', 7);
                if (!empty($order_id) && $flows = Flow::exists('WC', 7)) {
                    $orderedProducts = $data['line_items'];
                    $differId = 1;
                    foreach ($orderedProducts as $orderedProduct) {
                        foreach ((array)$orderedProduct as $keys => $value) {
                            $newItem["{$differId}_{$keys}"] = $value;
                        }
                        $differId = $differId + 1;
                        $data = array_merge($data, (array)$newItem);
                    }
                    Flow::execute('WC', 7, $data, $flows);
                }
            } elseif ($i == 10) {
                if (!empty($order_id) && $flows = Flow::exists('WC', 10)) {
                    $flows = Flow::exists('WC', 10);
                    foreach ($flows as $flow) {
                        $flowsDetailData = $flow->flow_details;
                        $flowsDetail = json_decode($flowsDetailData);
                        $selectedProductId = $flowsDetail->selectedProduct;
                        $orderedProducts = $data['line_items'];
                        $triggerData = $data;

                        foreach ($orderedProducts as $orderedProduct) {
                            if ((int)$selectedProductId == $orderedProduct->product_id) {
                                $triggerData['line_items'] = [$orderedProduct];
                                $triggerData = $triggerData + (array)$orderedProduct;
                                $flowData = [0 => $flow];
                                Flow::execute('WC', 10, $triggerData, $flowData);
                                break;
                            }
                        }
                    }
                }
            } elseif ($i == 17) {
                if (!empty($order_id) && $flows = Flow::exists('WC', 17)) {
                    $flows = Flow::exists('WC', 17);

                    $flowsDetailData = $flows[0]->flow_details;
                    $flowsDetail = json_decode($flowsDetailData);
                    $selectedProductCategory = $flowsDetail->selectedProductCategory;
                    $orderedProducts = $data['line_items'];
                    $filteredByCategory = [];
                    foreach ($orderedProducts as $orderedProduct) {
                        $productCategory = wc_get_product($orderedProduct->product_id);
                        $productInfo = $productCategory->get_category_ids();
                        if (in_array((int)$selectedProductCategory, $productInfo)) {
                            array_push($filteredByCategory, $orderedProduct);
                        }
                    }
                    $data['specified_product_by_category'] = $filteredByCategory;
                    Flow::execute('WC', 17, $data, $flows);
                }
            }
        }
    }

    public static function handle_order_update($order_id, $post, $update)
    {
        if (!class_exists('WooCommerce')) {
            return false;
        }

        $order = wc_get_order($order_id);

        if ($order == false) {
            return false;
        }
        $type = $order->get_type();
        if ($type != 'order' && $type != 'shop_order') {
            return false; // not an order
        }

        if (is_null($order->get_date_created())) {
            return false;
        }
        $post_status = get_post_status($order_id);
        $post_type = get_post_type($order_id);
        if ($post_status === 'trash' || $post_type !== 'shop_order' || !$update) {
            return false;
        }
        $created = $order->get_date_created()->format('Y-m-d H:i:s');
        $modified = $order->get_date_modified()->format('Y-m-d H:i:s');
        $timeFirst = strtotime($created);
        $timeSecond = strtotime($modified);
        $differenceInSeconds = $timeSecond - $timeFirst;
        if ($differenceInSeconds < 15) {
            return false;
        }

        $data = self::accessOrderData($order);
        $acfFieldGroups = self::acfGetFieldGroups(['product', 'shop_order']);

        foreach ($acfFieldGroups as $group) {
            $acfFields = acf_get_fields($group["ID"]);

            foreach ($acfFields as $field) {
                $data[$field['_name']] = get_post_meta($order_id, $field['_name'])[0];
            }
        }
        if (!empty($order_id) && $flows = Flow::exists('WC', 8)) {
            Flow::execute('WC', 8, $data, $flows);
        }
    }

    public static function handle_order_delete($order_id)
    {
        $post_type = get_post_type($order_id);
        if ($post_type !== 'shop_order') {
            return false;
        }
        $data = ['id' => $order_id];
        if (!empty($order_id) && $flows = Flow::exists('WC', 9)) {
            Flow::execute('WC', 9, $data, $flows);
        }
    }

    public static function handle_order_status_change($order_id, $from_status, $to_status, $this_order)
    {
        if (!class_exists('WooCommerce')) {
            return false;
        }

        $flows = Flow::exists('WC', 11);

        if (empty($flows)) {
            return false;
        }

        foreach ($flows as $flow) {
            $flowsDetailData = $flow->flow_details;
            $flowsDetail = json_decode($flowsDetailData);
            $selectedOrderStatus = $flowsDetail->selectedOrderStatus;

            if ($selectedOrderStatus === 'wc-on-hold') {
                $spilited = explode('-', $selectedOrderStatus);
                $selectedStatus = "$spilited[1]-$spilited[2]";
            } else {
                // $selectedStatus = explode('-', $selectedOrderStatus)[1];
                $selectedStatus = str_replace('wc-', '', $selectedOrderStatus);
            }

            // ltrim($selectedOrderStatus, 'wc-')
            if ($to_status === $selectedStatus) {
                $order = wc_get_order($order_id);

                if ($order == false) {
                    return false;
                }
                $type = $order->get_type();
                if ($type != 'order' && $type != 'shop_order') {
                    return false; // not an order
                }

                $post_status = get_post_status($order_id);
                $post_type = get_post_type($order_id);
                if ($post_status === 'trash' || $post_type !== 'shop_order') {
                    return false;
                }

                $data = self::accessOrderData($order);
                $acfFieldGroups = self::acfGetFieldGroups(['product', 'shop_order']);

                foreach ($acfFieldGroups as $group) {
                    $acfFields = acf_get_fields($group["ID"]);

                    foreach ($acfFields as $field) {
                        $data[$field['_name']] = get_post_meta($order_id, $field['_name'])[0];
                    }
                }
                if (!empty($order_id)) {
                    Flow::execute('WC', 11, $data, [$flow]);
                }
            }
        }
    }

    public static function getAllSubscriptions()
    {
        global $wpdb;

        $allSubscriptions = $wpdb->get_results(
            $wpdb->prepare(
                "
                    SELECT posts.ID, posts.post_title FROM $wpdb->posts as posts
                    LEFT JOIN $wpdb->term_relationships as rel ON (posts.ID = rel.object_id)
                    WHERE rel.term_taxonomy_id IN (SELECT term_id FROM $wpdb->terms WHERE slug IN ('subscription','variable-subscription'))
                    AND posts.post_type = 'product'
                    AND posts.post_status = 'publish'
                    UNION ALL
                    SELECT ID, post_title FROM $wpdb->posts
                    WHERE post_type = 'shop_subscription'
                    AND post_status = 'publish'
                    ORDER BY post_title
                "
            )
        );

        $subscriptions[] = [
            'id' => 'any',
            'post_title' => 'Any product',
        ];

        foreach ($allSubscriptions as $key => $val) {
            $subscriptions[] = [
                'id' => $val->ID,
                'post_title' => $val->post_title,
            ];
        }

        return $subscriptions;
    }

    public static function handle_subscription_create($subscription)
    {
        $flows = Flow::exists('WC', 12);

        if (empty($flows)) {
            return false;
        }

        $flowsDetailData = $flows[0]->flow_details;
        $flowsDetail = json_decode($flowsDetailData);
        $selectedSubscription = $flowsDetail->selectedSubscription;

        $items = $subscription->get_items();

        if (!is_array($items)) {
            return;
        }

        $user_id = $subscription->get_user_id();

        foreach ($items as $item) {
            $product_id = $item->get_product_id();
            $quantity = $item->get_quantity();

            if ($product_id === 0) {
                continue;
            }
            $data = self::accessSubscription($subscription, $quantity);

            if ($selectedSubscription === 'any') {
                if (!empty($user_id) && $flows = Flow::exists('WC', 12)) {
                    Flow::execute('WC', 12, $data, $flows);
                }
            }
            if ($product_id === (int)$selectedSubscription) {
                if (!empty($user_id) && $flows = Flow::exists('WC', 12)) {
                    Flow::execute('WC', 12, $data, $flows);
                }
            }
        }
    }

    public static function handle_subscription_cancel($subscription)
    {
        $flows = Flow::exists('WC', 13);
        $flowsDetailData = $flows[0]->flow_details;
        $flowsDetail = json_decode($flowsDetailData);
        $selectedSubscription = $flowsDetail->selectedSubscription;

        $items = $subscription->get_items();

        if (!is_array($items)) {
            return;
        }

        $user_id = $subscription->get_user_id();

        foreach ($items as $item) {
            $product_id = $item->get_product_id();
            $quantity = $item->get_quantity();

            if ($product_id === 0) {
                continue;
            }
            $data = self::accessSubscription($subscription, $quantity);

            if ($selectedSubscription === 'any') {
                if (!empty($user_id) && $flows = Flow::exists('WC', 13)) {
                    Flow::execute('WC', 13, $data, $flows);
                }
            }
            if ($product_id === (int)$selectedSubscription) {
                if (!empty($user_id) && $flows = Flow::exists('WC', 13)) {
                    Flow::execute('WC', 13, $data, $flows);
                }
            }
        }
    }

    public static function handle_subscription_expired($subscription)
    {
        $flows = Flow::exists('WC', 14);
        $flowsDetailData = $flows[0]->flow_details;
        $flowsDetail = json_decode($flowsDetailData);
        $selectedSubscription = $flowsDetail->selectedSubscription;

        $items = $subscription->get_items();

        if (!is_array($items)) {
            return;
        }

        $user_id = $subscription->get_user_id();

        foreach ($items as $item) {
            $product_id = $item->get_product_id();
            $quantity = $item->get_quantity();

            if ($product_id === 0) {
                continue;
            }
            $data = self::accessSubscription($subscription, $quantity);

            if ($selectedSubscription === 'any') {
                if (!empty($user_id) && $flows = Flow::exists('WC', 14)) {
                    Flow::execute('WC', 14, $data, $flows);
                }
            }
            if ($product_id === (int)$selectedSubscription) {
                if (!empty($user_id) && $flows = Flow::exists('WC', 14)) {
                    Flow::execute('WC', 14, $data, $flows);
                }
            }
        }
    }

    public static function handle_subscription_status_change($subscription, $new_status, $old_status)
    {
        $flows = Flow::exists('WC', 15);
        $flowsDetailData = $flows[0]->flow_details;
        $flowsDetail = json_decode($flowsDetailData);
        $selectedSubscription = $flowsDetail->selectedSubscription;
        $selectedSubscriptionStatus = $flowsDetail->selectedSubscriptionStatus;

        $items = $subscription->get_items();

        if (!is_array($items)) {
            return;
        }

        $user_id = $subscription->get_user_id();

        foreach ($items as $item) {
            $product_id = $item->get_product_id();
            $quantity = $item->get_quantity();

            if ($product_id === 0) {
                continue;
            }
            $data = self::accessSubscription($subscription, $quantity);

            if ($selectedSubscription === 'any') {
                if ($selectedSubscriptionStatus === 'any_status') {
                    if (!empty($user_id) && $flows = Flow::exists('WC', 15)) {
                        Flow::execute('WC', 15, $data, $flows);
                    }
                }
                // ltrim($selectedSubscriptionStatus, 'wc-')
                if ($new_status === explode('-', $selectedSubscriptionStatus)[1]) {
                    if (!empty($user_id) && $flows = Flow::exists('WC', 15)) {
                        Flow::execute('WC', 15, $data, $flows);
                    }
                }
            }
            if ($product_id === (int)$selectedSubscription) {
                if ($selectedSubscriptionStatus === 'any_status') {
                    if (!empty($user_id) && $flows = Flow::exists('WC', 15)) {
                        Flow::execute('WC', 15, $data, $flows);
                    }
                }
                if ($new_status === explode('-', $selectedSubscriptionStatus)[1]) {
                    if (!empty($user_id) && $flows = Flow::exists('WC', 15)) {
                        Flow::execute('WC', 15, $data, $flows);
                    }
                }
            }
        }
    }

    public static function handle_subscription_trial_period_end($subscription_id)
    {
        if (!function_exists('wcs_get_subscription')) {
            return;
        }
        $subscription = wcs_get_subscription($subscription_id);
        $flows = Flow::exists('WC', 16);
        $flowsDetailData = $flows[0]->flow_details;
        $flowsDetail = json_decode($flowsDetailData);
        $selectedSubscription = $flowsDetail->selectedSubscription;

        $items = $subscription->get_items();

        if (!is_array($items)) {
            return;
        }

        $user_id = $subscription->get_user_id();

        foreach ($items as $item) {
            $product_id = $item->get_product_id();
            $quantity = $item->get_quantity();

            if ($product_id === 0) {
                continue;
            }
            $data = self::accessSubscription($subscription, $quantity);

            if ($selectedSubscription === 'any') {
                if (!empty($user_id) && $flows = Flow::exists('WC', 16)) {
                    Flow::execute('WC', 16, $data, $flows);
                }
            }
            if ($product_id === (int)$selectedSubscription) {
                if (!empty($user_id) && $flows = Flow::exists('WC', 16)) {
                    Flow::execute('WC', 16, $data, $flows);
                }
            }
        }
    }

    public static function handle_booking_create($booking_id)
    {
        if (!is_plugin_active('woocommerce-bookings/woocommerce-bookings.php')) {
            return false;
        }
        $booking = new \WC_Booking($booking_id);
        $product_id = $booking->get_product_id();
        $customer_id = $booking->get_customer_id();
        $userData = self::getUserInfo($customer_id);
        $productInfo = wc_get_product($product_id);

        $helper = new WCHelper();
        $productData = $helper->accessBookingProductData($productInfo);
        $finalData = $helper->process_booking_data($productData, $userData, $customer_id);

        if (!empty($customer_id) && $flows = Flow::exists('WC', 18)) {
            Flow::execute('WC', 18, $finalData, $flows);
        }
    }

    public static function handle_insert_comment($comment_id, $comment_approved, $commentdata)
    {
        $flows = Flow::exists('WC', 19);
        if (!$flows) {
            return;
        }
        if ('review' !== (string) $commentdata['comment_type']) {
            return;
        }

        $comment = get_comment($comment_id, OBJECT);

        if (isset($comment->user_id) && 0 === absint($comment->user_id)) {
            return;
        }

        $finalData = [
            'product_id' => $comment->comment_post_ID,
            'product_title' => get_the_title($comment->comment_post_ID),
            'product_url' => get_permalink($comment->comment_post_ID),
            'product_price' => get_post_meta($comment->comment_post_ID, '_price', true),
            'product_review' => $comment->comment_content,
            'product_sku' => get_post_meta($comment->comment_post_ID, '_sku', true),
            'product_tags' => get_the_terms($comment->comment_post_ID, 'product_tag'),
            'product_categories' => get_the_terms($comment->comment_post_ID, 'product_cat'),
            'product_rating' => get_comment_meta($comment_id, 'rating', true),
            'review_id' => $comment->comment_ID,
            'review_date' => $comment->comment_date,
            'author_id' => $comment->user_id,
            'review_author_name' => $comment->comment_author,
            'author_email' => $comment->comment_author_email,
        ];

        $flowDetails = json_decode($flows[0]->flow_details);
        $selectedProduct = !empty($flowDetails->selectedProduct) ? $flowDetails->selectedProduct : [];
        if ($flows && ($finalData['product_id'] == $selectedProduct || $selectedProduct === 'any')) {
            Flow::execute('WC', 19, $finalData, $flows);
        }
    }

    public static function handle_variable_product_order($order_id, $importType)
    {
        $flows = Flow::exists('WC', 20);
        if (!$flows || !is_plugin_active('woocommerce/woocommerce.php')) {
            return false;
        }

        $order = wc_get_order($order_id);
        $data = self::accessOrderData($order);

        foreach ($flows as $flow) {
            $flowDetails = json_decode($flow->flow_details);
            $selectedVariableProduct = !empty($flowDetails->selectedVariableProduct) ? $flowDetails->selectedVariableProduct : [];
            $selectedVariation = !empty($flowDetails->selectedVariation) ? $flowDetails->selectedVariation : [];

            foreach ($data['line_items'] as $item) {
                if ($item->product_id == $selectedVariableProduct || $selectedVariableProduct === 'any') {
                    if ($item->variation_id == $selectedVariation || $selectedVariation === 'any') {
                        Flow::execute('WC', 20, $data, [$flow]);
                    }
                }
            }
        }



        // $flowDetails = json_decode($flows[0]->flow_details);
        // $selectedVariableProduct = !empty($flowDetails->selectedVariableProduct) ? $flowDetails->selectedVariableProduct : [];
        // $selectedVariation = !empty($flowDetails->selectedVariation) ? $flowDetails->selectedVariation : [];

        // foreach ($data['line_items'] as $item) {
        //     if ($item->product_id == $selectedVariableProduct || $selectedVariableProduct === 'any') {
        //         if ($item->variation_id == $selectedVariation || $selectedVariation === 'any') {
        //             Flow::execute('WC', 20, $data, $flows);
        //         }
        //     }
        // }
    }

    public static function handle_order_checkout($order)
    {
        if (!is_plugin_active('woocommerce/woocommerce.php')) {
            return false;
        }

        $checkout = new \WC_Checkout();
        self::handle_order_create($order->id, $checkout->get_posted_data());
    }

    public static function accessSubscription($subscription, $quantity)
    {
        $items = $subscription->get_items();
        $product_names = [];
        foreach ($items as $item) {
            $product = $item->get_product();
            if (class_exists('\WC_Subscriptions_Product') && \WC_Subscriptions_Product::is_subscription($product)) {
                if (get_post_type($product->get_id()) === 'product_variation') {
                    $variation_product = get_post($product->get_id());
                    $product_names[] = !empty($variation_product->post_excerpt) ? $variation_product->post_excerpt : $variation_product->post_title;
                } else {
                    $product_names[] = $product->get_name();
                }
            }
        }
        $product_name = implode(', ', $product_names);

        $product_names = [];
        foreach ($items as $item) {
            $product = $item->get_product();
            if (class_exists('\WC_Subscriptions_Product') && \WC_Subscriptions_Product::is_subscription($product)) {
                $product_names[] = $product->get_id();
            }
        }
        $product_id = implode(', ', $product_names);

        $subscription_id = $subscription->get_id();

        $subscription_status = $subscription->get_status();

        $subscription_end_time = $subscription->get_date('end');
        if (empty($subscription_end_time) || $subscription_end_time == 0) {
            $subscription_end_time = 'N/A';
        }

        $subscription_next_payment_time = $subscription->get_date('next_payment');
        if (empty($subscription_next_payment_time) || $subscription_next_payment_time == 0) {
            $subscription_next_payment_time = 'N/A';
        }

        $subscription_trial_end_time = $subscription->get_date('trial_end');
        if (empty($subscription_trial_end_time) || $subscription_trial_end_time == 0) {
            $subscription_trial_end_time = 'N/A';
        }

        $product_urls = [];
        foreach ($items as $item) {
            $product = $item->get_product();
            if (class_exists('\WC_Subscriptions_Product') && \WC_Subscriptions_Product::is_subscription($product)) {
                $product_urls[] = get_permalink(wp_get_post_parent_id($product->get_id()));
            }
        }
        $product_url = implode(', ', $product_urls);

        $product_thumb = [];
        foreach ($items as $item) {
            $product = $item->get_product();
            if (class_exists('\WC_Subscriptions_Product') && \WC_Subscriptions_Product::is_subscription($product)) {
                $product_thumb[] = get_post_thumbnail_id(wp_get_post_parent_id($product->get_id()));
            }
        }
        $product_thumb_id = implode(', ', $product_thumb);
        if (empty($product_thumb_id) || $product_thumb_id == 0) {
            $product_thumb_id = 'N/A';
        }

        $product_thumburl = [];
        foreach ($items as $item) {
            $product = $item->get_product();
            if (class_exists('\WC_Subscriptions_Product') && \WC_Subscriptions_Product::is_subscription($product)) {
                $product_thumburl[] = get_the_post_thumbnail_url(wp_get_post_parent_id($product->get_id()));
            }
        }
        $product_thumb_url = implode(', ', $product_thumburl);
        if (empty($product_thumb_url)) {
            $product_thumb_url = 'N/A';
        }
        $order_total = $subscription->get_total();
        $user_id = $subscription->get_user_id();

        return $data = [
            'user_id' => $user_id,
            'product_id' => $product_id,
            'product_title' => $product_name,
            'product_url' => $product_url,
            'product_featured_image_url' => $product_thumb_url,
            'product_featured_image_id' => $product_thumb_id,
            'order_total' => $order_total,
            'product_quantity' => $quantity,
            'subscription_id' => $subscription_id,
            'subscription_status' => $subscription_status,
            'subscription_trial_end_date' => $subscription_trial_end_time,
            'subscription_end_date' => $subscription_end_time,
            'subscription_next_payment_date' => $subscription_next_payment_time,
        ];
    }

    public static function getOrderStatus()
    {
        $orderStatuses = wc_get_order_statuses();
        wp_send_json_success($orderStatuses);
    }

    public static function getSubscriptionProduct()
    {
        $subscriptions = self::getAllSubscriptions();
        wp_send_json_success($subscriptions);
    }

    public static function getSubscriptionStatus()
    {
        $anyStatus = [
            'any_status' => 'Any Status',
        ];

        if (function_exists('wcs_get_subscription_statuses')) {
            $allSubscriptionStatus = wcs_get_subscription_statuses();
            $allSubscriptionStatus = array_merge($anyStatus, $allSubscriptionStatus);
            $subscription_statuses = (array)$allSubscriptionStatus;
        } else {
            $subscription_statuses = (array)$anyStatus;
        }
        wp_send_json_success($subscription_statuses);
    }

    public static function getWooCommerceProduct()
    {
        $products = wc_get_products(['status' => 'publish', 'limit' => -1]);

        $allProducts = [];
        foreach ($products as $product) {
            $productId = $product->get_id();
            $productTitle = $product->get_title();
            $productType = $product->get_type();
            $productSku = $product->get_sku();

            $allProducts[] = (object)[
                'product_id' => $productId,
                'product_title' => $productTitle,
                'product_type' => $productType,
                'product_sku' => $productSku,
            ];
        }
        wp_send_json_success($allProducts);
    }

    public static function getProductCategories()
    {
        $orderby = 'name';
        $order = 'asc';
        $hide_empty = false;
        $cat_args = [
            'orderby' => $orderby,
            'order' => $order,
            'hide_empty' => $hide_empty,
        ];

        $product_categories_list = get_terms('product_cat', $cat_args);
        if (empty($product_categories_list)) {
            return;
        }
        foreach ($product_categories_list as $key => $category) {
            $product_categories[] = [
                'term_id' => (string)$category->term_id,
                'name' => $category->name,
            ];
        }
        wp_send_json_success($product_categories, 200);
    }

    public static function getUserInfo($user_id)
    {
        $userInfo = get_userdata($user_id);
        $user = [];
        if ($userInfo) {
            $userData = $userInfo->data;
            $user_meta = get_user_meta($user_id);
            $user = [
                'first_name' => $user_meta['first_name'][0],
                'last_name' => $user_meta['last_name'][0],
                'user_email' => $userData->user_email,
                'nickname' => $userData->user_nicename,
                'avatar_url' => get_avatar_url($user_id),
            ];
        }
        return $user;
    }

    public static function getVariationOfProduct($requestPrarams)
    {
        $allVariation = WCHelper::getAllVariations($requestPrarams->product_id);
        wp_send_json_success($allVariation, 200);
    }
}
