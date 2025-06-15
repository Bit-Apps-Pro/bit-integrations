<?php
if (!defined('ABSPATH')) {
    exit;
}

use BitCode\FI\Core\Util\Route;
use BitCode\FI\Triggers\TutorLms\TutorLmsController;

Route::get('tutorlms/get', [TutorLmsController::class, 'getAll']);
Route::post('tutorlms/get/form', [TutorLmsController::class, 'get_a_form']);
