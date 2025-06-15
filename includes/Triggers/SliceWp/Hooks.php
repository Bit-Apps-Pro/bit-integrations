<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitCode\FI\Core\Util\Hooks;
use BitCode\FI\Triggers\SliceWp\SliceWpController;

Hooks::add('slicewp_insert_affiliate', [SliceWpController::class, 'newAffiliateCreated'], 10, 2);
Hooks::add('slicewp_insert_commission', [SliceWpController::class, 'userEarnCommission'], 10, 2);
