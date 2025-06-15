<?php
if (!defined('ABSPATH')) {
    exit;
}

use BitCode\FI\Core\Util\Hooks;
use BitCode\FI\Triggers\StudioCart\StudioCartController;

Hooks::add('sc_order_complete', [StudioCartController::class, 'newOrderCreated'], 10, 3);
