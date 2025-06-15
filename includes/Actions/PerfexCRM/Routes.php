<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitCode\FI\Actions\PerfexCRM\PerfexCRMController;
use BitCode\FI\Core\Util\Route;

Route::post('perfexcrm_authentication', [PerfexCRMController::class, 'authentication']);
Route::post('perfexcrm_custom_fields', [PerfexCRMController::class, 'getCustomFields']);
Route::post('perfexcrm_fetch_all_customers', [PerfexCRMController::class, 'getAllCustomer']);
Route::post('perfexcrm_fetch_all_leads', [PerfexCRMController::class, 'getAllLead']);
Route::post('perfexcrm_fetch_all_staffs', [PerfexCRMController::class, 'getAllStaff']);
