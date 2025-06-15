<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitCode\FI\Actions\Vbout\VboutController;
use BitCode\FI\Core\Util\Route;

Route::post('vbout_handle_authorize', [VboutController::class, 'handleAuthorize']);
Route::post('vbout_fetch_all_lists', [VboutController::class, 'fetchAllLists']);
Route::post('vbout_refresh_fields', [VboutController::class, 'vboutRefreshFields']);
