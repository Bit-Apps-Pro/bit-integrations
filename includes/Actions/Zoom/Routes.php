<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitApps\BTCBI_FI\Actions\Zoom\ZoomController;
use BitApps\BTCBI_FI\Core\Util\Route;

Route::post('zoom_generate_token', [ZoomController::class, 'authorization']);
Route::post('zoom_fetch_all_meetings', [ZoomController::class, 'zoomFetchAllMeetings']);
Route::post('zoom_fetch_all_fields', [ZoomController::class, 'zoomFetchAllCustomFields']);
