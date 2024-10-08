<?php

namespace BitCode\FI\Triggers\WC;

use WC_Product_Booking;

class WCHelper
{
    public static function accessBookingProductData($product)
    {
        if (!$product instanceof WC_Product_Booking) {
            return [];
        }

        return $product->get_data();
    }

    public static function process_booking_data($productData, $userData, $customer_id)
    {
        return [
            'product_id'   => $productData['id'],
            'product_name' => $productData['name'],
            'product_slug' => $productData['slug'],
            // 'product_type' => $productData['type'],
            'product_status'            => $productData['status'],
            'product_featured'          => $productData['featured'],
            'product_description'       => $productData['description'],
            'product_short_description' => $productData['short_description'],
            'product_price'             => $productData['price'],
            'product_regular_price'     => $productData['regular_price'],
            'product_sale_price'        => $productData['sale_price'],
            'total_sales'               => $productData['total_sales'],
            // 'product_quantity' => $productData['quantity'],
            'product_sku'          => $productData['sku'],
            'product_category_ids' => $productData['category_ids'],
            'stock_status'         => $productData['stock_status'],
            // 'product_tags' => $productData['tags'],
            'image_url'           => wp_get_attachment_image_url((int) $productData['image_id'], 'full'),
            'cost'                => $productData['cost'],
            'display_cost'        => $productData['display_cost'],
            'qty'                 => $productData['qty'],
            'customer_id'         => $customer_id,
            'customer_email'      => $userData['user_email'],
            'customer_first_name' => $userData['first_name'],
            'customer_last_name'  => $userData['last_name'],
            'customer_nickname'   => $userData['nickname'],
            'avatar_url'          => $userData['avatar_url'],
        ];
    }

    public static function getReviewFields()
    {
        return [
            'Product Id' => (object) [
                'fieldKey'  => 'product_id',
                'fieldName' => __('Product Id', 'bit-integrations')
            ],
            'Product Title' => (object) [
                'fieldKey'  => 'product_title',
                'fieldName' => __('Product Title', 'bit-integrations')
            ],
            'Product Url' => (object) [
                'fieldKey'  => 'product_url',
                'fieldName' => __('Product Url', 'bit-integrations')
            ],
            'Product Price' => (object) [
                'fieldKey'  => 'product_price',
                'fieldName' => __('Product Price', 'bit-integrations')
            ],
            'Product Review' => (object) [
                'fieldKey'  => 'product_review',
                'fieldName' => __('Product Review', 'bit-integrations')
            ],
            'Product Sku' => (object) [
                'fieldKey'  => 'product_sku',
                'fieldName' => __('Product Sku', 'bit-integrations')
            ],
            'Product Tags' => (object) [
                'fieldKey'  => 'product_tags',
                'fieldName' => __('Product Tags', 'bit-integrations')
            ],
            'Product Categories' => (object) [
                'fieldKey'  => 'product_categories',
                'fieldName' => __('Product Categories', 'bit-integrations')
            ],
            'Product Rating' => (object) [
                'fieldKey'  => 'product_rating',
                'fieldName' => __('Product Rating', 'bit-integrations')
            ],
            'Review Id' => (object) [
                'fieldKey'  => 'review_id',
                'fieldName' => __('Review Id', 'bit-integrations')
            ],
            'Review Date' => (object) [
                'fieldKey'  => 'review_date',
                'fieldName' => __('Review Date', 'bit-integrations')
            ],
            'Author Id' => (object) [
                'fieldKey'  => 'author_id',
                'fieldName' => __('Author Id', 'bit-integrations')
            ],
            'Review Author Name' => (object) [
                'fieldKey'  => 'review_author_name',
                'fieldName' => __('Review Author Name', 'bit-integrations')
            ],
            'Author Email' => (object) [
                'fieldKey'  => 'author_email',
                'fieldName' => __('Author Email', 'bit-integrations')
            ],
        ];
    }

    public static function getAllWcProducts($id)
    {
        $products = wc_get_products(['status' => 'publish', 'limit' => -1]);

        $allProducts = [];
        foreach ($products as $product) {
            $productId = $product->get_id();
            $productTitle = $product->get_title();
            $productType = $product->get_type();
            $productSku = $product->get_sku();

            $allProducts[] = (object) [
                'product_id'    => $productId,
                'product_title' => $productTitle,
                'product_type'  => $productType,
                'product_sku'   => $productSku,
            ];

            if ($id == 19) {
                $allProducts = [['product_id' => 'any', 'product_title' => __('Any Product', 'bit-integrations'), 'product_type' => '', 'product_sku' => '']] + $allProducts;
            }
        }

        return $allProducts;
    }

    public static function getReviewRating($comment_ID)
    {
        global $wpdb;
        $rating = $wpdb->get_results(
            $wpdb->prepare(
                "SELECT meta_value FROM {$wpdb->prefix}commentmeta WHERE comment_id = %d AND meta_key = 'rating'",
                $comment_ID
            )
        );

        return $rating[0]->meta_value;
    }

    public static function getAllWcVariableProduct()
    {
        $products = wc_get_products(['status' => 'publish', 'limit' => -1, 'type' => 'variable']);
        $finalProduct = [['product_id' => 'any', 'product_title' => __('Any Product', 'bit-integrations')]];
        $allProducts = [];
        foreach ($products as $product) {
            $productId = $product->get_id();
            $productTitle = $product->get_title();

            $allProducts[] = (object) [
                'product_id'    => $productId,
                'product_title' => $productTitle,
            ];
        }

        foreach ($allProducts as $product) {
            $finalProduct[] = [
                'product_id'    => $product->product_id,
                'product_title' => $product->product_title,
            ];
        }

        return $finalProduct;
    }

    public static function getAllVariations($product_id)
    {
        if ($product_id === 'any') {
            $allVariations[] = (object) [
                'variation_id'    => 'any',
                'variation_title' => __('Any Variation', 'bit-integrations'),
            ];
        } elseif ($product_id !== '') {
            $product = wc_get_product($product_id);
            $variationType = array_key_first($product->get_attributes());

            $variations = $product->get_available_variations();
            $allVariations = [];
            foreach ($variations as $variation) {
                $variationId = $variation['variation_id'];
                $variationTitle = $variationType . ' ' . $variation['attributes']["attribute_{$variationType}"];

                $allVariations[] = (object) [
                    'variation_id'    => $variationId,
                    'variation_title' => $variationTitle,
                ];
            }
        }

        return $allVariations;
    }
}
