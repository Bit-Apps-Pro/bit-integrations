<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitCode\FI\Core\Util\Route;
use BitCode\FI\Triggers\CartFlow\CartFlowController;

Route::get('cartflow/get', [CartFlowController::class, 'getAllForms']);
Route::post('cartflow/get/form', [CartFlowController::class, 'getFormFields']);
