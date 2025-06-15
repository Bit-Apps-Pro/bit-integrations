<?php


if (!defined('ABSPATH')) {
    exit;
}

use BitCode\FI\Core\Util\Route;
use BitCode\FI\Triggers\Bricks\BricksController;

Route::get('bricks/get', [BricksController::class, 'getAllForms']);
Route::post('bricks/get/form', [BricksController::class, 'getFormFields']);