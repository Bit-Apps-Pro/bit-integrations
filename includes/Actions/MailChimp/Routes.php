<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitApps\BTCBI_FI\Actions\MailChimp\MailChimpController;
use BitApps\BTCBI_FI\Core\Util\Route;

Route::post('mChimp_generate_token', [MailChimpController::class, 'generateTokens']);
Route::post('mChimp_refresh_audience', [MailChimpController::class, 'refreshAudience']);
Route::post('mChimp_refresh_fields', [MailChimpController::class, 'refreshAudienceFields']);
Route::post('mChimp_refresh_tags', [MailChimpController::class, 'refreshTags']);
Route::post('mChimp_refresh_modules', [MailChimpController::class, 'refreshModules']);
