<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitCode\FI\Core\Util\Route;
use BitCode\FI\Triggers\Rafflepress\RafflepressController;

Route::get('rafflepress/get', [RafflepressController::class, 'getAll']);
Route::post('rafflepress/get/form', [RafflepressController::class, 'get_a_form']);
