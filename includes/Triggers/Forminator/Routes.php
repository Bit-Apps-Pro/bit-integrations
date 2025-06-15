<?php
if (!defined('ABSPATH')) {
    exit;
}
use BitCode\FI\Core\Util\Route;
use BitCode\FI\Triggers\Forminator\ForminatorController;

Route::get('forminator/get', [ForminatorController::class, 'getAll']);
Route::post('forminator/get/form', [ForminatorController::class, 'get_a_form']);