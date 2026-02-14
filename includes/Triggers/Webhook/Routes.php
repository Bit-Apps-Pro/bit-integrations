<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitApps\BTCBI_FI\Core\Util\Helper;
use BitApps\BTCBI_FI\Core\Util\Route;
use BitApps\BTCBI_FI\Triggers\Webhook\WebhookController;

if (!Helper::isProActivate()) {
    Route::get('webhook/new', [WebhookController::class, 'getNewHook']);
    Route::post('webhook/test', [WebhookController::class, 'getTestData']);
    Route::post('webhook/test/remove', [WebhookController::class, 'removeTestData']);
}
