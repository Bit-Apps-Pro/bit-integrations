<?php
if (!defined('ABSPATH')) {
    exit;
}
use BitCode\FI\Core\Util\Route;
use BitCode\FI\Triggers\Met\MetController;

Route::get('met/get', [MetController::class, 'getAll']);
Route::post('met/get/form', [MetController::class, 'get_a_form']);
