<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitCode\FI\Actions\Mailjet\MailjetController;
use BitCode\FI\Core\Util\Route;

Route::post('mailjet_authentication', [MailjetController::class, 'authentication']);
Route::post('mailjet_fetch_all_custom_fields', [MailjetController::class, 'getCustomFields']);
