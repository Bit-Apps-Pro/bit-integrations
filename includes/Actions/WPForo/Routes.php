<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitApps\BTCBI_FI\Actions\WPForo\WPForoController;
use BitApps\BTCBI_FI\Core\Util\Route;

Route::post('wpforo_authentication', [WPForoController::class, 'authentication']);
Route::post('wpforo_fetch_reputations', [WPForoController::class, 'getReputations']);
Route::post('wpforo_fetch_groups', [WPForoController::class, 'getGroups']);
Route::post('wpforo_fetch_forums', [WPForoController::class, 'getForums']);
Route::post('wpforo_fetch_topics', [WPForoController::class, 'getTopics']);
