<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitCode\FI\Core\Util\Route;
use BitCode\FI\Actions\LMFWC\LMFWCController;

Route::post('lmfwc_authentication', [LMFWCController::class, 'authentication']);
Route::post('lmfwc_fetch_all_customer', [LMFWCController::class, 'getAllCustomer']);
Route::post('lmfwc_fetch_all_product', [LMFWCController::class, 'getAllProduct']);
Route::post('lmfwc_fetch_all_order', [LMFWCController::class, 'getAllOrder']);
Route::post('lmfwc_fetch_all_license', [LMFWCController::class, 'getAllLicense']);
Route::post('lmfwc_fetch_all_generator', [LMFWCController::class, 'getAllGenerator']);
