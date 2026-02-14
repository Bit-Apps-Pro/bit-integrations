<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitApps\BTCBI_FI\Actions\ConvertKit\ConvertKitController;
use BitApps\BTCBI_FI\Core\Util\Route;

Route::post('convertKit_authorize', [ConvertKitController::class, 'convertKitAuthorize']);
Route::post('convertKit_headers', [ConvertKitController::class, 'convertKitHeaders']);
Route::post('convertKit_forms', [ConvertKitController::class, 'convertKitForms']);
Route::post('convertKit_tags', [ConvertKitController::class, 'convertKitTags']);
