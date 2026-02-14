<?php

use BitApps\BTCBI_FI\Core\Util\Route;
use BitApps\BTCBI_FI\Triggers\BitSocial\BitSocialController;

if (!defined('ABSPATH')) {
    exit;
}

Route::get('bit-social/get', [BitSocialController::class, 'getAllTasks']);
