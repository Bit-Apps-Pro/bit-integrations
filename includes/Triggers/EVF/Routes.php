<?php
if (!defined('ABSPATH')) {
    exit;
}

use BitCode\FI\Core\Util\Route;
use BitCode\FI\Triggers\EVF\EVFController;

Route::get('evf/get', [EVFController::class, 'getAll']);
Route::post('evf/get/form', [EVFController::class, 'getAForm']);
