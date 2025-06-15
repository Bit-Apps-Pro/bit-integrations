<?php
if (!defined('ABSPATH')) {
    exit;
}

use BitCode\FI\Core\Util\Route;
use BitCode\FI\Triggers\GF\GFController;

Route::get('gf/get', [GFController::class, 'getAll']);
Route::post('gf/get/form', [GFController::class, 'get_a_form']);