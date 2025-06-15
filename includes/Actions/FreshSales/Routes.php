<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitCode\FI\Actions\FreshSales\FreshSalesController;
use BitCode\FI\Core\Util\Route;

Route::post('FreshSales_authorization', [FreshSalesController::class, 'authorization']);
Route::post('FreshSales_refresh_fields', [FreshSalesController::class, 'getFields']);
Route::post('FreshSales_fetch_meta_data', [FreshSalesController::class, 'getMetaData']);
