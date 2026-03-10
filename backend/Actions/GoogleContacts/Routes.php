<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitApps\Integrations\Actions\GoogleContacts\GoogleContactsController;
use BitApps\Integrations\Core\Util\Route;

Route::no_sanitize()->post('googleContacts_authorization', [GoogleContactsController::class, 'authorization']);
