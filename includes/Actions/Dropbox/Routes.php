<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitCode\FI\Actions\Dropbox\DropboxController;
use BitCode\FI\Core\Util\Route;

Route::post('dropbox_authorization', [DropboxController::class, 'checkAuthorization']);
Route::post('dropbox_get_all_folders', [DropboxController::class, 'getAllFolders']);
