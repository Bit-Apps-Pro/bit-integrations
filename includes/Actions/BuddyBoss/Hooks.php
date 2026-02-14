<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitApps\BTCBI_FI\Actions\BuddyBoss\BuddyBossController;
use BitApps\BTCBI_FI\Core\Util\Hooks;

Hooks::filter('bp_notifications_get_registered_components', [BuddyBossController::class, 'registerComponents'], 10, 2);
Hooks::filter('bp_notifications_get_notifications_for_user', [BuddyBossController::class, 'notificationForUser'], 10, 8);
// Hooks::add('buddyBoss_subscriptions_handler', [BuddyBossController::class , 'subscriptionHandler'], 10, 4);
