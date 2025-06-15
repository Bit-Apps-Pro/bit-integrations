<?php
if (!defined('ABSPATH')) {
    exit;
}

use BitCode\FI\Core\Util\Route;
use BitCode\FI\Triggers\NF\NFController;

Route::get('nf/get', [NFController::class, 'getAll']);
Route::post('nf/get/form', [NFController::class, 'getAForm']);
