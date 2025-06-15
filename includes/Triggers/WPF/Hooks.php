<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitCode\FI\Core\Util\Hooks;
use BitCode\FI\Core\Util\Request;
use BitCode\FI\Triggers\WPF\WPFController;

if (Request::Check('frontend')) {
    Hooks::add('wpforms_process_complete', [WPFController::class, 'wpforms_process_complete'], 9999, 4);
}
