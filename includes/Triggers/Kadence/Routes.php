<?php
if (!defined('ABSPATH')) {
    exit;
}
use BitCode\FI\Core\Util\Route;
use BitCode\FI\Triggers\Kadence\KadenceController;

Route::get('kadence/get', [KadenceController::class, 'getAll']);
Route::post('kadence/get/form', [KadenceController::class, 'get_a_form']);
