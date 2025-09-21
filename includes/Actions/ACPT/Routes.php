<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitCode\FI\Actions\ACPT\ACPTController;
use BitCode\FI\Core\Util\Route;

Route::post('acpt_authentication', [ACPTController::class, 'authentication']);
Route::post('acpt_fetch_all_customer', [ACPTController::class, 'getAllCustomer']);
Route::post('acpt_fetch_all_product', [ACPTController::class, 'getAllProduct']);
Route::post('acpt_fetch_all_order', [ACPTController::class, 'getAllOrder']);
Route::post('acpt_fetch_all_license', [ACPTController::class, 'getAllLicense']);
Route::post('acpt_fetch_all_generator', [ACPTController::class, 'getAllGenerator']);
