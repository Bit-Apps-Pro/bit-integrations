<?php
if (!defined('ABSPATH')) {
    exit;
}

use BitCode\FI\Core\Util\Hooks;
use BitCode\FI\Triggers\Beaver\BeaverController;

Hooks::add('fl_module_contact_form_after_send', [BeaverController::class, 'beaver_contact_form_submitted'], 10, 6);
Hooks::add('fl_builder_login_form_submission_complete', [BeaverController::class, 'beaver_login_form_submitted'], 10, 5);
Hooks::add('fl_builder_subscribe_form_submission_complete', [BeaverController::class, 'beaver_subscribe_form_submitted'], 10, 6);
