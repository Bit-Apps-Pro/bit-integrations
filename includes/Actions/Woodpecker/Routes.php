<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitCode\FI\Actions\Woodpecker\WoodpeckerController;
use BitCode\FI\Core\Util\Route;

Route::post('woodpecker_authentication', [WoodpeckerController::class, 'authentication']);
Route::post('woodpecker_fetch_all_campaigns', [WoodpeckerController::class, 'getAllCampagns']);
