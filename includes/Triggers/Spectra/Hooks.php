<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitCode\FI\Core\Util\Hooks;
use BitCode\FI\Triggers\Spectra\SpectraController;

Hooks::add('uagb_form_success', [SpectraController::class, 'spectraHandler'], 10, PHP_INT_MAX);
