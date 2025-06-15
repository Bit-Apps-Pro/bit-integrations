<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitCode\FI\Actions\OneDrive\OneDriveController;
use BitCode\FI\Core\Util\Route;

Route::post('oneDrive_authorization', [OneDriveController::class, 'authorization']);
Route::post('oneDrive_get_all_folders', [OneDriveController::class, 'getAllFolders']);
Route::post('oneDrive_get_single_folder', [OneDriveController::class, 'singleOneDriveFolderList']);
