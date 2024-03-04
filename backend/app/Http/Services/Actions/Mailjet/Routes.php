<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitApps\BTCBI\Http\Services\Actions\Mailjet\MailjetController;
use BTCBI\Deps\BitApps\WPKit\Http\Router\Route;

Route::post('mailjet_authentication', [MailjetController::class, 'authentication']);
Route::post('mailjet_fetch_all_custom_fields', [MailjetController::class, 'getCustomFields']);