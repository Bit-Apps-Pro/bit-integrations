<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitApps\Integrations\Core\Util\Route;
use BitApps\Integrations\Triggers\Elementor\ElementorController;

Route::get('elementor/get', [ElementorController::class, 'getAllTasks']);
