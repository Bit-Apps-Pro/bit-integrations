<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitCode\BTCBI\Util\Hooks;
use BitCode\BTCBI\Http\Services\Triggers\BitForm\BitFormController;

Hooks::add('bitform_submit_success', [BitFormController::class, 'handle_bitform_submit'], 10, 3);
