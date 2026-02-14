<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitApps\BTCBI_FI\Actions\RestrictContent\RestrictContentController;
use BitApps\BTCBI_FI\Core\Util\Route;

Route::post('restrict_authorize', [RestrictContentController::class, 'authorizeRestrictContent']);
Route::get('restrict_get_all_levels', [RestrictContentController::class, 'getAllLevels']);
