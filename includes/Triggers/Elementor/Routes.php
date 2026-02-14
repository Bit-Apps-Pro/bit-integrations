<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitApps\BTCBI_FI\Core\Util\Route;
use BitApps\BTCBI_FI\Triggers\Elementor\ElementorController;

Route::get('elementor/get', [ElementorController::class, 'getAllTasks']);
