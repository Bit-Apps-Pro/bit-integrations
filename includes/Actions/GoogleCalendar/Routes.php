<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitCode\FI\Actions\GoogleCalendar\GoogleCalendarController;
use BitCode\FI\Core\Util\Route;

Route::post('googleCalendar_authorization', [GoogleCalendarController::class, 'authorization']);
Route::post('googleCalendar_get_all_lists', [GoogleCalendarController::class, 'getAllCalendarLists']);
