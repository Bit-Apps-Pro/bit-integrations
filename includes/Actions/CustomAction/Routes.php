<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitApps\BTCBI_FI\Actions\CustomAction\CustomActionController;
use BitApps\BTCBI_FI\Core\Util\Route;

Route::post('checking_function_validity', [CustomActionController::class, 'functionValidateHandler']);
