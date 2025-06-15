<?php


if (!defined('ABSPATH')) {
    exit;
}

use BitCode\FI\Core\Util\Route;
use BitCode\FI\Triggers\EssentialBlocks\EssentialBlocksController;

Route::post('essential_blocks/get', [EssentialBlocksController::class, 'getTestData']);
Route::post('essential_blocks/test/remove', [EssentialBlocksController::class, 'removeTestData']);
