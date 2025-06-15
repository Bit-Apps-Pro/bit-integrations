<?php
if (!defined('ABSPATH')) {
    exit;
}

use BitCode\FI\Core\Util\Hooks;
use BitCode\FI\Triggers\Bricks\BricksController;

Hooks::add('bricks/form/custom_action', [BricksController::class, 'handle_bricks_submit']);
