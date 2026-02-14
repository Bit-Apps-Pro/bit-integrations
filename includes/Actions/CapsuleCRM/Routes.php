<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitApps\BTCBI_FI\Actions\CapsuleCRM\CapsuleCRMController;
use BitApps\BTCBI_FI\Core\Util\Route;

Route::post('capsulecrm_authentication', [CapsuleCRMController::class, 'authentication']);
Route::post('capsulecrm_fetch_custom_fields', [CapsuleCRMController::class, 'getCustomFields']);
Route::post('capsulecrm_fetch_all_opportunities', [CapsuleCRMController::class, 'getAllOpportunities']);
Route::post('capsulecrm_fetch_all_owners', [CapsuleCRMController::class, 'getAllOwners']);
Route::post('capsulecrm_fetch_all_teams', [CapsuleCRMController::class, 'getAllTeams']);
Route::post('capsulecrm_fetch_all_currencies', [CapsuleCRMController::class, 'getAllCurrencies']);
Route::post('capsulecrm_fetch_all_CRMParties', [CapsuleCRMController::class, 'getAllCRMParties']);
Route::post('capsulecrm_fetch_all_CRMMilestones', [CapsuleCRMController::class, 'getAllCRMMilestones']);
