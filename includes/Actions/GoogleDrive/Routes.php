<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitCode\FI\Actions\GoogleDrive\GoogleDriveController;
use BitCode\FI\Core\Util\Route;

Route::post('googleDrive_authorization', [GoogleDriveController::class, 'authorization']);
Route::post('googleDrive_get_all_folders', [GoogleDriveController::class, 'getAllFolders']);
