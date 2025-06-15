<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitCode\FI\Core\Util\Hooks;
use BitCode\FI\Triggers\UltimateMember\UltimateMemberController;


Hooks::add('um_user_login', [UltimateMemberController::class, 'handleUserLogViaForm'], 9, 1);
Hooks::add('um_registration_complete', [UltimateMemberController::class, 'handleUserRegisViaForm'], 10, 2);
Hooks::add('set_user_role', [UltimateMemberController::class, 'handleUserRoleChange'], 10, 3);
Hooks::add('set_user_role', [UltimateMemberController::class, 'handleUserSpecificRoleChange'], 10, 3);
