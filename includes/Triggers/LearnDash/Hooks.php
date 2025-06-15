<?php
if (!defined('ABSPATH')) {
    exit;
}

use BitCode\FI\Core\Util\Hooks;
use BitCode\FI\Triggers\LearnDash\LearnDashController;

Hooks::add('learndash_update_course_access', [LearnDashController::class, 'handle_course_enroll'], 10, 4);
Hooks::add('learndash_course_completed', [LearnDashController::class, 'handle_course_completed'], 10, 1);
Hooks::add('learndash_lesson_completed', [LearnDashController::class, 'handle_lesson_completed'], 10, 1);
Hooks::add('learndash_topic_completed', [LearnDashController::class, 'handle_topic_completed'], 10, 1);
Hooks::add('learndash_quiz_submitted', [LearnDashController::class, 'handle_quiz_attempt'], 10, 2);
Hooks::add('ld_added_group_access', [LearnDashController::class, 'handle_added_group'], 10, 2);
Hooks::add('ld_removed_group_access', [LearnDashController::class, 'handle_removed_group'], 10, 2);
Hooks::add('learndash_assignment_uploaded', [LearnDashController::class, 'handle_assignment_submit'], 10, 2);
