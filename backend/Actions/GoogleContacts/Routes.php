<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitApps\Integrations\Actions\GoogleContacts\GoogleContactsController;
use BitApps\Integrations\Core\Util\Route;

Route::post('googleContacts_authorization', [GoogleContactsController::class, 'authorization']);
