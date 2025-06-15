<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitCode\FI\Actions\AcademyLms\AcademyLmsController;
use BitCode\FI\Core\Util\Route;

Route::post('academy_lms_authorize', [AcademyLmsController::class, 'Authorization']);
Route::get('academy_lms_all_course', [AcademyLmsController::class, 'getAllCourse']);
Route::get('academy_lms_all_lesson', [AcademyLmsController::class, 'getAllLesson']);
