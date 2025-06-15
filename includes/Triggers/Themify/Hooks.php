<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitCode\FI\Core\Util\Hooks;
use BitCode\FI\Triggers\Themify\ThemifyController;

// Hooks::add('wp_ajax_tb_signup_process', [ThemifyController::class, 'handle_themify_submit']);

Hooks::add('themify_builder_after_template_content_render', [ThemifyController::class, 'handle_themify_submit']);
