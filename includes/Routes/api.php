<?php
// If try to direct access  plugin folder it will Exit

if (!defined('ABSPATH')) {
    exit;
}
use BitCode\FI\Actions\ActionController;
use BitCode\FI\Core\Util\API as Route;

// use BitCode\FI\Triggers\Webhook\WebhookController;

Route::get('redirect/', [new ActionController(), 'handleRedirect'], null, ['state' => ['required' => true]]);
