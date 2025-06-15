<?php
if (!defined('ABSPATH')) {
    exit;
}

use BitCode\FI\Core\Util\Hooks;
use BitCode\FI\Triggers\WPCourseware\WPCoursewareController;

Hooks::add('wpcw_enroll_user', [WPCoursewareController::class, 'userEnrolledCourse'], 10, 2);
Hooks::add('wpcw_user_completed_course', [WPCoursewareController::class, 'courseCompleted'], 10, 3);
Hooks::add('wpcw_user_completed_module', [WPCoursewareController::class, 'moduleCompleted'], 10, 3);
Hooks::add('wpcw_user_completed_unit', [WPCoursewareController::class, 'unitCompleted'], 10, 3);
