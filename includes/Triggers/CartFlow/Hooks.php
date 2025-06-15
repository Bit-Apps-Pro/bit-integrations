<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitCode\FI\Core\Util\Hooks;
use BitCode\FI\Triggers\CartFlow\CartFlowController;

Hooks::add('woocommerce_checkout_order_processed', [CartFlowController::class, 'handle_order_create_wc'], 10, 2);