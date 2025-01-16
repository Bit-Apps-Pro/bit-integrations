<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitCode\FI\Actions\SmartSuite\SmartSuiteController;
use BitCode\FI\Core\Util\Route;

Route::post('smartSuite_authentication', [SmartSuiteController::class, 'authentication']);
Route::post('smartSuite_fetch_all_solutions', [SmartSuiteController::class, 'getAllSolutions']);
Route::post('smartSuite_fetch_all_tables', [SmartSuiteController::class, 'getAllTables']);
Route::post('smartSuite_fetch_all_user', [SmartSuiteController::class, 'getAllUser']);
