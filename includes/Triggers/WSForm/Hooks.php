<?php
if (!defined('ABSPATH')) {
    exit;
}

use BitCode\FI\Core\Util\Hooks;
use BitCode\FI\Triggers\WSForm\WSFormController;

Hooks::add('ws_form_action_for_bi', [WSFormController::class, 'handle_ws_form_submit'], 9999, 4);
