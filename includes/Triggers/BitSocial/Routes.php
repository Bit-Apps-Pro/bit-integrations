<?php

use BitCode\FI\Core\Util\Route;
use BitCode\FI\Triggers\BitSocial\BitSocialController;

if (!defined('ABSPATH')) {
    exit;
}

Route::get('bit-social/get', [BitSocialController::class, 'getAllTasks']);
