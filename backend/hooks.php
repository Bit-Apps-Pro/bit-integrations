<?php

// If try to direct access  plugin folder it will Exit

use BitApps\Integrations\Config;
use BitApps\Integrations\controller\AnalyticsController;
use BitApps\Integrations\Core\Util\Activation;
use BitApps\Integrations\Core\Util\Hooks;

if (!defined('ABSPATH')) {
    exit;
}

// Hooks::add('wp_insert_site', [Activation::class, 'handle_new_site'], 10, 1);
Hooks::add('wp_initialize_site', [Activation::class, 'handle_new_site'], 200, 1);

Hooks::filter(Config::VAR_PREFIX . 'telemetry_additional_data', [new AnalyticsController(), 'filterTrackingData']);
Hooks::filter(Config::VAR_PREFIX . 'telemetry_data', [new AnalyticsController(), 'filterProTrackingData']);

if (is_user_logged_in()) {
    // Add filter if the user is logged in to fetch the ID.
    Hooks::filter('wpcf7_verify_nonce', '__return_true');
}
