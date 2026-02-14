<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitApps\BTCBI_FI\Actions\SystemeIO\SystemeIOController;
use BitApps\BTCBI_FI\Core\Util\Route;

Route::post('systemeIO_authentication', [SystemeIOController::class, 'authentication']);
Route::post('systemeIO_fetch_all_fields', [SystemeIOController::class, 'getAllFields']);
Route::post('systemeIO_fetch_all_tags', [SystemeIOController::class, 'getAllTags']);
