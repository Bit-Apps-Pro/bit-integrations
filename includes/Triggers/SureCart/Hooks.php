<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitCode\FI\Core\Util\Hooks;
use BitCode\FI\Triggers\SureCart\SureCartController;

Hooks::add('surecart/purchase_created', [SureCartController::class, 'surecart_purchase_product'], 10, 1);
Hooks::add('surecart/purchase_revoked', [SureCartController::class, 'surecart_purchase_revoked'], 10, 1);
Hooks::add('surecart/purchase_invoked', [SureCartController::class, 'surecart_purchase_unrevoked'], 10, 1);
