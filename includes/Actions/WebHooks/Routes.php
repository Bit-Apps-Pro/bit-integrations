<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitApps\BTCBI_FI\Actions\WebHooks\WebHooksController;
use BitApps\BTCBI_FI\Core\Util\Route;

Route::post('test_webhook', [WebHooksController::class, 'testWebhook']);
