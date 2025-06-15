<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitCode\FI\Core\Util\Hooks;
use BitCode\FI\Triggers\LifterLms\LifterLmsController;

Hooks::add('lifterlms_quiz_completed', [LifterLmsController::class, 'handleAttemptQuiz'], 10, 3);
Hooks::add('lifterlms_quiz_passed', [LifterLmsController::class, 'handleQuizPass'], 10, 3);
Hooks::add('lifterlms_quiz_failed', [LifterLmsController::class, 'handleQuizFail'], 10, 3);
Hooks::add('lifterlms_lesson_completed', [LifterLmsController::class, 'handleLessonComplete'], 10, 2);
Hooks::add('lifterlms_course_completed', [LifterLmsController::class, 'handleCourseComplete'], 10, 2);
Hooks::add('llms_user_enrolled_in_course', [LifterLmsController::class, 'handleCourseEnroll'], 10, 2);
Hooks::add('llms_user_removed_from_course', [LifterLmsController::class, 'handleCourseUnEnroll'], 10, 4);
Hooks::add('llms_subscription_cancelled_by_student', [LifterLmsController::class, 'handleMembershipCancel'], 10, 4);
