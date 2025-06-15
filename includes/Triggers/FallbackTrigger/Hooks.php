<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitCode\FI\Core\Util\Hooks;
use BitCode\FI\Core\Util\Helper;
use BitCode\FI\Core\Util\StoreInCache;
use BitCode\FI\Triggers\FallbackTrigger\FallbackHooks;
use BitCode\FI\Triggers\FallbackTrigger\FallbackTriggerController;

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
