<?php

/**
 * FluentCart Integration
 */

namespace BitCode\FI\Actions\FluentCart;

use WP_Error;

/**
 * Provide functionality for FluentCart integration
 */
class FluentCartController
{
    /**
     * Validate if FluentCart plugin exists or not. If not exists then terminate
     * request and send an error response.
     *
     * @return void
     */
    public static function isExists()
    {
        if (!\defined('FLUENTCART_PLUGIN_PATH')) {
            wp_send_json_error(
                __(
                    'FluentCart is not activated or not installed',
                    'bit-integrations'
                ),
                400
            );
        }
    }

    /**
     * Process ajax request for authorization
     *
     * @return JSON response
     */
    public static function fluentCartAuthorize()
    {
        self::isExists();
        wp_send_json_success(true);
    }

    /**
     * Process ajax request for refresh products
     *
     * @return JSON product data
     */
    public function refreshProducts()
    {
        self::isExists();

        $products = [];

        if (class_exists('\FluentCart\App\Models\Product')) {
            $allProducts = \FluentCart\App\Models\Product::all();

            $products = array_map(
                function ($product) {
                    return (object) [
                        'product_id'   => $product->id ?? $product['id'],
                        'product_name' => $product->title ?? $product['title']
                    ];
                },
                $allProducts->toArray()
            );
        }

        $response['products'] = $products;
        wp_send_json_success($response, 200);
    }

    /**
     * Process ajax request for refresh customers
     *
     * @return JSON customer data
     */
    public function refreshCustomers()
    {
        self::isExists();

        $customers = [];

        if (class_exists('\FluentCart\App\Models\Customer')) {
            $allCustomers = \FluentCart\App\Models\Customer::all();

            $customers = array_map(
                function ($customer) {
                    return (object) [
                        'customer_id'   => $customer->id ?? $customer['id'],
                        'customer_name' => ($customer->first_name ?? '') . ' ' . ($customer->last_name ?? ''),
                        'email'         => $customer->email ?? $customer['email']
                    ];
                },
                $allCustomers->toArray()
            );
        }

        $response['customers'] = $customers;
        wp_send_json_success($response, 200);
    }

    /**
     * Process ajax request for refresh coupons
     *
     * @return JSON coupon data
     */
    public function refreshCoupons()
    {
        self::isExists();

        $coupons = [];

        if (class_exists('\FluentCart\App\Models\Coupon')) {
            $allCoupons = \FluentCart\App\Models\Coupon::all();

            $coupons = array_map(
                function ($coupon) {
                    return (object) [
                        'coupon_id'   => $coupon->id ?? $coupon['id'],
                        'coupon_code' => $coupon->code ?? $coupon['code'],
                        'coupon_name' => $coupon->name ?? $coupon['name']
                    ];
                },
                $allCoupons->toArray()
            );
        }

        $response['coupons'] = $coupons;
        wp_send_json_success($response, 200);
    }

    /**
     * Process ajax request for refresh order statuses
     *
     * @return JSON order status data
     */
    public function refreshOrderStatuses()
    {
        self::isExists();

        $statuses = [];

        if (function_exists('\\fluent_cart_order_statuses')) {
            $allStatuses = \fluent_cart_order_statuses();

            foreach ($allStatuses as $key => $label) {
                $statuses[] = (object) [
                    'status_key'  => $key,
                    'status_name' => $label
                ];
            }
        } else {
            // Default statuses if function doesn't exist
            $defaultStatuses = [
                'pending'    => 'Pending',
                'processing' => 'Processing',
                'completed'  => 'Completed',
                'cancelled'  => 'Cancelled',
                'on-hold'    => 'On Hold',
            ];

            foreach ($defaultStatuses as $key => $label) {
                $statuses[] = (object) [
                    'status_key'  => $key,
                    'status_name' => $label
                ];
            }
        }

        $response['statuses'] = $statuses;
        wp_send_json_success($response, 200);
    }

    /**
     * Execute action
     *
     * @param $integrationData Integration data
     * @param $fieldValues     Field values
     *
     * @return bool
     */
    public function execute($integrationData, $fieldValues)
    {
        $integrationDetails = $integrationData->flow_details;
        $integId = $integrationData->id;
        $authToken = $integrationDetails->tokenDetails;
        $fieldMap = $integrationDetails->field_map;
        $actions = $integrationDetails->actions;

        if (empty($fieldMap)) {
            return new WP_Error('field_map_empty', __('Field map is empty', 'bit-integrations'));
        }

        $recordApiHelper = new RecordApiHelper($integrationDetails, $integId);
        $fluentCartResponse = $recordApiHelper->execute($fieldValues, $fieldMap, $actions);

        if (is_wp_error($fluentCartResponse)) {
            return $fluentCartResponse;
        }

        return $fluentCartResponse;
    }
}
