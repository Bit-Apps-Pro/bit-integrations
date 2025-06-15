<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitCode\FI\Actions\Autonami\AutonamiController;
use BitCode\FI\Core\Util\Route;

Route::post('autonami_authorize', [AutonamiController::class, 'autonamiAuthorize']);
Route::post('autonami_lists_and_tags', [AutonamiController::class, 'autonamiListsAndTags']);
Route::post('autonami_fields', [AutonamiController::class, 'autonamiFields']);
