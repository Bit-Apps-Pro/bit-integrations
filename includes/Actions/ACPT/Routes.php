<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitApps\BTCBI_FI\Actions\ACPT\ACPTController;
use BitApps\BTCBI_FI\Core\Util\Route;

Route::post('acpt_authentication', [ACPTController::class, 'authentication']);
