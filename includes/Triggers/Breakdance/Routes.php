<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitCode\FI\Core\Util\Route;
use BitCode\FI\Triggers\Breakdance\BreakdanceController;

// Route::get('breakdance/get', [BreakdanceController::class, 'getAllForms']);
// Route::post('breakdance/get/form', [BreakdanceController::class, 'getFormFields']);
Route::post('breakdance/test', [BreakdanceController::class, 'getTestData']);
Route::post('breakdance/test/remove', [BreakdanceController::class, 'removeTestData']);

BreakdanceController::addAction();
