<?php


if (!defined('ABSPATH')) {
    exit;
}

use BitCode\FI\Core\Util\Route;
use BitCode\FI\Triggers\Brizy\BrizyController;

Route::get('brizy/get', [BrizyController::class, 'getAllForms']);
Route::post('brizy/get/form', [BrizyController::class, 'getFormFields']);