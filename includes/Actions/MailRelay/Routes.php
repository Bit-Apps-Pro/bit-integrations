<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitCode\FI\Actions\MailRelay\MailRelayController;
use BitCode\FI\Core\Util\Route;

Route::post('mailRelay_authentication', [MailRelayController::class, 'authentication']);
Route::post('mailRelay_fetch_all_groups', [MailRelayController::class, 'getAllGroups']);
