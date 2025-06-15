<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitCode\FI\Actions\ZoomWebinar\ZoomWebinarController;
use BitCode\FI\Core\Util\Route;

Route::post('zoom_webinar_generate_token', [ZoomWebinarController::class, 'authorization']);
Route::post('zoom_webinar_fetch_all_webinar', [ZoomWebinarController::class, 'zoomFetchAllWebinar']);
