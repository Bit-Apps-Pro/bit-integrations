<?php
if (!defined('ABSPATH')) {
    exit;
}

use BitCode\FI\Core\Util\Hooks;
use BitCode\FI\Triggers\TutorLms\TutorLmsController;

Hooks::add('tutor_after_enroll', [TutorLmsController::class, 'handle_course_enroll'], 10, 2);
Hooks::add('tutor_quiz/attempt_ended', [TutorLmsController::class, 'handleQuizAttempt'], 10, 1);
Hooks::add('tutor_lesson_completed_after', [TutorLmsController::class, 'handleLessonComplete'], 10, 1);
Hooks::add('tutor_course_complete_after', [TutorLmsController::class, 'handleCourseComplete'], 10, 1);
Hooks::add('tutor_quiz/attempt_ended', [TutorLmsController::class, 'handleQuizTarget'], 10, 1);
