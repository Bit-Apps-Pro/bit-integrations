<?php
if (!defined('ABSPATH')) {
    exit;
}


use BitCode\FI\Core\Util\Hooks;
use BitCode\FI\Triggers\NF\NFController;

Hooks::add('ninja_forms_after_submission', [NFController::class, 'ninja_forms_after_submission'], 10, 1);
