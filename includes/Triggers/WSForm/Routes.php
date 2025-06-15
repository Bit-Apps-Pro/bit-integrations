<?php
if (!defined('ABSPATH')) {
    exit;
}
use BitCode\FI\Core\Util\Route;
use BitCode\FI\Triggers\WSForm\WSFormController;

Route::get('wsform/get', [WSFormController::class, 'getAll']);
Route::post('wsform/get/form', [WSFormController::class, 'get_a_form']);