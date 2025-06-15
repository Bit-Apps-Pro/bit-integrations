<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitCode\FI\Actions\Zoom\ZoomController;
use BitCode\FI\Core\Util\Route;

Route::post('zoom_generate_token', [ZoomController::class, 'authorization']);
Route::post('zoom_fetch_all_meetings', [ZoomController::class, 'zoomFetchAllMeetings']);
Route::post('zoom_fetch_all_fields', [ZoomController::class, 'zoomFetchAllCustomFields']);
