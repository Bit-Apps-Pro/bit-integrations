<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitApps\BTCBI_FI\Actions\KirimEmail\KirimEmailController;
use BitApps\BTCBI_FI\Core\Util\Route;

Route::post('kirimEmail_authorization', [KirimEmailController::class, 'checkAuthorization']);
Route::post('kirimEmail_fetch_all_list', [KirimEmailController::class, 'getAllList']);
