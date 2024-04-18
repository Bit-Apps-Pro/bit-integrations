<?php
if (!defined('ABSPATH')) {
    exit;
}

use BitCode\FI\Core\Util\Route;
use BitCode\FI\Triggers\FluentBooking\FluentBookingController;

Route::get('fluentBooking/get', [FluentBookingController::class, 'getAll']);
Route::post('fluentBooking/get/form', [FluentBookingController::class, 'get_a_form']);
