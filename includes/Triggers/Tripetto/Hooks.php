<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitCode\FI\Core\Util\Hooks;
use BitCode\FI\Triggers\Tripetto\TripettoController;

Hooks::add('tripetto_submit', [TripettoController::class, 'handleTripettoSubmit'], 10, 2);
