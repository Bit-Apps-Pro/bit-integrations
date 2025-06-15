<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitCode\FI\Actions\Smaily\SmailyController;
use BitCode\FI\Core\Util\Route;

Route::post('smaily_authentication', [SmailyController::class, 'authentication']);
