<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitApps\BTCBI_FI\Actions\SureCart\SureCartController;
use BitApps\BTCBI_FI\Core\Util\Route;

Route::post('sureCart_authorization', [SureCartController::class, 'checkAuthorization']);
