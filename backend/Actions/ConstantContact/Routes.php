<?php
if (!defined('ABSPATH')) {
    exit;
}

use BitCode\BTCBI\Actions\ConstantContact\ConstantContactController;
use BitCode\BTCBI\Core\Util\Route;

Route::post('cContact_generate_token', [ConstantContactController::class, 'generateTokens']);
Route::post('cContact_refresh_list', [ConstantContactController::class, 'refreshList']);
Route::post('cContact_refresh_fields', [ConstantContactController::class, 'refreshListFields']);
Route::post('cContact_refresh_tags', [ConstantContactController::class, 'refreshTags']);
Route::post('cContact_custom_fields', [ConstantContactController::class, 'getCustomFields']);
