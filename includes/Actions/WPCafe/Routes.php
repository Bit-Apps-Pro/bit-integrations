<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitCode\FI\Actions\WPCafe\WPCafeController;
use BitCode\FI\Core\Util\Route;

Route::post('wpcafe_authorize', [WPCafeController::class, 'wpcafeAuthorize']);
