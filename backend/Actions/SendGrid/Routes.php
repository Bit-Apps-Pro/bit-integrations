<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitApps\Integrations\Actions\SendGrid\SendGridController;
use BitApps\Integrations\Core\Util\Route;

Route::post('sendGrid_authentication', [SendGridController::class, 'authentication']);
Route::post('sendGrid_fetch_all_lists', [SendGridController::class, 'getLists']);
