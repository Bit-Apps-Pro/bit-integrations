<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitCode\FI\Core\Util\Route;
use BitCode\FI\Triggers\BitForm\BitFormController;

Route::get('bitform/get', [BitFormController::class, 'getAll']);
Route::post('bitform/get/form', [BitFormController::class, 'get_a_form']);
