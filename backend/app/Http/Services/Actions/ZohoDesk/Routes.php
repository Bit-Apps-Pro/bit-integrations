<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitApps\BTCBI\Http\Services\Actions\ZohoDesk\ZohoDeskController;
use BTCBI\Deps\BitApps\WPKit\Http\Router\Route;

Route::post('zdesk_generate_token', [ZohoDeskController::class, 'generateTokens']);
Route::post('zdesk_refresh_organizations', [ZohoDeskController::class, 'refreshOrganizations']);
Route::post('zdesk_refresh_departments', [ZohoDeskController::class, 'refreshDepartments']);
Route::post('zdesk_refresh_fields', [ZohoDeskController::class, 'refreshFields']);
Route::post('zdesk_refresh_owners', [ZohoDeskController::class, 'refreshTicketOwners']);
Route::post('zdesk_refresh_products', [ZohoDeskController::class, 'refreshProducts']);
