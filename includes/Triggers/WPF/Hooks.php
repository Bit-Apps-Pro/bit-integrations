<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitApps\Integrations\Core\Util\Hooks;
use BitApps\Integrations\Core\Util\Request;
use BitApps\Integrations\Triggers\WPF\WPFController;

if (Request::Check('frontend')) {
    Hooks::add('wpforms_process_complete', [WPFController::class, 'wpforms_process_complete'], 9999, 4);
}
