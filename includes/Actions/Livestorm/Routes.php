<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitCode\FI\Actions\Livestorm\LivestormController;
use BitCode\FI\Core\Util\Route;

Route::post('livestorm_authentication', [LivestormController::class, 'authentication']);
Route::post('livestorm_fetch_all_events', [LivestormController::class, 'getAllEvents']);
Route::post('livestorm_fetch_all_sessions', [LivestormController::class, 'getAllSessions']);
