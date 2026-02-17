<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitApps\Integrations\Core\Util\Helper;
use BitApps\Integrations\Core\Util\Route;
use BitApps\Integrations\Triggers\Webhook\WebhookController;

if (!Helper::isProActivate()) {
    Route::get('webhook/new', [WebhookController::class, 'getNewHook']);
    Route::post('webhook/test', [WebhookController::class, 'getTestData']);
    Route::post('webhook/test/remove', [WebhookController::class, 'removeTestData']);
}
