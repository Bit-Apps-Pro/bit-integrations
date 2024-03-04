<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitApps\BTCBI\Http\Services\Actions\MoxieCRM\MoxieCRMController;
use BTCBI\Deps\BitApps\WPKit\Http\Router\Route;

Route::post('moxiecrm_authentication', [MoxieCRMController::class, 'authentication']);
// Route::post('moxiecrm_fetch_custom_fields', [MoxieCRMController::class, 'getCustomFields']);
Route::post('moxiecrm_fetch_all_opportunities', [MoxieCRMController::class, 'getAllOpportunities']);
Route::post('moxiecrm_fetch_all_clients', [MoxieCRMController::class, 'getAllClients']);
Route::post('moxiecrm_fetch_all_pipelineStages', [MoxieCRMController::class, 'getAllPipelineStages']);
Route::post('moxiecrm_fetch_all_CRMPeoples', [MoxieCRMController::class, 'getAllCRMPeoples']);
Route::post('moxiecrm_fetch_all_CRMPipelines', [MoxieCRMController::class, 'getAllCRMPipelines']);