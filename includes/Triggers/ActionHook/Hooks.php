<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitApps\BTCBI_FI\Core\Util\Helper;
use BitApps\BTCBI_FI\Core\Util\Hooks;
use BitApps\BTCBI_FI\Core\Util\StoreInCache;
use BitApps\BTCBI_FI\Triggers\ActionHook\ActionHookController;

if (!Helper::isProActivate()) {
    $btcbi_flows = StoreInCache::getActionHookFlows() ?? [];

    foreach ($btcbi_flows as $btcbi_flow) {
        if (isset($btcbi_flow->triggered_entity_id)) {
            Hooks::add($btcbi_flow->triggered_entity_id, [ActionHookController::class, 'handle'], 10, PHP_INT_MAX);
        }
    }
}
