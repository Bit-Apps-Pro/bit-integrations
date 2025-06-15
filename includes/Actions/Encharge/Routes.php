<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitCode\FI\Actions\Encharge\EnchargeController;
use BitCode\FI\Core\Util\Route;

Route::post('encharge_authorize', [EnchargeController::class, 'enChargeAuthorize']);
Route::post('encharge_headers', [EnchargeController::class, 'enchargeHeaders']);
