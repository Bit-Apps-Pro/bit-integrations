<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitApps\Integrations\Actions\MailerPress\MailerPressController;
use BitApps\Integrations\Core\Util\Route;

Route::post('mailer_press_authorize', [MailerPressController::class, 'mailerPressAuthorize']);
Route::post('refresh_mailer_press_lists', [MailerPressController::class, 'refreshLists']);
Route::post('refresh_mailer_press_tags', [MailerPressController::class, 'refreshTags']);
