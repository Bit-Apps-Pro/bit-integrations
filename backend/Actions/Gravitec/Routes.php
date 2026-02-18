<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitApps\Integrations\Actions\Gravitec\GravitecController;
use BitApps\Integrations\Core\Util\Route;

Route::post('gravitec_authentication', [GravitecController::class, 'authentication']);
