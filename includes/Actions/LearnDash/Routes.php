<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitCode\FI\Actions\LearnDash\LearnDashController;
use BitCode\FI\Core\Util\Route;

Route::post('learnDash_authorize', [LearnDashController::class, 'authorizeRestrictContent']);
Route::post('learDash_fetch_all_course', [LearnDashController::class, 'getCourses']);
Route::post('learDash_fetch_all_group', [LearnDashController::class, 'learDashFetchAllGroup']);
Route::post('learDash_fetch_all_course_of_lesson', [LearnDashController::class, 'learDashFetchAllCourseOfLesson']);
Route::post('learDash_fetch_all_topic_of_lesson', [LearnDashController::class, 'getTopicsByLesson']);
Route::post('learDash_fetch_all_quiz', [LearnDashController::class, 'getQuizes']);
Route::post('learDash_fetch_all_course_unenroll', [LearnDashController::class, 'getCoursesUnenroll']);
