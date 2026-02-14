<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitApps\BTCBI_FI\Actions\SliceWp\SliceWpController;
use BitApps\BTCBI_FI\Core\Util\Route;

Route::post('slicewp_authorize', [SliceWpController::class, 'authorizeSliceWp']);
