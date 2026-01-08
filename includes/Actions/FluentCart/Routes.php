<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitCode\FI\Actions\FluentCart\FluentCartController;
use BitCode\FI\Core\Util\Route;

Route::post('fluent_cart_authorize', [FluentCartController::class, 'fluentCartAuthorize']);
Route::post('refresh_fluent_cart_products', [FluentCartController::class, 'refreshProducts']);
Route::post('refresh_fluent_cart_products_categories', [FluentCartController::class, 'refreshProductCategories']);
Route::post('refresh_fluent_cart_customers', [FluentCartController::class, 'refreshCustomers']);
Route::post('refresh_fluent_cart_product_brands', [FluentCartController::class, 'refreshProductBrands']);
Route::post('refresh_fluent_cart_product_shipping_classes', [FluentCartController::class, 'refreshProductShippingClasses']);
Route::post('refresh_fluent_cart_order_statuses', [FluentCartController::class, 'refreshOrderStatuses']);
