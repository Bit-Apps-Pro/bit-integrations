<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitCode\FI\Core\Util\Hooks;
use BitCode\FI\Triggers\JetEngine\JetEngineController;

Hooks::add('updated_post_meta', [JetEngineController::class, 'post_meta_data'], 10, 4);
Hooks::add('updated_post_meta', [JetEngineController::class, 'post_meta_value_check'], 10, 4);
