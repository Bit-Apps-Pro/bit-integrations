<?php
if (!defined('ABSPATH')) {
    exit;
}


use BitCode\FI\Core\Util\Hooks;
use BitCode\FI\Triggers\EVF\EVFController;

// Hooks::add('ipt_fsqm_hook_save_insert', [EVFController::class, 'handleSubmission'], 10, 1);
Hooks::add('everest_forms_complete_entry_save', [EVFController::class, 'handleSubmission'], 10, 5);
