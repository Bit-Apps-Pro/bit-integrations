<?php
if (!defined('ABSPATH')) {
    exit;
}

use BitCode\FI\Core\Util\Hooks;
use BitCode\FI\Triggers\Brizy\BrizyController;

Hooks::filter('brizy_form_submit_data', [BrizyController::class, 'handle_brizy_submit'], 10, 2);
