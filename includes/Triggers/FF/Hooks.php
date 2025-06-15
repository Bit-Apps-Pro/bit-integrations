<?php
if (!defined('ABSPATH')) {
    exit;
}

use BitCode\FI\Core\Util\Hooks;
use BitCode\FI\Triggers\FF\FFController;

Hooks::add('fluentform_submission_inserted', [FFController::class, 'handle_ff_submit'], 10, 3);
