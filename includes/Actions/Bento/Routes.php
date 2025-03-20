<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitCode\FI\Actions\Bento\BentoController;
use BitCode\FI\Core\Util\Route;

Route::post('bento_authentication', [BentoController::class, 'authentication']);
Route::post('bento_fetch_all_events', [BentoController::class, 'getAllEvents']);
Route::post('bento_fetch_all_sessions', [BentoController::class, 'getAllSessions']);
