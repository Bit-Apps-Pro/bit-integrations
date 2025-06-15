<?php
/***
 * If try to direct access  plugin folder it will Exit
 **/

if (!defined('ABSPATH')) {
    exit;
}
use BitCode\FI\Actions\ActionController;
use BitCode\FI\Core\Util\API as Route;
use BitCode\FI\Triggers\Webhook\WebhookController;

Route::get('redirect/', [new ActionController(), 'handleRedirect'], null, ['state'=> ['required'=> true]]);
Route::match(['get', 'post'], 'callback/(?P<hook_id>[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})', [new WebhookController(), 'handle'], null, ['hook_id'=> ['required'=> true, 'validate_callback' => 'wp_is_uuid']]);