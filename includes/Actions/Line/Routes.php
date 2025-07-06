<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitCode\FI\Actions\Line\LineController;
use BitCode\FI\Core\Util\Route;

// Line
Route::post('line_authorization', [LineController::class, 'checkAuthorization']);
