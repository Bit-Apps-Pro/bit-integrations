<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitCode\FI\Core\Util\Hooks;
use BitCode\FI\Triggers\Groundhogg\GroundhoggController;

// Hooks::add('groundhogg/db/post_insert/contact', [GroundhoggController::class, 'handle_groundhogg_submit'], 10, 2);
Hooks::add('groundhogg/contact/post_create', [GroundhoggController::class, 'handle_groundhogg_submit'], 10, 3);
Hooks::add('groundhogg/contact/tag_applied', [GroundhoggController::class, 'tagApplied'], 10, 2);
Hooks::add('groundhogg/contact/tag_removed', [GroundhoggController::class, 'tagRemove'], 10, 2);
