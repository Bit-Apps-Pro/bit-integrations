<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitCode\FI\Triggers\CustomTrigger\CustomTriggerController;
use BitCode\FI\Core\Util\Hooks;

Hooks::add('bit_integrations_custom_trigger', [CustomTriggerController::class, 'handleCustomTrigger'], 10, 2);
