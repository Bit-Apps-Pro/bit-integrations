<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitCode\FI\Actions\ACPT\ACPTController;
use BitCode\FI\Core\Util\Route;

Route::post('acpt_authentication', [ACPTController::class, 'authentication']);
