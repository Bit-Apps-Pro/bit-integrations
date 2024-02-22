<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitApps\BTCBI\Util\Hooks;
use BitApps\BTCBI\Http\Services\Triggers\CartFlow\CartFlowController;

Hooks::add('woocommerce_checkout_order_processed', [CartFlowController::class, 'handle_order_create_wc'], 10, 2);