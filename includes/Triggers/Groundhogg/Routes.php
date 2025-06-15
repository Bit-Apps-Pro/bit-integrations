<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitCode\FI\Core\Util\Route;
use BitCode\FI\Triggers\Groundhogg\GroundhoggController;

Route::get('groundhogg/get', [GroundhoggController::class, 'getAll']);
Route::post('groundhogg/get/form', [GroundhoggController::class, 'getFormFields']);
Route::get('groundhogg/get/tags', [GroundhoggController::class, 'getAllTags']);
