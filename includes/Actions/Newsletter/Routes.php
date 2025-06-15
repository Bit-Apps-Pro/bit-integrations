<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitCode\FI\Actions\Newsletter\NewsletterController;
use BitCode\FI\Core\Util\Route;

Route::post('newsletter_authentication', [NewsletterController::class, 'authentication']);
