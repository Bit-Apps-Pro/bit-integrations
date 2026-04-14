<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitApps\Integrations\Actions\WCAffiliate\WCAffiliateController;
use BitApps\Integrations\Core\Util\Route;

Route::post('wc_affiliate_authorize', [WCAffiliateController::class, 'authorize']);
