<?php

if (!defined('ABSPATH')) {
    exit;
}

use BTCBI\Deps\BitApps\WPKit\Hooks\Hooks;
use BitApps\BTCBI\Http\Controllers\FlowController;
use BitApps\BTCBI\Http\Services\Triggers\ActionHook\ActionHookController;

global $wpdb;
$hook = $wpdb->get_results(
    $wpdb->prepare(
        "SELECT option_name
            FROM $wpdb->options
            WHERE option_name LIKE %s
            ORDER BY option_id DESC
            LIMIT 1",
        'btcbi_action_hook_test\_%'
    )
);

if (!empty($hook) && isset($hook[0]->option_name)) {
    Hooks::addAction(str_replace('btcbi_action_hook_test_', '', $hook[0]->option_name), [ActionHookController::class, 'actionHookHandler'], 10, PHP_INT_MAX);
}

$flowController = new FlowController();
$flows = $flowController->get(
    [
        'triggered_entity' => 'ActionHook',
        'status' => 1,
    ],
    ['triggered_entity_id']
);

if (!is_wp_error($flows)) {
    foreach ($flows as  $flow) {
        if (isset($flow->triggered_entity_id)) {
            Hooks::addAction($flow->triggered_entity_id, [ActionHookController::class, 'handle'], 10, PHP_INT_MAX);
        }
    }
}
