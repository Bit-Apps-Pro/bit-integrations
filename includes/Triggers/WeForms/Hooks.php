<?php
if (!defined('ABSPATH')) {
    exit;
}

use BitCode\FI\Core\Util\Hooks;
use BitCode\FI\Triggers\WeForms\WeFormsController;

Hooks::add('weforms_entry_submission', [WeFormsController::class, 'handle_weforms_submit'], 10, 4);
