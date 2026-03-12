<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitApps\Integrations\Actions\Line\LineController;
use BitApps\Integrations\Core\Util\Route;

Route::post('line_authorization', [LineController::class, 'authorization']);
