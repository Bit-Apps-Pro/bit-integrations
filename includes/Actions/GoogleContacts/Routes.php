<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitApps\BTCBI_FI\Actions\GoogleContacts\GoogleContactsController;
use BitApps\BTCBI_FI\Core\Util\Route;

Route::post('googleContacts_authorization', [GoogleContactsController::class, 'authorization']);
