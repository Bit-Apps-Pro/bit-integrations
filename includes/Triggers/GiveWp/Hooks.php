<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitCode\FI\Core\Util\Hooks;
use BitCode\FI\Triggers\GiveWp\GiveWpController;

Hooks::add('give_update_payment_status', [GiveWpController::class, 'handleUserDonation'], 10, 3);
Hooks::add('give_subscription_cancelled', [GiveWpController::class, 'handleSubscriptionDonationCancel'], 10, 2);
Hooks::add('give_subscription_updated', [GiveWpController::class, 'handleRecurringDonation'], 10, 4);
