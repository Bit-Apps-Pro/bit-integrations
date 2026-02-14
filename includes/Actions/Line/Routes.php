<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitApps\BTCBI_FI\Actions\Line\LineController;
use BitApps\BTCBI_FI\Core\Util\Route;

Route::post('line_authorization', [LineController::class, 'authorization']);
