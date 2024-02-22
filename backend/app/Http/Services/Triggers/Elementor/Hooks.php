<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitApps\BTCBI\Util\Hooks;
use BitApps\BTCBI\Http\Services\Triggers\Elementor\ElementorController;

Hooks::add('elementor_pro/forms/new_record', [ElementorController::class, 'handle_elementor_submit']);