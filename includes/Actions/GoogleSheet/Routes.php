<?php
if (!defined('ABSPATH')) {
    exit;
}

use BitCode\FI\Core\Util\Route;
use BitCode\FI\Actions\GoogleSheet\GoogleSheetController;

Route::post('gsheet_generate_token', [GoogleSheetController::class, 'generateTokens']);
Route::post('gsheet_refresh_spreadsheets', [GoogleSheetController::class, 'refreshSpreadsheetsAjaxHelper']);
Route::post('gsheet_refresh_worksheets', [GoogleSheetController::class, 'refreshWorksheetsAjaxHelper']);
Route::post('gsheet_refresh_worksheet_headers', [GoogleSheetController::class, 'refreshWorksheetHeadersAjaxHelper']);
