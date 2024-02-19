<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitCode\BTCBI\Util\Hooks;
use BitCode\BTCBI\Http\Services\Triggers\Bricks\BricksController;

Hooks::add('bricks/form/custom_action', [BricksController::class, 'handle_bricks_submit']);
