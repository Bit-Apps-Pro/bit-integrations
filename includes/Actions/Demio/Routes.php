<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitCode\FI\Actions\Demio\DemioController;
use BitCode\FI\Core\Util\Route;

Route::post('demio_authentication', [DemioController::class, 'authentication']);
Route::post('demio_fetch_all_events', [DemioController::class, 'getAllEvents']);
Route::post('demio_fetch_all_sessions', [DemioController::class, 'getAllSessions']);
