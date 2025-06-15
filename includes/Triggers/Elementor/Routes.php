<?php


if (!defined('ABSPATH')) {
    exit;
}

use BitCode\FI\Core\Util\Route;
use BitCode\FI\Triggers\Elementor\ElementorController;

Route::get('elementor/get', [ElementorController::class, 'getAllForms']);
Route::post('elementor/get/form', [ElementorController::class, 'getFormFields']);