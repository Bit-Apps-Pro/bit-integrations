<?php


if (!defined('ABSPATH')) {
    exit;
}

use BitCode\FI\Core\Util\Route;
use BitCode\FI\Triggers\Beaver\BeaverController;

Route::get('beaver/get', [BeaverController::class, 'getAllForms']);
Route::post('beaver/get/form', [BeaverController::class, 'getFormFields']);