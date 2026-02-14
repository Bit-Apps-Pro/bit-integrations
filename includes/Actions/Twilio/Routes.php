<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitApps\BTCBI_FI\Actions\Twilio\TwilioController;
use BitApps\BTCBI_FI\Core\Util\Route;

// Twilio
Route::post('twilio_authorization', [TwilioController::class, 'checkAuthorization']);
