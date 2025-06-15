<?php
if (!defined('ABSPATH')) {
    exit;
}

use BitCode\FI\Core\Util\Route;
use BitCode\FI\Triggers\WPEF\WPEFController;

Route::get('wpef/get', [WPEFController::class, 'getAll']);
Route::post('wpef/get/form', [WPEFController::class, 'getAForm']);
