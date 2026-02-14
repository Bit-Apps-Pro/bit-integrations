<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitApps\BTCBI_FI\Actions\Zendesk\ZendeskController;
use BitApps\BTCBI_FI\Core\Util\Route;

Route::post('zendesk_authentication', [ZendeskController::class, 'authentication']);
Route::post('zendesk_fetch_custom_fields', [ZendeskController::class, 'getCustomFields']);
Route::post('zendesk_fetch_all_leads', [ZendeskController::class, 'getAllLeads']);
Route::post('zendesk_fetch_all_parentOrganizations', [ZendeskController::class, 'getAllParentOrganizations']);
Route::post('zendesk_fetch_all_teams', [ZendeskController::class, 'getAllTeams']);
Route::post('zendesk_fetch_all_currencies', [ZendeskController::class, 'getAllCurrencies']);
Route::post('zendesk_fetch_all_stages', [ZendeskController::class, 'getAllStages']);
Route::post('zendesk_fetch_all_CRMCompanies', [ZendeskController::class, 'getAllCRMCompanies']);
Route::post('zendesk_fetch_all_CRMContacts', [ZendeskController::class, 'getAllCRMContacts']);
Route::post('zendesk_fetch_all_CRMSources', [ZendeskController::class, 'getAllCRMSources']);
