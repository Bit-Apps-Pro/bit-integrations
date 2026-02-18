<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitApps\Integrations\Core\Util\Route;
use BitApps\Integrations\Triggers\Breakdance\BreakdanceController;

Route::post('breakdance/test', [BreakdanceController::class, 'getTestData']);
Route::post('breakdance/test/remove', [BreakdanceController::class, 'removeTestData']);

BreakdanceController::addAction();
