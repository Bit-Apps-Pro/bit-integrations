<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitApps\BTCBI_FI\Core\Util\Helper;
use BitApps\BTCBI_FI\Core\Util\Hooks;
use BitApps\BTCBI_FI\Core\Util\StoreInCache;
use BitApps\BTCBI_FI\Triggers\FallbackTrigger\FallbackHooks;
use BitApps\BTCBI_FI\Triggers\FallbackTrigger\FallbackTriggerController;

if (!Helper::isProActivate()) {
    $entities = StoreInCache::getFallbackFlowEntities() ?? [];

    if (!empty($entities)) {
        foreach (FallbackHooks::$triggerHookList as $trigger) {
            if (isset($entities[$trigger['entity']])) {
                $hookFunction = $trigger['isFilterHook'] ? 'filter' : 'add';

                Hooks::$hookFunction($trigger['hook'], [FallbackTriggerController::class, 'triggerFallbackHandler'], $trigger['priority'], PHP_INT_MAX);
            }
        }
    }
}
