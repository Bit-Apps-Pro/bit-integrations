<?php
if (!defined('ABSPATH')) {
    exit;
}

use BitCode\FI\Actions\WPCourseware\WPCoursewareController;
use BitCode\FI\Core\Util\Route;

Route::post('wpCourseware_authorize', [WPCoursewareController::class, 'wpCoursewareAuthorize']);
Route::post('wpCourseware_actions', [WPCoursewareController::class, 'WPCWActions']);
Route::post('wpCourseware_courses', [WPCoursewareController::class, 'WPCWCourses']);
