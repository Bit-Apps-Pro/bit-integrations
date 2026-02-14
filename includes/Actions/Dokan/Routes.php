<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitApps\BTCBI_FI\Actions\Dokan\DokanController;
use BitApps\BTCBI_FI\Core\Util\Route;

Route::post('dokan_authentication', [DokanController::class, 'authentication']);
Route::post('dokan_fetch_eu_fields', [DokanController::class, 'getEUFields']);
Route::post('dokan_fetch_vendors', [DokanController::class, 'getAllVendors']);
