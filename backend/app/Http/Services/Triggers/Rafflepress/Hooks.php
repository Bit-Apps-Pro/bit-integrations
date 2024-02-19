<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitCode\BTCBI\Util\Hooks;
use BitCode\BTCBI\Http\Services\Triggers\Rafflepress\RafflepressController;

Hooks::add('rafflepress_giveaway_webhooks', [RafflepressController::class, 'newPersonEntry'], 10, 1);
// Hooks::add('data_model_solid_affiliate_referrals_save', [SolidAffiliateController::class, 'newSolidAffiliateReferralCreated'], 10, 1);
