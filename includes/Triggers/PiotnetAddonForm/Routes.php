<?php


if (!defined('ABSPATH')) {
    exit;
}

use BitCode\FI\Core\Util\Route;
use BitCode\FI\Triggers\PiotnetAddonForm\PiotnetAddonFormController;

Route::get('piotnetaddonform/get', [PiotnetAddonFormController::class, 'getAllForms']);
Route::post('piotnetaddonform/get/form', [PiotnetAddonFormController::class, 'getFormFields']);
