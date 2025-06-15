<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitCode\FI\Core\Util\Hooks;
use BitCode\FI\Triggers\ARMember\ARMemberController;

Hooks::add('arm_after_add_new_user', [ARMemberController::class, 'handleRegisterForm'], 10, 2);
Hooks::add('arm_member_update_meta', [ARMemberController::class, 'handleUpdateUserByForm'], 10, 2);
Hooks::add('arm_after_add_new_user', [ARMemberController::class, 'handleMemberAddByAdmin'], 10, 2);
Hooks::add('arm_cancel_subscription', [ARMemberController::class, 'handleCancelSubscription'], 10, 2);
// admin change user subscription plan run same function as cancel subscription
Hooks::add('arm_after_user_plan_change_by_admin', [ARMemberController::class, 'handlePlanChangeAdmin'], 10, 2);
// after renew subscription
Hooks::add('arm_after_user_plan_renew', [ARMemberController::class, 'handleRenewSubscriptionPlan'], 10, 2);
