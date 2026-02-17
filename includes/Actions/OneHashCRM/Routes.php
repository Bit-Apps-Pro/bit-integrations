<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitApps\Integrations\Actions\OneHashCRM\OneHashCRMController;
use BitApps\Integrations\Core\Util\Route;

Route::post('onehashcrm_authentication', [OneHashCRMController::class, 'authentication']);
