<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitCode\FI\Actions\Rapidmail\RapidmailController;
use BitCode\FI\Core\Util\Route;

// Rapidmail
Route::post('rapidmail_authorization', [RapidmailController::class, 'checkAuthorization']);
Route::get('rapidmail_get_all_recipients', [RapidmailController::class, 'getAllRecipients']);
Route::get('rapidmail_get_all_fields', [RapidmailController::class, 'getAllFields']);
