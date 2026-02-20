<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitApps\Integrations\Actions\WebHooks\WebHooksController;
use BitApps\Integrations\Core\Util\Route;

Route::post('test_webhook', [WebHooksController::class, 'testWebhook']);
