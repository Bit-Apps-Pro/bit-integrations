<?php

if (!defined('ABSPATH')) {
    exit;
}
use BitApps\BTCBI\Util\Route;
use BitApps\BTCBI\Http\Services\Triggers\PiotnetForms\PiotnetFormsController;

Route::get('piotnetforms/get', [PiotnetFormsController::class, 'getAll']);
Route::post('piotnetforms/get/form', [PiotnetFormsController::class, 'get_a_form']);