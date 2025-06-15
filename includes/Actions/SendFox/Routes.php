<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitCode\FI\Actions\SendFox\SendFoxController;
use BitCode\FI\Core\Util\Route;

Route::post('sendFox_authorize', [SendFoxController::class, 'sendFoxAuthorize']);
Route::post('sendfox_fetch_all_list', [SendFoxController::class, 'fetchContactLists']);
