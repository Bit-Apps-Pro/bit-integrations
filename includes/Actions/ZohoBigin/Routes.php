<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitApps\BTCBI_FI\Actions\ZohoBigin\ZohoBiginController;
use BitApps\BTCBI_FI\Core\Util\Route;

Route::post('zbigin_generate_token', [ZohoBiginController::class, 'generateTokens']);
Route::post('zbigin_refresh_modules', [ZohoBiginController::class, 'refreshModules']);
Route::post('zbigin_refresh_playouts', [ZohoBiginController::class, 'refreshPLayouts']);
Route::post('zbigin_refresh_notetypes', [ZohoBiginController::class, 'refreshNoteTypes']);
Route::post('zbigin_refresh_related_lists', [ZohoBiginController::class, 'refreshRelatedModules']);
Route::post('zbigin_refresh_fields', [ZohoBiginController::class, 'getFields']);
Route::post('zbigin_refresh_tags', [ZohoBiginController::class, 'getTagList']);
Route::post('zbigin_refresh_users', [ZohoBiginController::class, 'getUsers']);
