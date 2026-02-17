<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitApps\Integrations\Actions\Newsletter\NewsletterController;
use BitApps\Integrations\Core\Util\Route;

Route::post('newsletter_authentication', [NewsletterController::class, 'authentication']);
