<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitCode\FI\Actions\Getgist\GetgistController;
use BitCode\FI\Core\Util\Route;

Route::post('getgist_authorize', [GetgistController::class, 'getgistAuthorize']);
