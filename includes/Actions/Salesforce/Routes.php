<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitCode\FI\Core\Util\Route;
use BitCode\FI\Actions\Salesforce\SalesforceController;

Route::post('selesforce_generate_token', [SalesforceController::class, 'generateTokens']);
Route::post('selesforce_campaign_list', [SalesforceController::class, 'selesforceCampaignList']);
Route::post('selesforce_lead_list', [SalesforceController::class, 'selesforceLeadList']);
Route::post('selesforce_contact_list', [SalesforceController::class, 'selesforceContactList']);
Route::post('selesforce_custom_field', [SalesforceController::class, 'customFields']);

Route::post('selesforce_account_list', [SalesforceController::class, 'selesforceAccountList']);
