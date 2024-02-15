<?php
if (!defined('ABSPATH')) {
    exit;
}

use BitCode\BTCBI\Actions\GetResponse\GetResponseController;
use BitCode\BTCBI\Core\Util\Route;

Route::post('getresponse_fetch_all_tags', [GetResponseController::class, 'fetchAllTags']);
Route::post('getresponse_authentication', [GetResponseController::class, 'authentication']);
Route::post('getresponse_fetch_all_list', [GetResponseController::class, 'fetchAllList']);
Route::post('getresponse_fetch_custom_fields', [GetResponseController::class, 'fetchCustomFields']);
