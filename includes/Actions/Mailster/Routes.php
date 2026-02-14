<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitApps\BTCBI_FI\Actions\Mailster\MailsterController;
use BitApps\BTCBI_FI\Core\Util\Route;

Route::post('mailster_authentication', [MailsterController::class, 'authentication']);
Route::post('mailster_fields', [MailsterController::class, 'getMailsterFields']);
Route::post('mailster_lists', [MailsterController::class, 'getMailsterLists']);
Route::post('mailster_tags', [MailsterController::class, 'getMailsterTags']);
