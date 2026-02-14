<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitApps\BTCBI_FI\Actions\DirectIq\DirectIqController;
use BitApps\BTCBI_FI\Core\Util\Route;

Route::post('directIq_authorize', [DirectIqController::class, 'directIqAuthorize']);
Route::post('directIq_headers', [DirectIqController::class, 'directIqHeaders']);
Route::post('directIq_lists', [DirectIqController::class, 'directIqLists']);
