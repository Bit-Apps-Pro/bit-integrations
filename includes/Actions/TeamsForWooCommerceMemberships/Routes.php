<?php

if (!\defined('ABSPATH')) {
    exit;
}

use BitApps\BTCBI_FI\Actions\TeamsForWooCommerceMemberships\TeamsForWooCommerceMembershipsController;
use BitApps\BTCBI_FI\Core\Util\Route;

Route::post('teams_for_wc_memberships_authorize', [TeamsForWooCommerceMembershipsController::class, 'teamsForWooCommerceMembershipsAuthorize']);
Route::post('teams_for_wc_memberships_refresh_teams', [TeamsForWooCommerceMembershipsController::class, 'refreshTeams']);
Route::post('teams_for_wc_memberships_refresh_member_roles', [TeamsForWooCommerceMembershipsController::class, 'refreshMemberRoles']);
