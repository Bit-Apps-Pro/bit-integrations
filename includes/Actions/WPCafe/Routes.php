<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitApps\BTCBI_FI\Actions\WPCafe\WPCafeController;
use BitApps\BTCBI_FI\Core\Util\Route;

Route::post('wpcafe_authorize', [WPCafeController::class, 'wpcafeAuthorize']);
