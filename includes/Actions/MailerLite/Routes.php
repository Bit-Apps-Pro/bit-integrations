<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitCode\FI\Actions\MailerLite\MailerLiteController;
use BitCode\FI\Core\Util\Route;

Route::post('mailerlite_fetch_all_groups', [MailerLiteController::class, 'fetchAllGroups']);
Route::post('mailerlite_refresh_fields', [MailerLiteController::class, 'mailerliteRefreshFields']);
