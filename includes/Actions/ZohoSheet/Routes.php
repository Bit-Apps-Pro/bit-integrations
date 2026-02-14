<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitApps\BTCBI_FI\Actions\ZohoSheet\ZohoSheetController;
use BitApps\BTCBI_FI\Core\Util\Route;

Route::post('zohoSheet_generate_token', [ZohoSheetController::class, 'generateTokens']);
Route::post('zohoSheet_fetch_all_work_books', [ZohoSheetController::class, 'getAllWorkbooks']);
Route::post('zohoSheet_fetch_all_work_sheets', [ZohoSheetController::class, 'getAllWorksheets']);
Route::post('zohoSheet_fetch_all_work_sheet_header', [ZohoSheetController::class, 'getWorksheetHeader']);
