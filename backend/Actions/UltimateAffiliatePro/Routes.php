<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitApps\Integrations\Actions\UltimateAffiliatePro\UltimateAffiliateProController;
use BitApps\Integrations\Core\Util\Route;

Route::post('ultimate_affiliate_pro_authorize', [UltimateAffiliateProController::class, 'authorizeUltimateAffiliatePro']);
