<?php


if (!defined('ABSPATH')) {
    exit;
}

use BitCode\FI\Core\Util\Route;
use BitCode\FI\Triggers\Spectra\SpectraController;

Route::post('spectra/get', [SpectraController::class, 'getTestData']);
Route::post('spectra/test/remove', [SpectraController::class, 'removeTestData']);
