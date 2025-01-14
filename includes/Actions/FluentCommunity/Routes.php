<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitCode\FI\Actions\FluentCommunity\FluentCommunityController;
use BitCode\FI\Core\Util\Route;

Route::post('fluent_community_authorize', [FluentCommunityController::class, 'fluentCommunityAuthorize']);
Route::post('refresh_fluent_crm_lists', [FluentCommunityController::class, 'fluentCommunityLists']);
Route::post('refresh_fluent_crm_tags', [FluentCommunityController::class, 'fluentCommunityTags']);
Route::post('fluent_crm_headers', [FluentCommunityController::class, 'fluentCommunityFields']);
Route::post('fluent_crm_get_all_company', [FluentCommunityController::class, 'getAllCompany']);
