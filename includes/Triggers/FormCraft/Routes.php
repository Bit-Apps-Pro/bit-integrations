<?php

if (!defined('ABSPATH')) {
    exit;
}
use BitCode\FI\Core\Util\Route;
use BitCode\FI\Triggers\FormCraft\FormCraftController;

Route::get('formcraft/get', [FormCraftController::class, 'getAll']);
Route::post('formcraft/get/form', [FormCraftController::class, 'get_a_form']);
