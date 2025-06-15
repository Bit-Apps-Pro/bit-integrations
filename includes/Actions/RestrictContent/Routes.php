<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitCode\FI\Actions\RestrictContent\RestrictContentController;
use BitCode\FI\Core\Util\Route;

Route::post('restrict_authorize', [RestrictContentController::class, 'authorizeRestrictContent']);
Route::get('restrict_get_all_levels', [RestrictContentController::class, 'getAllLevels']);
