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
    $btcbi_entities = StoreInCache::getFallbackFlowEntities() ?? [];

    if (!empty($btcbi_entities)) {
        foreach (FallbackHooks::$triggerHookList as $btcbi_trigger) {
            if (isset($btcbi_entities[$btcbi_trigger['entity']])) {
                $btcbi_hookFunction = $btcbi_trigger['isFilterHook'] ? 'filter' : 'add';

                Hooks::$btcbi_hookFunction($btcbi_trigger['hook'], [FallbackTriggerController::class, 'triggerFallbackHandler'], $btcbi_trigger['priority'], PHP_INT_MAX);
            }
        }
    }
}
