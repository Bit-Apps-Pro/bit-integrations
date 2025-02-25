<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitCode\FI\Core\Util\Route;
use BitCode\FI\Triggers\Elementor\ElementorController;

Route::get('elementor/get', [ElementorController::class, 'getAllTasks']);
Route::post('elementor/test', [ElementorController::class, 'getTestData']);
Route::post('elementor/test/remove', [ElementorController::class, 'removeTestData']);
