<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitApps\BTCBI_FI\Actions\MailerLite\MailerLiteController;
use BitApps\BTCBI_FI\Core\Util\Route;

Route::post('mailerlite_authorization', [MailerLiteController::class, 'authorization']);
Route::post('mailerlite_fetch_all_groups', [MailerLiteController::class, 'fetchAllGroups']);
Route::post('mailerlite_refresh_fields', [MailerLiteController::class, 'mailerliteRefreshFields']);
