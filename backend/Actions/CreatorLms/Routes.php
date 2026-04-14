<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitApps\Integrations\Actions\CreatorLms\CreatorLmsController;
use BitApps\Integrations\Core\Util\Route;

Route::post('creator_lms_authorize', [CreatorLmsController::class, 'creatorLmsAuthorize']);
