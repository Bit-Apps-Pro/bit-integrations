<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitCode\FI\Core\Util\Hooks;
use BitCode\FI\Triggers\EDD\EDDController;

Hooks::add('edd_complete_purchase', [EDDController::class, 'handlePurchaseProduct'], 10, 1);
Hooks::add('edd_complete_purchase', [EDDController::class, 'handlePurchaseProductDiscountCode'], 10, 3);
Hooks::add('edds_payment_refunded', [EDDController::class, 'handleOrderRefunded'], 10, 1);

