<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitApps\Integrations\Actions\Twilio\TwilioController;
use BitApps\Integrations\Core\Util\Route;

// Twilio
Route::post('twilio_authorization', [TwilioController::class, 'checkAuthorization']);
