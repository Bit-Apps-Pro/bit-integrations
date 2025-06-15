<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitCode\FI\Actions\Dokan\DokanController;
use BitCode\FI\Core\Util\Route;

Route::post('dokan_authentication', [DokanController::class, 'authentication']);
Route::post('dokan_fetch_eu_fields', [DokanController::class, 'getEUFields']);
Route::post('dokan_fetch_vendors', [DokanController::class, 'getAllVendors']);
