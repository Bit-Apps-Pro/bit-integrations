<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitApps\BTCBI\Util\Hooks;
use BitApps\BTCBI\Http\Services\Triggers\Registration\RegistrationController;

//* User Register HOOK*//
Hooks::add('user_register', [RegistrationController::class, 'userCreate'], 10, 2);
//* User Register HOOK*//

//* User Profile Update HOOK*//
Hooks::add('profile_update', [RegistrationController::class, 'profileUpdate'], 10, 3);
Hooks::add('wp_login', [RegistrationController::class, 'wpLogin'], 10, 2);
Hooks::add('password_reset', [RegistrationController::class, 'wpResetPassword'], 10, 1);
Hooks::add('delete_user', [RegistrationController::class, 'wpUserDeleted'], 10, 3);