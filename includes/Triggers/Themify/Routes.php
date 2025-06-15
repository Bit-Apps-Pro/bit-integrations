<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitCode\FI\Core\Util\Route;
use BitCode\FI\Triggers\Themify\ThemifyController;

Route::get('themify/get', [ThemifyController::class, 'getAllForms']);
Route::post('themify/get/form', [ThemifyController::class, 'getFormFields']);
