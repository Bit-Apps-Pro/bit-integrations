<?php
if (!defined('ABSPATH')) {
    exit;
}
use BitCode\FI\Core\Util\Route;
use BitCode\FI\Triggers\PiotnetForms\PiotnetFormsController;

Route::get('piotnetforms/get', [PiotnetFormsController::class, 'getAll']);
Route::post('piotnetforms/get/form', [PiotnetFormsController::class, 'get_a_form']);