<?php
if (!defined('ABSPATH')) {
    exit;
}

use BitCode\FI\Core\Util\Hooks;
use BitCode\FI\Triggers\RestrictContent\RestrictContentController;

Hooks::add('rcp_membership_post_activate', [RestrictContentController::class, 'purchasesMembershipLevel'], 10, 2);
Hooks::add('rcp_transition_membership_status_cancelled', [RestrictContentController::class, 'membershipStatusCancelled'], 10, 2);
Hooks::add('rcp_transition_membership_status_expired', [RestrictContentController::class, 'membershipStatusExpired'], 10, 2);
