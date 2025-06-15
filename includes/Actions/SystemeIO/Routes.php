<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitCode\FI\Actions\SystemeIO\SystemeIOController;
use BitCode\FI\Core\Util\Route;

Route::post('systemeIO_authentication', [SystemeIOController::class, 'authentication']);
Route::post('systemeIO_fetch_all_fields', [SystemeIOController::class, 'getAllFields']);
Route::post('systemeIO_fetch_all_tags', [SystemeIOController::class, 'getAllTags']);
