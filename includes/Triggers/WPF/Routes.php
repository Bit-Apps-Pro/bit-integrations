<?php

if (!defined('ABSPATH')) {
    exit;
}
use BitCode\FI\Core\Util\Route;
use BitCode\FI\Triggers\WPF\WPFController;

Route::get('wpf/get', [WPFController::class, 'getAll']);
Route::post('wpf/get/form', [WPFController::class, 'get_a_form']);
