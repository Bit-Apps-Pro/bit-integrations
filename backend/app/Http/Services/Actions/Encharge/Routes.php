<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitApps\BTCBI\Http\Services\Actions\Encharge\EnchargeController;
use BitApps\BTCBI\Util\Route;

Route::post('encharge_authorize', [EnchargeController::class, 'enChargeAuthorize']);
Route::post('encharge_headers', [EnchargeController::class, 'enchargeHeaders']);
