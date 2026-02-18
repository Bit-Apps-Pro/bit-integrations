<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitApps\Integrations\Actions\Encharge\EnchargeController;
use BitApps\Integrations\Core\Util\Route;

Route::post('encharge_authorize', [EnchargeController::class, 'enChargeAuthorize']);
Route::post('encharge_headers', [EnchargeController::class, 'enchargeHeaders']);
