<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitApps\BTCBI_FI\Actions\MailBluster\MailBlusterController;
use BitApps\BTCBI_FI\Core\Util\Route;

Route::post('mailBluster_authentication', [MailBlusterController::class, 'authentication']);
