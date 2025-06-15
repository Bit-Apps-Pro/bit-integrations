<?php
if (!defined('ABSPATH')) {
    exit;
}
use BitCode\FI\Core\Util\Route;
use BitCode\FI\Triggers\Happy\HappyController;

Route::get('happy/get', [HappyController::class, 'getAll']);
Route::post('happy/get/form', [HappyController::class, 'get_a_form']);