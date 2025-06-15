<?php
if (!defined('ABSPATH')) {
    exit;
}

use BitCode\FI\Core\Util\Hooks;
use BitCode\FI\Triggers\GF\GFController;

Hooks::add('gform_after_submission', [GFController::class, 'gform_after_submission'], 10, 2);
