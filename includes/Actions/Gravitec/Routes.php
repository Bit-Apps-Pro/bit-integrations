<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitCode\FI\Actions\Gravitec\GravitecController;
use BitCode\FI\Core\Util\Route;

Route::post('gravitec_authentication', [GravitecController::class, 'authentication']);
