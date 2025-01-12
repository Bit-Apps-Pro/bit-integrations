<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitCode\FI\Actions\ZohoCRM\ZohoCRMController;
use BitCode\FI\Core\Util\Route;

Route::post('zcrm_get_users', [ZohoCRMController::class, 'refreshUsersAjaxHelper']);
Route::post('zcrm_get_tags', [ZohoCRMController::class, 'refreshTagListAjaxHelper']);
Route::post('zcrm_get_assignment_rules', [ZohoCRMController::class, 'getAssignmentRulesAjaxHelper']);
Route::post('zcrm_get_related_lists', [ZohoCRMController::class, 'getRelatedListsAjaxHelper']);
Route::post('zcrm_generate_token', [ZohoCRMController::class, 'generateTokens']);
Route::post('zcrm_refresh_modules', [ZohoCRMController::class, 'refreshModulesAjaxHelper']);
Route::post('zcrm_refresh_layouts', [ZohoCRMController::class, 'refreshLayoutsAjaxHelper']);
Route::post('zcrm_get_user_details', [ZohoCRMController::class, 'getUserDetails']);

// Rapidmail
// Route::post('rapidmail_authorization', [RapidmailController::class, 'checkAuthorization']);
