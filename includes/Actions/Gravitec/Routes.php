<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitApps\BTCBI_FI\Actions\Gravitec\GravitecController;
use BitApps\BTCBI_FI\Core\Util\Route;

Route::post('gravitec_authentication', [GravitecController::class, 'authentication']);
