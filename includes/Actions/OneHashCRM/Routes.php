<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitCode\FI\Actions\OneHashCRM\OneHashCRMController;
use BitCode\FI\Core\Util\Route;

Route::post('onehashcrm_authentication', [OneHashCRMController::class, 'authentication']);
