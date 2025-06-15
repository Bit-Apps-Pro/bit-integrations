<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitCode\FI\Actions\SendinBlue\SendinBlueController;
use BitCode\FI\Core\Util\Route;

Route::post('sblue_authorize', [SendinBlueController::class, 'sendinBlueAuthorize']);
Route::post('sblue_refresh_lists', [SendinBlueController::class, 'refreshlists']);
Route::post('sblue_headers', [SendinBlueController::class, 'sendinblueHeaders']);
Route::post('sblue_refresh_template', [SendinBlueController::class, 'refreshTemplate']);
