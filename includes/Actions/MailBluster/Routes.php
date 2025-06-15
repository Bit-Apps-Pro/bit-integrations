<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitCode\FI\Actions\MailBluster\MailBlusterController;
use BitCode\FI\Core\Util\Route;

Route::post('mailBluster_authentication', [MailBlusterController::class, 'authentication']);
