<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitCode\FI\Actions\Acumbamail\AcumbamailController;
use BitCode\FI\Core\Util\Route;

Route::post('acumbamail_authorization_and_fetch_subscriber_list', [AcumbamailController::class, 'acumbamailAuthAndFetchSubscriberList']);
Route::post('acumbamail_fetch_all_list', [AcumbamailController::class, 'fetchAllLists']);
Route::post('acumbamail_refresh_fields', [AcumbamailController::class, 'acumbamailRefreshFields']);
