<?php

if (!defined('ABSPATH')) {
    exit;
}
use BitApps\BTCBI_FI\Core\Util\Route;
use BitApps\BTCBI_FI\Triggers\WPF\WPFController;

Route::get('wpf/get', [WPFController::class, 'getAll']);
Route::post('wpf/get/form', [WPFController::class, 'get_a_form']);
