<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitApps\Integrations\Actions\PipeDrive\PipeDriveController;
use BitApps\Integrations\Core\Util\Route;

Route::post('PipeDrive_refresh_fields', [PipeDriveController::class, 'getFields']);
Route::post('PipeDrive_fetch_meta_data', [PipeDriveController::class, 'getMetaData']);
