<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitApps\BTCBI_FI\Actions\Newsletter\NewsletterController;
use BitApps\BTCBI_FI\Core\Util\Route;

Route::post('newsletter_authentication', [NewsletterController::class, 'authentication']);
