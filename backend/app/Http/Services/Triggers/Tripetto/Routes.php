<?php

if (!defined('ABSPATH')) {
    exit;
}
use BTCBI\Deps\BitApps\WPKit\Http\Router\Route;
use BitApps\BTCBI\Http\Services\Triggers\Tripetto\TripettoController;

Route::get('tripetto/get', [TripettoController::class, 'getAll']);
Route::post('tripetto/get/form', [TripettoController::class, 'get_a_form']);