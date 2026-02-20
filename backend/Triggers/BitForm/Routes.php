<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitApps\Integrations\Core\Util\Route;
use BitApps\Integrations\Triggers\BitForm\BitFormController;

Route::get('bitform/get', [BitFormController::class, 'getAll']);
Route::post('bitform/get/form', [BitFormController::class, 'get_a_form']);
