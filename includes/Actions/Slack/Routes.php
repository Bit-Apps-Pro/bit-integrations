<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitCode\FI\Actions\Slack\SlackController;
use BitCode\FI\Core\Util\Route;

// Slack
Route::post('slack_authorization_and_fetch_channels', [SlackController::class, 'checkAuthorizationAndFetchChannels']);
