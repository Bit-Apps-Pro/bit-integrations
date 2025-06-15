<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitCode\FI\Actions\Moosend\MoosendController;
use BitCode\FI\Core\Util\Route;

Route::post('moosend_handle_authorize', [MoosendController::class, 'handleAuthorize']);
