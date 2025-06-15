<?php

if (!defined('ABSPATH')) {
    exit;
}
use BitCode\FI\Core\Util\Route;
use BitCode\FI\Triggers\Tripetto\TripettoController;

Route::get('tripetto/get', [TripettoController::class, 'getAll']);
Route::post('tripetto/get/form', [TripettoController::class, 'get_a_form']);
