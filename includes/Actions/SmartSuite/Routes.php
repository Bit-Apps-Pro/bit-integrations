<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitCode\FI\Actions\SmartSuite\SmartSuiteController;
use BitCode\FI\Core\Util\Route;

Route::post('smartSuite_generate_token', [SmartSuiteController::class, 'generateTokens']);
Route::post('smartSuite_fetch_custom_fields', [SmartSuiteController::class, 'getCustomFields']);
Route::post('smartSuite_fetch_all_tags', [SmartSuiteController::class, 'getAllTags']);
Route::post('smartSuite_authentication', [SmartSuiteController::class, 'authentication']);
Route::post('smartSuite_fetch_all_events', [SmartSuiteController::class, 'getAllEvents']);
Route::post('smartSuite_fetch_all_sessions', [SmartSuiteController::class, 'getAllSessions']);
