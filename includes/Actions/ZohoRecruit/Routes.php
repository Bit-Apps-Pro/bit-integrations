<?php
if (!defined('ABSPATH')) {
    exit;
}

use BitCode\FI\Core\Util\Route;
use BitCode\FI\Actions\ZohoRecruit\ZohoRecruitController;

Route::post('zrecruit_refresh_users', [ZohoRecruitController::class, 'refreshUsers']);
Route::post('zrecruit_refresh_modules', [ZohoRecruitController::class, 'refreshModules']);
Route::post('zrecruit_refresh_notetypes', [ZohoRecruitController::class, 'refreshNoteTypes']);
Route::post('zrecruit_refresh_related_lists', [ZohoRecruitController::class, 'refreshRelatedModules']);
Route::post('zrecruit_get_fields', [ZohoRecruitController::class, 'getFields']);
