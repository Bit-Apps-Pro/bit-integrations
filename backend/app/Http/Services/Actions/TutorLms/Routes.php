<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitApps\BTCBI\Http\Services\Actions\TutorLms\TutorLmsController;
use BTCBI\Deps\BitApps\WPKit\Http\Router\Route;

Route::post('tutor_authorize', [TutorLmsController::class, 'TutorAuthorize']);
Route::get('tutor_all_course', [TutorLmsController::class, 'getAllCourse']);
Route::get('tutor_all_lesson', [TutorLmsController::class, 'getAllLesson']);
