<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitCode\FI\Actions\PipeDrive\PipeDriveController;
use BitCode\FI\Core\Util\Route;

Route::post('PipeDrive_refresh_fields', [PipeDriveController::class, 'getFields']);
Route::post('PipeDrive_fetch_meta_data', [PipeDriveController::class, 'getMetaData']);
