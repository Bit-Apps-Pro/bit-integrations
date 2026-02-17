<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitApps\Integrations\Core\Util\Helper;
use BitApps\Integrations\Core\Util\Hooks;
use BitApps\Integrations\Core\Util\StoreInCache;
use BitApps\Integrations\Triggers\FallbackTrigger\FallbackHooks;
use BitApps\Integrations\Triggers\FallbackTrigger\FallbackTriggerController;

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
