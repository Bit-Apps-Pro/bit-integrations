<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitApps\Integrations\Actions\MailBluster\MailBlusterController;
use BitApps\Integrations\Core\Util\Route;

Route::post('mailBluster_authentication', [MailBlusterController::class, 'authentication']);
