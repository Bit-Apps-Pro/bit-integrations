<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitApps\Integrations\Actions\WPCafe\WPCafeController;
use BitApps\Integrations\Core\Util\Route;

Route::post('wpcafe_authorize', [WPCafeController::class, 'wpcafeAuthorize']);
