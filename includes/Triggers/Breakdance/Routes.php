<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitApps\BTCBI_FI\Core\Util\Route;
use BitApps\BTCBI_FI\Triggers\Breakdance\BreakdanceController;

Route::post('breakdance/test', [BreakdanceController::class, 'getTestData']);
Route::post('breakdance/test/remove', [BreakdanceController::class, 'removeTestData']);

BreakdanceController::addAction();
