<?php

/***
 * If try to direct access  plugin folder it will Exit
 **/

use BitCode\FI\Core\Util\Activation;
use BitCode\FI\Core\Util\Hooks;

if (!defined('ABSPATH')) {
    exit;
}

// Hooks::add('wp_insert_site', [Activation::class, 'handle_new_site'], 10, 1);
Hooks::add('wp_initialize_site', [Activation::class, 'handle_new_site'], 200, 1);
