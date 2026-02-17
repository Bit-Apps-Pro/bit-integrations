<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitApps\Integrations\Actions\KirimEmail\KirimEmailController;
use BitApps\Integrations\Core\Util\Route;

Route::post('kirimEmail_authorization', [KirimEmailController::class, 'checkAuthorization']);
Route::post('kirimEmail_fetch_all_list', [KirimEmailController::class, 'getAllList']);
