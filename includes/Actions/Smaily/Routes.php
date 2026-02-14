<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitApps\BTCBI_FI\Actions\Smaily\SmailyController;
use BitApps\BTCBI_FI\Core\Util\Route;

Route::post('smaily_authentication', [SmailyController::class, 'authentication']);
