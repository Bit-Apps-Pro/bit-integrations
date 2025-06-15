<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitCode\FI\Core\Util\Hooks;
use BitCode\FI\Triggers\BitForm\BitFormController;

Hooks::add('bitform_submit_success', [BitFormController::class, 'handle_bitform_submit'], 10, 3);
