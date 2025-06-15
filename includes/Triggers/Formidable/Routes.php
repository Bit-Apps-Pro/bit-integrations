<?php
if (!defined('ABSPATH')) {
    exit;
}
use BitCode\FI\Core\Util\Route;
use BitCode\FI\Triggers\Formidable\FormidableController;

Route::get('formidable/get', [FormidableController::class, 'getAll']);
Route::post('formidable/get/form', [FormidableController::class, 'get_a_form']);