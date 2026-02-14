<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitApps\BTCBI_FI\Actions\WPCourseware\WPCoursewareController;
use BitApps\BTCBI_FI\Core\Util\Route;

Route::post('wpCourseware_authorize', [WPCoursewareController::class, 'wpCoursewareAuthorize']);
Route::post('wpCourseware_courses', [WPCoursewareController::class, 'WPCWCourses']);
