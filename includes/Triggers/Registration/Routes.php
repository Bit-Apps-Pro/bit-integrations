<?php


if (!defined('ABSPATH')) {
    exit;
}

use BitCode\FI\Core\Util\Route;
use BitCode\FI\Triggers\Registration\RegistrationController;

Route::get('registration/get', [RegistrationController::class, 'getAll']);
Route::post('registration/get/form', [RegistrationController::class, 'get_a_form']);
