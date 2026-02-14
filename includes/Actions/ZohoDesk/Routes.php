<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitApps\BTCBI_FI\Actions\ZohoDesk\ZohoDeskController;
use BitApps\BTCBI_FI\Core\Util\Route;

Route::post('zdesk_generate_token', [ZohoDeskController::class, 'generateTokens']);
Route::post('zdesk_refresh_organizations', [ZohoDeskController::class, 'refreshOrganizations']);
Route::post('zdesk_refresh_departments', [ZohoDeskController::class, 'refreshDepartments']);
Route::post('zdesk_refresh_fields', [ZohoDeskController::class, 'refreshFields']);
Route::post('zdesk_refresh_owners', [ZohoDeskController::class, 'refreshTicketOwners']);
Route::post('zdesk_refresh_products', [ZohoDeskController::class, 'refreshProducts']);
