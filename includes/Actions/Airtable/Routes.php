<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitCode\FI\Actions\Airtable\AirtableController;
use BitCode\FI\Core\Util\Route;

Route::post('airtable_authentication', [AirtableController::class, 'authentication']);
Route::post('airtable_fetch_all_tables', [AirtableController::class, 'getAllTables']);
Route::post('airtable_fetch_all_fields', [AirtableController::class, 'getAllFields']);
