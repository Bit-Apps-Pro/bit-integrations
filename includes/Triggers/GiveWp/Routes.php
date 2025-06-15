<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitCode\FI\Core\Util\Route;
use BitCode\FI\Triggers\GiveWp\GiveWpController;

Route::get('givewp/get', [GiveWpController::class, 'getAll']);
Route::post('givewp/get/form', [GiveWpController::class, 'get_a_form']);

Route::get('get_all_donation_form', [GiveWpController::class, 'all_donation_form']);
