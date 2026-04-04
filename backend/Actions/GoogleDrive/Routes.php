<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitApps\Integrations\Actions\GoogleDrive\GoogleDriveController;
use BitApps\Integrations\Core\Util\Route;

Route::no_sanitize()->post('googleDrive_authorization', [GoogleDriveController::class, 'authorization']);
Route::post('googleDrive_get_all_folders', [GoogleDriveController::class, 'getAllFolders']);
