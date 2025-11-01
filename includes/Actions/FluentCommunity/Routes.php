<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitCode\FI\Actions\FluentCommunity\FluentCommunityController;
use BitCode\FI\Core\Util\Route;

Route::post('fluent_community_authorize', [FluentCommunityController::class, 'fluentCommunityAuthorize']);
Route::post('refresh_fluent_community_lists', [FluentCommunityController::class, 'fluentCommunityLists']);
Route::post('refresh_fluent_community_courses', [FluentCommunityController::class, 'fluentCommunityCourses']);
Route::post('refresh_fluent_community_users', [FluentCommunityController::class, 'fluentCommunityUsers']);
