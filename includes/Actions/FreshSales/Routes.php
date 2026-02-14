<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitApps\BTCBI_FI\Actions\FreshSales\FreshSalesController;
use BitApps\BTCBI_FI\Core\Util\Route;

Route::post('FreshSales_authorization', [FreshSalesController::class, 'authorization']);
Route::post('FreshSales_refresh_fields', [FreshSalesController::class, 'getFields']);
Route::post('FreshSales_fetch_meta_data', [FreshSalesController::class, 'getMetaData']);
