<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitCode\FI\Core\Util\Hooks;
use BitCode\FI\Triggers\MasterStudyLms\MasterStudyLmsController;

Hooks::add('stm_lms_progress_updated', [MasterStudyLmsController::class, 'handleCourseComplete'], 10, 3);
Hooks::add('course_enrolled', [MasterStudyLmsController::class, 'handleCourseEnroll'], 10, 2);
Hooks::add('lesson_completed', [MasterStudyLmsController::class, 'handleLessonComplete'], 10, 2);
Hooks::add('stm_lms_quiz_passed', [MasterStudyLmsController::class, 'handleQuizComplete'], 10, 3);
Hooks::add('stm_lms_quiz_failed', [MasterStudyLmsController::class, 'handleQuizFailed'], 10, 3);
