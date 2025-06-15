<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitCode\FI\Core\Util\Helper;
use BitCode\FI\Core\Util\Hooks;
use BitCode\FI\Core\Util\StoreInCache;
use BitCode\FI\Triggers\ActionHook\ActionHookController;

if (!Helper::isProActivate()) {
    $flows = StoreInCache::getActionHookFlows() ?? [];

    foreach ($flows as $flow) {
        if (isset($flow->triggered_entity_id)) {
            Hooks::add($flow->triggered_entity_id, [ActionHookController::class, 'handle'], 10, PHP_INT_MAX);
        }
    }
}
