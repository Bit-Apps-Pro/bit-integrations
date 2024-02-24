<?php

if (!defined('ABSPATH')) {
    exit;
}

use BTCBI\Deps\BitApps\WPKit\Hooks\Hooks;
use BitApps\BTCBI\Http\Services\Triggers\PaidMembershipPro\PaidMembershipProController;

Hooks::addAction('pmpro_after_change_membership_level', [PaidMembershipProController::class, 'perches_membershhip_level_by_administator'], 10, 3);
Hooks::addAction('pmpro_after_change_membership_level', [PaidMembershipProController::class, 'cancel_membershhip_level'], 10, 3);
Hooks::addAction('pmpro_after_checkout', [PaidMembershipProController::class, 'perches_membership_level'], 10, 2);
Hooks::addAction('pmpro_membership_post_membership_expiry', [PaidMembershipProController::class, 'expiry_membership_level'], 10, 2);
