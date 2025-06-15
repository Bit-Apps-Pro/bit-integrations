<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitCode\FI\Core\Util\Hooks;
use BitCode\FI\Triggers\Happy\HappyController;

Hooks::add('happyforms_submission_success', [HappyController::class, 'handle_happy_submit'], 10, 3);
