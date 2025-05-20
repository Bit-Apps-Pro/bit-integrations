<?php

namespace BitCode\FI\Triggers\WC;

use BitCode\FI\Core\Util\Helper;
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

            if ($id == WCController::USER_REVIEWS_A_PRODUCT) {
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

    public static function processProductData($postId)
    {
        $product = wc_get_product($postId);
        $productData = self::accessProductData($product);

        foreach (Helper::acfGetFieldGroups(['product']) as $group) {
            foreach (acf_get_fields($group['ID']) as $field) {
                $productData[$field['_name']] = get_post_meta($postId, $field['_name'])[0];
            }
        }

        return $productData;
    }

    public static function accessProductData($product)
    {
        $productId = $product->get_id();
        $imageUrl = wp_get_attachment_image_url($product->get_image_id(), 'full');
        $imageIds = $product->get_gallery_image_ids();
        $galleryImages = [];

        if (\count($imageIds)) {
            foreach ($imageIds as $id) {
                $galleryImages[] = wp_get_attachment_image_url($id, 'full');
            }
        }

        return [
            'post_id'                => $productId,
            'post_title'             => $product->get_name(),
            'post_content'           => $product->get_description(),
            'post_excerpt'           => $product->get_short_description(),
            'post_date'              => $product->get_date_created(),
            'post_date_gmt'          => $product->get_date_modified(),
            'post_status'            => $product->get_status(),
            'tags_input'             => $product->get_tag_ids(),
            'post_category'          => wc_get_product_category_list($productId),
            '_visibility'            => $product->get_catalog_visibility(),
            '_featured'              => $product->get_featured(),
            '_regular_price'         => $product->get_regular_price(),
            '_sale_price'            => $product->get_sale_price(),
            '_sale_price_dates_from' => $product->get_date_on_sale_from(),
            '_sale_price_dates_to'   => $product->get_date_on_sale_to(),
            '_sku'                   => $product->get_sku(),
            '_manage_stock'          => $product->get_manage_stock(),
            '_stock'                 => $product->get_stock_quantity(),
            '_backorders'            => $product->get_backorders(),
            '_low_stock_amount'      => 1,
            '_stock_status'          => $product->get_stock_status(),
            '_sold_individually'     => $product->get_sold_individually(),
            '_weight'                => $product->get_weight(),
            '_length'                => $product->get_length(),
            '_width'                 => $product->get_width(),
            '_height'                => $product->get_height(),
            '_purchase_note'         => $product->get_purchase_note(),
            'menu_order'             => $product->get_menu_order(),
            'comment_status'         => $product->get_reviews_allowed(),
            '_virtual'               => $product->get_virtual(),
            '_downloadable'          => $product->get_downloadable(),
            '_download_limit'        => $product->get_download_limit(),
            '_download_expiry'       => $product->get_download_expiry(),
            'product_type'           => $product->get_type(),
            '_product_url'           => get_permalink($productId),
            '_tax_status'            => $product->get_tax_status(),
            '_tax_class'             => $product->get_tax_class(),
            '_product_image'         => $imageUrl,
            '_product_gallery'       => $galleryImages,
        ];
    }
}
