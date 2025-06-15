<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitCode\FI\Core\Util\Route;
use BitCode\FI\Triggers\ARMember\ARMemberController;

Route::get('armember/get', [ARMemberController::class, 'getAll']);
Route::post('armember/get/form', [ARMemberController::class, 'get_a_form']);

// Route::get('get_lifterLms_all_quiz', [LifterLmsController::class, 'getLifterLmsAllQuiz']);
