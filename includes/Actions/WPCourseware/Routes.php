<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitCode\FI\Core\Util\Route;
use BitCode\FI\Actions\WPCourseware\WPCoursewareController;

Route::post('wpCourseware_authorize', [WPCoursewareController::class, 'wpCoursewareAuthorize']);
Route::post('wpCourseware_courses', [WPCoursewareController::class, 'WPCWCourses']);
