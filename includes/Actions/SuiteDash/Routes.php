<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitApps\BTCBI_FI\Actions\SuiteDash\SuiteDashController;
use BitApps\BTCBI_FI\Core\Util\Route;

Route::post('suite_dash_authentication', [SuiteDashController::class, 'authentication']);
Route::post('suite_dash_fetch_all_fields', [SuiteDashController::class, 'getAllFields']);
Route::post('suite_dash_fetch_all_companies', [SuiteDashController::class, 'getAllCompanies']);
