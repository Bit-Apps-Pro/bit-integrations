<?php

use BitApps\Integrations\Core\Util\Route;
use BitApps\Integrations\Triggers\BitSocial\BitSocialController;

if (!defined('ABSPATH')) {
    exit;
}

Route::get('bit-social/get', [BitSocialController::class, 'getAllTasks']);
