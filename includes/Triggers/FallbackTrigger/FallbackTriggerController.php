<?php

namespace BitCode\FI\Triggers\FallbackTrigger;

use BitCode\FI\Flow\Flow;

class FallbackTriggerController
{
    public static function triggerFallbackHandler(...$args)
    {
        $hook = FallbackHooks::$triggerHookList[current_action()];

        if (empty($hook)) {
            return;
        }

        $dynamicFunc = $hook['function'];
        $flowData = TriggerFallback::$dynamicFunc(...$args);

        if (!empty($flowData) && !empty($flowData['triggered_entity'])) {
            Flow::execute($flowData['triggered_entity'], $flowData['triggered_entity_id'], $flowData['data'], \is_array($flowData['flows']) ? $flowData['flows'] : [$flowData['flows']]);
        }

        if ($hook['isFilterHook'] && isset($flowData['content'])) {
            return $flowData['content'] ?? $flowData;
        }
    }
}
