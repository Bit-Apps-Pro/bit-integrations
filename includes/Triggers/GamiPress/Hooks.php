<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitCode\FI\Core\Util\Hooks;
use BitCode\FI\Triggers\GamiPress\GamiPressController;

Hooks::add('gamipress_update_user_rank', [GamiPressController::class, 'handle_user_earn_rank'], 10, 5);
Hooks::add('gamipress_award_achievement', [GamiPressController::class, 'handle_award_achievement'], 10, 5);
Hooks::add('gamipress_award_achievement', [GamiPressController::class, 'handle_gain_achievement_type'], 10, 5);
Hooks::add('gamipress_revoke_achievement_to_user', [GamiPressController::class, 'handle_revoke_achieve'], 10, 3);
Hooks::add('gamipress_update_user_points', [GamiPressController::class, 'handle_earn_points'], 10, 8);
// Hooks::add('gamipress_expirations_earning_expired', [GamiPressController::class, 'handle_expirations_earning'], 10, 4);
