<?php
if (!defined('ABSPATH')) {
    exit;
}

use BitCode\FI\Core\Util\Hooks;
use BitCode\FI\Triggers\FluentBooking\FluentBookingController;

Hooks::add('fluent_booking/after_booking_scheduled', [FluentBookingController::class, 'handle_fluentBooking_submit'], 10, 3);
