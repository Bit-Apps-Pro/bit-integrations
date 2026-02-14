<?php

// If try to direct access  plugin folder it will Exit

if (!defined('ABSPATH')) {
    exit;
}
use BitApps\BTCBI_FI\Actions\ActionController;
use BitApps\BTCBI_FI\Core\Util\API as Route;
use BitApps\BTCBI_FI\Core\Util\Helper;
use BitApps\BTCBI_FI\Triggers\Webhook\WebhookController;

// use BitApps\BTCBI_FI\Triggers\Webhook\WebhookController;

Route::get('redirect/', [new ActionController(), 'handleRedirect'], null, ['state' => ['required' => true]]);

if (!Helper::isProActivate()) {
    Route::match(['get', 'post'], 'callback/(?P<hook_id>[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})', [new WebhookController(), 'handle'], null, ['hook_id' => ['required' => true, 'validate_callback' => 'wp_is_uuid']]);
}
