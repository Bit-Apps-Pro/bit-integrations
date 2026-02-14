<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitApps\BTCBI_FI\Actions\Livestorm\LivestormController;
use BitApps\BTCBI_FI\Core\Util\Route;

Route::post('livestorm_authentication', [LivestormController::class, 'authentication']);
Route::post('livestorm_fetch_all_events', [LivestormController::class, 'getAllEvents']);
Route::post('livestorm_fetch_all_sessions', [LivestormController::class, 'getAllSessions']);
