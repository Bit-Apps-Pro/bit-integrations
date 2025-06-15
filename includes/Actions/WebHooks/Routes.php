<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitCode\FI\Actions\WebHooks\WebHooksController;
use BitCode\FI\Core\Util\Route;

Route::post('test_webhook', [WebHooksController::class, 'testWebhook']);
