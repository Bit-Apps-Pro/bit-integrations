<?php
/***
 * If try to direct access  plugin folder it will Exit
 **/

if (!defined('ABSPATH')) {
    exit;
}
use BitApps\BTCBI_PRO\Actions\ActionController;
use BitApps\BTCBI_PRO\Core\Util\API as Route;
use BitApps\BTCBI_PRO\Triggers\Webhook\WebhookController;

Route::get('redirect/', [new ActionController(), 'handleRedirect'], null, ['state' => ['required' => true]]);
Route::match(['get', 'post'], 'callback/(?P<hook_id>[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})', [new WebhookController(), 'handle'], null, ['hook_id' => ['required' => true, 'validate_callback' => 'wp_is_uuid']]);
