<?php

/**
 * WooCommerce Integration
 */

namespace BitCode\FI\Actions\WooCommerce;

use WP_Error;
use WC_Data_Store;
use BitCode\FI\Log\LogHandler;
use BitCode\FI\Actions\WooCommerce\RecordApiHelper;

class WooCommerceController
{
    private $_integrationID;

    public function __construct($integrationID)
    {
        $this->_integrationID = $integrationID;
    }

    public static function authorizeWC()
    {
        include_once ABSPATH . 'wp-admin/includes/plugin.php';
        if (is_plugin_active('woocommerce/woocommerce.php')) {
            wp_send_json_success(true, 200);
        }

        wp_send_json_error(__('WooCommerce must be activated!', 'bit-integrations'));
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

    public static function refreshFields($queryParams)
    {
        if (empty($queryParams->module)) {
            wp_send_json_error(
                __(
                    'Requested parameter is empty',
                    'bit-integrations'
                ),
                400
            );
        }

        $metabox = self::metaboxFields($queryParams->module);

        $uploadFields = [];

        if ($queryParams->module === 'product') {
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
                'Post Password' => (object) [
                    'fieldKey' => 'post_password',
                    'fieldName' => 'Post Password'
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
                    'fieldName' => 'SKU',
                    'required' => true,
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
                'Button Text' => (object) [
                    'fieldKey' => '_button_text',
                    'fieldName' => 'Button Text'
                ],
            ];
            $fields = array_merge($fields, $metabox['meta_fields']);

            $uploadFields = [
                'Product Image' => (object) [
                    'fieldKey' => 'product_image',
                    'fieldName' => 'Product Image'
                ],
                'Product Gallery' => (object) [
                    'fieldKey' => 'product_gallery',
                    'fieldName' => 'Product Gallery'
                ],
                'Downloadable Files' => (object) [
                    'fieldKey' => 'downloadable_files',
                    'fieldName' => 'Downloadable Files'
                ],
            ];
            $uploadFields = array_merge($uploadFields, $metabox['upload_fields']);

            $required = ['post_title', '_sku'];
        }

        if ($queryParams->module === 'customer') {
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
                    'required' => true
                ],
                'Username' => (object) [
                    'fieldKey' => 'user_login',
                    'fieldName' => 'Username',
                    'required' => true
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
                'Description' => (object) [
                    'fieldKey' => 'description',
                    'fieldName' => 'Description'
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

            $required = ['user_login', 'user_email'];
        }

        if ($queryParams->module === 'order') {
            $metaboxOrder = self::metaboxFields($queryParams->module);
            $metaboxCustomer = self::metaboxFields('customer');

            $fieldsOrder = [
                'customer_note' => (object) [
                    'fieldKey' => 'customer_note',
                    'fieldName' => 'Customer Note'
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
                // Fixed Cart Items Coupon
                'coupon_code' => (object) [
                    'fieldKey' => 'coupon_code',
                    'fieldName' => 'Coupon Code'
                ],
            ];

            $fieldsCustomer = [
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
                    'required' => true
                ],
                'Username' => (object) [
                    'fieldKey' => 'user_login',
                    'fieldName' => 'Username',
                    'required' => true
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
                'Description' => (object) [
                    'fieldKey' => 'description',
                    'fieldName' => 'Description'
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

            $required = ['user_login', 'user_email'];
            $requiredLine = ['sku', 'quantity'];

            $fieldLineItems = [
                'Product Name' => (object) [
                    'fieldKey' => 'name',
                    'fieldName' => 'Product Name',
                    'required' => true
                ],
                'Sku' => (object) [
                    'fieldKey' => 'sku',
                    'fieldName' => 'Sku',
                    'required' => true
                ],
                'Quantity' => (object) [
                    'fieldKey' => 'quantity',
                    'fieldName' => 'Quantity',
                    'required' => true
                ],
                'Price' => (object) [
                    'fieldKey' => 'price',
                    'fieldName' => 'Price',
                    'required' => true
                ],
                'Tax Class' => (object) [
                    'fieldKey' => 'tax_class',
                    'fieldName' => 'Tax Class'
                ],
                'Line Subtotal' => (object) [
                    'fieldKey' => 'subtotal',
                    'fieldName' => 'Line Subtotal'
                ],
                'Line Subtotal Tax' => (object) [
                    'fieldKey' => 'line_subtotal_tax',
                    'fieldName' => 'Line Subtotal Tax'
                ],
                'Line Total' => (object) [
                    'fieldKey' => 'total',
                    'fieldName' => 'Line Total'
                ],
            ];

            uksort($fieldsOrder, 'strnatcasecmp');
            uksort($fieldsCustomer, 'strnatcasecmp');
            uksort($fieldLineItems, 'strnatcasecmp');
            $fieldsOrder = array_merge($fieldsOrder, $metaboxOrder['meta_fields']);
            $fieldsCustomer = array_merge($fieldsCustomer, $metaboxCustomer['meta_fields']);

            $responseOrder = [
                'fields' => $fieldsOrder,
                'uploadFields' => $uploadFields,
                'required' => []
            ];
            $responseCustomer = [
                'fields' => $fieldsCustomer,
                'uploadFields' => $uploadFields,
                'required' => $required
            ];

            $responseLine = [
                'fields' => $fieldLineItems,
                'uploadFields' => $uploadFields,
                'required' => $requiredLine
            ];

            wp_send_json_success([$responseOrder, $responseCustomer, $responseLine], 200);
        }

        if ($queryParams->module === 'changestatus') {
            $fields = [
                'Order ID' => (object) [
                    'fieldKey' => 'order_id',
                    'fieldName' => 'Order ID',
                    'required' => true
                ],
                'Order Status' => (object) [
                    'fieldKey' => 'order_status',
                    'fieldName' => 'Order Status',
                    'required' => true
                ],
                'Customer Email' => (object) [
                    'fieldKey' => 'email',
                    'fieldName' => 'Customer Email',
                    'required' => true
                ],
                'From Date' => (object) [
                    'fieldKey' => 'from_date',
                    'fieldName' => 'From Date',
                    'required' => true
                ],
                'To Date' => (object) [
                    'fieldKey' => 'to_date',
                    'fieldName' => 'To Date',
                    'required' => true
                ],
                'N Days' => (object) [
                    'fieldKey' => 'n_days',
                    'fieldName' => 'N Days',
                    'required' => true
                ],
                'N Weeks' => (object) [
                    'fieldKey' => 'n_weeks',
                    'fieldName' => 'N Weeks',
                    'required' => true
                ],
                'N Months' => (object) [
                    'fieldKey' => 'n_months',
                    'fieldName' => 'N Months',
                    'required' => true
                ],

            ];
            $required = [];
            $response = [
                'fields' => $fields,
                'uploadFields' => $uploadFields,
                'required' => $required
            ];

            wp_send_json_success($response, 200);
        }

        uksort($fields, 'strnatcasecmp');
        uksort($uploadFields, 'strnatcasecmp');
        $fields = array_merge($fields, $metabox['meta_fields']);
        $response = [
            'fields' => $fields,
            'uploadFields' => $uploadFields,
            'required' => $required
        ];

        wp_send_json_success($response, 200);
    }

    public function searchProjects($queryParams)
    {
        include_once dirname(WC_PLUGIN_FILE) . '/includes/class-wc-product-functions.php';
        $data_store = WC_Data_Store::load('product');
        $search_results = $data_store->search_products($queryParams->searchTxt);
        $products = [];
        foreach ($search_results as $res) {
            if ($res) {
                $product = wc_get_product($res);
                $products[] = [
                    'id' => $res,
                    'name' => $product->get_name(),
                ];
            }
        }

        wp_send_json_success($products, 200);
    }

    public static function allSubscriptionsProducts()
    {
        global $wpdb;
        $allSubscriptions = $wpdb->get_results($wpdb->prepare("
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
        "));

        $subscriptions[] = [
            'product_id' => 'any',
            'product_name' => 'Any product',
        ];

        foreach ($allSubscriptions as $key => $val) {
            $subscriptions[] = [
                'product_id' => $val->ID,
                'product_name' => $val->post_title,
            ];
        }
        wp_send_json_success($subscriptions, 200);
    }

    public function execute($integrationData, $fieldValues)
    {
        $integrationDetails = $integrationData->flow_details;
        $module = $integrationDetails->module;
        $fieldMap = $integrationDetails->$module->field_map;
        $uploadFieldMap = $integrationDetails->$module->upload_field_map;
        $required = $integrationDetails->default->fields->{$module}->required;

        if (
            empty($module)
        ) {
            $error = new WP_Error('REQ_FIELD_EMPTY', __('module and field map are required for woocommerce', 'bit-integrations'));
            LogHandler::save($this->_integrationID, 'record', 'validation', $error);
            return $error;
        }

        $recordApiHelper = new RecordApiHelper($this->_integrationID);

        $wcApiResponse = $recordApiHelper->execute(
            $module,
            $fieldValues,
            $fieldMap,
            $uploadFieldMap,
            $required,
            $integrationDetails
        );

        if (is_wp_error($wcApiResponse)) {
            return $wcApiResponse;
        }
        return $wcApiResponse;
    }
}
