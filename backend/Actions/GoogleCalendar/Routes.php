<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitApps\Integrations\Actions\GoogleCalendar\GoogleCalendarController;
use BitApps\Integrations\Core\Util\Route;

Route::no_sanitize()->post('googleCalendar_authorization', [GoogleCalendarController::class, 'authorization']);
Route::post('googleCalendar_get_all_lists', [GoogleCalendarController::class, 'getAllCalendarLists']);
