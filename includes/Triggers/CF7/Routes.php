<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitApps\BTCBI_FI\Core\Util\Route;
use BitApps\BTCBI_FI\Triggers\CF7\CF7Controller;

Route::get('cf7/get', [CF7Controller::class, 'getAll']);
Route::post('cf7/get/form', [CF7Controller::class, 'get_a_form']);
