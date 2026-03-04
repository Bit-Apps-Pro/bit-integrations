<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitApps\Integrations\Actions\NotificationX\NotificationXController;
use BitApps\Integrations\Core\Util\Route;

Route::post('notificationx_authorize', [NotificationXController::class, 'notificationXAuthorize']);
