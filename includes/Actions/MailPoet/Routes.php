<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitApps\BTCBI_FI\Actions\MailPoet\MailPoetController;
use BitApps\BTCBI_FI\Core\Util\Route;

Route::post('mail_poet_authorize', [MailPoetController::class, 'mailPoetAuthorize']);
Route::post('refresh_news_letter', [MailPoetController::class, 'refreshNeswLetter']);
Route::post('mail_poet_list_headers', [MailPoetController::class, 'mailPoetListHeaders']);
