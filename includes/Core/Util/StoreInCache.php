<?php
namespace BitCode\FI\Core\Util;

use BitCode\FI\Flow\FlowController;

class StoreInCache
{
    public static function getActiveFlow()
    {
        $integrationHandler = new FlowController();
        $integrations = $integrationHandler->get(
            ['status' => 1],
            [
                'triggered_entity',
                'status',
            ]
        );
        if (empty($integrations) || !is_array($integrations)) {
            return false;
        }
        foreach ($integrations as $integration) {
            $activeFlowTrigger[] = $integration->triggered_entity;
        }
        $activeTriggerLists = array_unique($activeFlowTrigger);
        self::setTransient('activeCurrentTrigger', $activeTriggerLists, DAY_IN_SECONDS);
        return $activeTriggerLists;
    }

    public static function setTransient($key, $value, $expiration)
    {
        if (empty($key) || empty($value)) {
            return false;
        }
        set_transient($key, $value, $expiration);
    }

    public static function getTransientData($key)
    {
        if (empty($key)) {
            return false;
        }
        $transientData = get_transient($key);
        if (empty($transientData)) {
            return false;
        }
        return $transientData;
    }
}
