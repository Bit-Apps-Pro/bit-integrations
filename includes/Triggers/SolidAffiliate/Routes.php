<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitCode\FI\Core\Util\Route;
use BitCode\FI\Triggers\SolidAffiliate\SolidAffiliateController;

Route::get('solidaffiliate/get', [SolidAffiliateController::class, 'getAll']);
Route::post('solidaffiliate/get/form', [SolidAffiliateController::class, 'get_a_form']);
