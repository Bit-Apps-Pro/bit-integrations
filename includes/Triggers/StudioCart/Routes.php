<?php
if (!defined('ABSPATH')) {
    exit;
}
use BitCode\FI\Core\Util\Route;
use BitCode\FI\Triggers\StudioCart\StudioCartController;

Route::get('studiocart/get', [StudioCartController::class, 'getAll']);
Route::post('studiocart/get/form', [StudioCartController::class, 'get_a_form']);