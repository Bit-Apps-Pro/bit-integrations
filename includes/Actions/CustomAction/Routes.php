<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitApps\Integrations\Actions\CustomAction\CustomActionController;
use BitApps\Integrations\Core\Util\Route;

Route::post('checking_function_validity', [CustomActionController::class, 'functionValidateHandler']);
