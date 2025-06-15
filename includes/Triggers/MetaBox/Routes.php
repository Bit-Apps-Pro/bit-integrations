<?php


if (!defined('ABSPATH')) {
    exit;
}

use BitCode\FI\Core\Util\Route;
use BitCode\FI\Triggers\MetaBox\MetaBoxController;

Route::get('metabox/get', [MetaBoxController::class, 'getAll']);
Route::post('metabox/get/form', [MetaBoxController::class, 'get_a_form']);