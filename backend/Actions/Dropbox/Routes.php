<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitApps\Integrations\Actions\Dropbox\DropboxController;
use BitApps\Integrations\Core\Util\Route;

Route::post('dropbox_authorization', [DropboxController::class, 'checkAuthorization']);
Route::post('dropbox_get_all_folders', [DropboxController::class, 'getAllFolders']);
