<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitApps\BTCBI_FI\Actions\FluentCrm\FluentCrmController;
use BitApps\BTCBI_FI\Core\Util\Route;

Route::post('fluent_crm_authorize', [FluentCrmController::class, 'fluentCrmAuthorize']);
Route::post('refresh_fluent_crm_lists', [FluentCrmController::class, 'fluentCrmLists']);
Route::post('refresh_fluent_crm_tags', [FluentCrmController::class, 'fluentCrmTags']);
Route::post('fluent_crm_headers', [FluentCrmController::class, 'fluentCrmFields']);
Route::post('fluent_crm_get_all_company', [FluentCrmController::class, 'getAllCompany']);
