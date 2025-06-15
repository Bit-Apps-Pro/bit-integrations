<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitCode\FI\Core\Util\Hooks;
use BitCode\FI\Triggers\EssentialBlocks\EssentialBlocksController;

Hooks::add('eb_form_submit_before_email', [EssentialBlocksController::class, 'essentialBlocksHandler'], 10, PHP_INT_MAX);
