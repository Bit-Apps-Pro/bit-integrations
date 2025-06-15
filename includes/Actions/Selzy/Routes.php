<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitCode\FI\Actions\Selzy\SelzyController;
use BitCode\FI\Core\Util\Route;

Route::post('selzy_handle_authorize', [SelzyController::class, 'handleAuthorize']);
Route::post('selzy_get_all_tags', [SelzyController::class, 'getAllTags']);
Route::post('selzy_get_all_custom_fields', [SelzyController::class, 'getAllCustomFields']);
