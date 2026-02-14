<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitApps\BTCBI_FI\Actions\MailerPress\MailerPressController;
use BitApps\BTCBI_FI\Core\Util\Route;

Route::post('mailer_press_authorize', [MailerPressController::class, 'mailerPressAuthorize']);
Route::post('refresh_mailer_press_lists', [MailerPressController::class, 'refreshLists']);
Route::post('refresh_mailer_press_tags', [MailerPressController::class, 'refreshTags']);
