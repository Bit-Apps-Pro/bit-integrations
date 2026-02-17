<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitApps\Integrations\Actions\Slack\SlackController;
use BitApps\Integrations\Core\Util\Route;

// Slack
Route::post('slack_authorization_and_fetch_channels', [SlackController::class, 'checkAuthorizationAndFetchChannels']);
