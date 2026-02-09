<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitCode\FI\Actions\UserRegistrationMembership\UserRegistrationMembershipController;
use BitCode\FI\Core\Util\Route;

Route::post('user_registration_authorize', [UserRegistrationMembershipController::class, 'userRegistrationAuthorize']);
Route::post('refresh_user_registration_forms', [UserRegistrationMembershipController::class, 'refreshForms']);
Route::post('refresh_user_registration_form_fields', [UserRegistrationMembershipController::class, 'refreshFormFields']);
