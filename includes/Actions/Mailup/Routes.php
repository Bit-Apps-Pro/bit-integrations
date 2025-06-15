<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitCode\FI\Actions\Mailup\MailupController;
use BitCode\FI\Core\Util\Route;

Route::post('mailup_authorization', [MailupController::class, 'authorization']);
Route::post('mailup_fetch_all_list', [MailupController::class, 'getAllList']);
Route::post('mailup_fetch_all_group', [MailupController::class, 'getAllGroup']);
Route::post('mailup_fetch_all_field', [MailupController::class, 'getAllField']);
