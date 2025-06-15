<?php
if (!defined('ABSPATH')) {
    exit;
}
use BitCode\FI\Core\Util\Route;
use BitCode\FI\Triggers\WeForms\WeFormsController;

Route::get('weforms/get', [WeFormsController::class, 'getAll']);
Route::post('weforms/get/form', [WeFormsController::class, 'get_a_form']);
