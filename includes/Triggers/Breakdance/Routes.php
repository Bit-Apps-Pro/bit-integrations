<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitCode\FI\Core\Util\Route;
use BitCode\FI\Triggers\Breakdance\BreakdanceController;

Route::post('breakdance/test', [BreakdanceController::class, 'getTestData']);
Route::post('breakdance/test/remove', [BreakdanceController::class, 'removeTestData']);

BreakdanceController::addAction();
