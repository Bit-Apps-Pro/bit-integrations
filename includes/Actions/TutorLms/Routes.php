<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitCode\FI\Actions\TutorLms\TutorLmsController;
use BitCode\FI\Core\Util\Route;

Route::post('tutor_authorize', [TutorLmsController::class, 'TutorAuthorize']);
Route::get('tutor_all_course', [TutorLmsController::class, 'getAllCourse']);
Route::get('tutor_all_lesson', [TutorLmsController::class, 'getAllLesson']);
