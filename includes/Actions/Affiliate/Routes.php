<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitCode\FI\Actions\Affiliate\AffiliateController;
use BitCode\FI\Core\Util\Route;

Route::post('affiliate_authorize', [AffiliateController::class, 'authorizeAffiliate']);
Route::post('affiliate_fetch_all_affiliate', [AffiliateController::class, 'getAllAffiliate']);
