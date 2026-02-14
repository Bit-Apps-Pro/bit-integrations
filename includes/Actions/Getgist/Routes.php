<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitApps\BTCBI_FI\Actions\Getgist\GetgistController;
use BitApps\BTCBI_FI\Core\Util\Route;

Route::post('getgist_authorize', [GetgistController::class, 'getgistAuthorize']);
