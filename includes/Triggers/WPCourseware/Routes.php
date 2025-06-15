<?php
if (!defined('ABSPATH')) {
    exit;
}
use BitCode\FI\Core\Util\Route;
use BitCode\FI\Triggers\WPCourseware\WPCoursewareController;

Route::get('wpcourseware/get', [WPCoursewareController::class, 'getAll']);
Route::post('wpcourseware/get/form', [WPCoursewareController::class, 'get_a_form']);