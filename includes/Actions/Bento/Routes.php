<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitCode\FI\Actions\Bento\BentoController;
use BitCode\FI\Core\Util\Route;

Route::post('bento_authentication', [BentoController::class, 'authentication']);
Route::post('bento_get_fields', [BentoController::class, 'getAllFields']);
Route::post('bento_get_all_tags', [BentoController::class, 'getAlTags']);
