<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitCode\BTCBI\Util\Route;
use BitCode\BTCBI\Http\Services\Triggers\FF\FFController;

Route::get('ff/get', [FFController::class, 'getAll']);
Route::post('ff/get/form', [FFController::class, 'get_a_form']);
