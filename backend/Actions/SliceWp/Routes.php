<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitApps\Integrations\Actions\SliceWp\SliceWpController;
use BitApps\Integrations\Core\Util\Route;

Route::post('slicewp_authorize', [SliceWpController::class, 'authorizeSliceWp']);
