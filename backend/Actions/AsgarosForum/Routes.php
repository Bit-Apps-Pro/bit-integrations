<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitApps\Integrations\Actions\AsgarosForum\AsgarosForumController;
use BitApps\Integrations\Core\Util\Route;

Route::post('asgaros_forum_authorize', [AsgarosForumController::class, 'asgarosForumAuthorize']);
