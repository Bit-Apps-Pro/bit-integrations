<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitApps\BTCBI_FI\Actions\OneHashCRM\OneHashCRMController;
use BitApps\BTCBI_FI\Core\Util\Route;

Route::post('onehashcrm_authentication', [OneHashCRMController::class, 'authentication']);
