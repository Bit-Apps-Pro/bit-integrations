<?php
if (!defined('ABSPATH')) {
    exit;
}

use BitCode\FI\Core\Util\Route;
use BitCode\FI\Triggers\Affiliate\AffiliateController;

Route::get('affiliate/get', [AffiliateController::class, 'getAll']);
Route::post('affiliate/get/form', [AffiliateController::class, 'get_a_form']);
Route::get('affiliate_get_all_type', [AffiliateController::class, 'affiliateGetAllType']);
