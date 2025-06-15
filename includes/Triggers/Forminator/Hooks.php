<?php
if (!defined('ABSPATH')) {
    exit;
}

use BitCode\FI\Core\Util\Hooks;
use BitCode\FI\Triggers\Forminator\ForminatorController;

Hooks::add('forminator_custom_form_submit_before_set_fields', [ForminatorController::class, 'handle_forminator_submit'], 10, 3);
