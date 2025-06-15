<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitCode\FI\Actions\BitForm\BitFormController;
use BitCode\FI\Core\Util\Route;

Route::post('bitForm_authorization_and_fetch_form_list', [BitFormController::class, 'bitFormAuthorization']);
Route::post('bitForm_all_form_list', [BitFormController::class, 'bitFormAllFormList']);
Route::post('bitForm_fetch_single_form_fields', [BitFormController::class, 'bitFormFetchSingleFormFields']);
