<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitApps\Integrations\Actions\SureCart\SureCartController;
use BitApps\Integrations\Core\Util\Route;

Route::post('sureCart_authorization', [SureCartController::class, 'checkAuthorization']);
