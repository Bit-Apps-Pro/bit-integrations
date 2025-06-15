<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitCode\FI\Core\Util\Hooks;
use BitCode\FI\Triggers\PaidMembershipPro\PaidMembershipProController;

Hooks::add('pmpro_after_change_membership_level', [PaidMembershipProController::class, 'perches_membershhip_level_by_administator'], 10, 3);
Hooks::add('pmpro_after_change_membership_level', [PaidMembershipProController::class, 'cancel_membershhip_level'], 10, 3);
Hooks::add('pmpro_after_checkout', [PaidMembershipProController::class, 'perches_membership_level'], 10, 2);
Hooks::add('pmpro_membership_post_membership_expiry', [PaidMembershipProController::class, 'expiry_membership_level'], 10, 2);
