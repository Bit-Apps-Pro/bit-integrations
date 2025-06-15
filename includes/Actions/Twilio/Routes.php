<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitCode\FI\Actions\Twilio\TwilioController;
use BitCode\FI\Core\Util\Route;

// Twilio
Route::post('twilio_authorization', [TwilioController::class, 'checkAuthorization']);
