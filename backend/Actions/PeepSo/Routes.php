<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitApps\Integrations\Actions\PeepSo\PeepSoController;
use BitApps\Integrations\Core\Util\Route;

Route::post('peep_so_authorize', [PeepSoController::class, 'peepSoAuthorize']);
