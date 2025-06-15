<?php


if (!defined('ABSPATH')) {
    exit;
}

use BitCode\FI\Core\Util\Route;
use BitCode\FI\Triggers\Divi\DiviController;

Route::get('divi/get', [DiviController::class, 'getAllForms']);
Route::post('divi/get/form', [DiviController::class, 'getFormFields']);