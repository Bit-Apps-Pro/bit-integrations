<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitApps\BTCBI_FI\Actions\TheEventsCalendar\TheEventsCalendarController;
use BitApps\BTCBI_FI\Core\Util\Route;

Route::post('the_events_calendar_authentication', [TheEventsCalendarController::class, 'authentication']);
Route::post('get_the_events_calendar_events', [TheEventsCalendarController::class, 'getAllEvents']);
