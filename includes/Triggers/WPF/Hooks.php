<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitApps\BTCBI_FI\Core\Util\Hooks;
use BitApps\BTCBI_FI\Core\Util\Request;
use BitApps\BTCBI_FI\Triggers\WPF\WPFController;

if (Request::Check('frontend')) {
    Hooks::add('wpforms_process_complete', [WPFController::class, 'wpforms_process_complete'], 9999, 4);
}
