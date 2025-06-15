<?php
if (!defined('ABSPATH')) {
    exit;
}

use BitCode\FI\Core\Util\Hooks;
use BitCode\FI\Triggers\Formidable\FormidableController;

Hooks::add('frm_success_action', [FormidableController::class, 'handle_formidable_submit'], 10, 5);
