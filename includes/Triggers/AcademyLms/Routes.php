<?php
if (!defined('ABSPATH')) {
    exit;
}

use BitCode\FI\Core\Util\Route;
use BitCode\FI\Triggers\AcademyLms\AcademyLmsController;

Route::get('academylms/get', [AcademyLmsController::class, 'getAll']);
Route::post('academylms/get/form', [AcademyLmsController::class, 'get_a_form']);
