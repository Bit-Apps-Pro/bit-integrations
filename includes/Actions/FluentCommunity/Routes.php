<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitCode\FI\Actions\FluentCommunity\FluentCommunityController;
use BitCode\FI\Core\Util\Route;

Route::post('fluent_community_authorize', [FluentCommunityController::class, 'fluentCommunityAuthorize']);
Route::post('refresh_fluent_community_lists', [FluentCommunityController::class, 'fluentCommunityLists']);
Route::post('fluent_community_headers', [FluentCommunityController::class, 'fluentCommunityFields']);
Route::post('fluent_community_get_all_company', [FluentCommunityController::class, 'getAllCompany']);
Route::post('fluent_community_member_roles', [FluentCommunityController::class, 'getMemberRoles']);
Route::post('refresh_fluent_community_courses', [FluentCommunityController::class, 'fluentCommunityCourses']);
Route::post('refresh_fluent_community_users', [FluentCommunityController::class, 'fluentCommunityUsers']);
