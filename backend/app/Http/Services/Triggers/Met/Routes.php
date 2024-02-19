<?php

if (!defined('ABSPATH')) {
    exit;
}
use BitCode\BTCBI\Util\Route;
use BitCode\BTCBI\Http\Services\Triggers\Met\MetController;

Route::get('met/get', [MetController::class, 'getAll']);
Route::post('met/get/form', [MetController::class, 'get_a_form']);
