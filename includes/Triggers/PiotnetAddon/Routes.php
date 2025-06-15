<?php


if (!defined('ABSPATH')) {
    exit;
}

use BitCode\FI\Core\Util\Route;
use BitCode\FI\Triggers\PiotnetAddon\PiotnetAddonController;

Route::get('piotnetaddon/get', [PiotnetAddonController::class, 'getAllForms']);
Route::post('piotnetaddon/get/form', [PiotnetAddonController::class, 'getFormFields']);
