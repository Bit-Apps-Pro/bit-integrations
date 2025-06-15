<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitCode\FI\Core\Util\Hooks;
use BitCode\FI\Triggers\ThriveApprentice\ThriveApprenticeController;

Hooks::add('thrive_apprentice_course_finish', [ThriveApprenticeController::class, 'handleCourseComplete'], 10, 2);
Hooks::add('thrive_apprentice_lesson_complete', [ThriveApprenticeController::class, 'handleLessonComplete'], 10, 2);
Hooks::add('thrive_apprentice_module_finish', [ThriveApprenticeController::class, 'handleModuleComplete'], 10, 2);
