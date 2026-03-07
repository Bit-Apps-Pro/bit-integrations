<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitApps\Integrations\Actions\Getgist\GetgistController;
use BitApps\Integrations\Core\Util\Route;

Route::post('getgist_authorize', [GetgistController::class, 'getgistAuthorize']);
