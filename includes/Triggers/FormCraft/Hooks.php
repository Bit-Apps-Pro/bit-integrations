<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitCode\FI\Core\Util\Hooks;
use BitCode\FI\Triggers\FormCraft\FormCraftController;

Hooks::add('formcraft_after_save', [FormCraftController::class, 'handle_formcraft_submit'], 10, 4);
