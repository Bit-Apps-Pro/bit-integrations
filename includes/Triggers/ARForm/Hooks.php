<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitCode\FI\Core\Util\Hooks;
use BitCode\FI\Triggers\ARForm\ARFormController;

Hooks::add('arfliteentryexecute', [ARFormController::class, 'handleArFormSubmit'], 10, 4);
Hooks::add('arfentryexecute', [ARFormController::class, 'handleArFormSubmit'], 10, 4);
