<?php

if (!defined('ABSPATH')) {
    exit;
}
use BitApps\Integrations\Core\Util\Route;
use BitApps\Integrations\Triggers\WPF\WPFController;

Route::get('wpf/get', [WPFController::class, 'getAll']);
Route::post('wpf/get/form', [WPFController::class, 'get_a_form']);
