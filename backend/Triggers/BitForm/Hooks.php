<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitApps\Integrations\Core\Util\Hooks;
use BitApps\Integrations\Triggers\BitForm\BitFormController;

Hooks::add('bitform_submit_success', [BitFormController::class, 'handle_bitform_submit'], 10, 4);
