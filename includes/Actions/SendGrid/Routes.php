<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitCode\FI\Actions\SendGrid\SendGridController;
use BitCode\FI\Core\Util\Route;

Route::post('sendGrid_authentication', [SendGridController::class, 'authentication']);
Route::post('sendGrid_fetch_all_lists', [SendGridController::class, 'getLists']);
