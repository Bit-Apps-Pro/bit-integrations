<?php
if (!defined('ABSPATH')) {
    exit;
}

use BitCode\FI\Core\Util\Hooks;
use BitCode\FI\Triggers\Met\MetController;

Hooks::add('metform_pro_form_data_for_pro_integrations', [MetController::class, 'handle_metform_pro_submit'], 10, 3);
Hooks::add('metform_after_store_form_data', [MetController::class, 'handle_metform_submit'], 10, 3);
