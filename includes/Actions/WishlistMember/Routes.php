<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitCode\FI\Actions\WishlistMember\WishlistMemberController;
use BitCode\FI\Core\Util\Route;

Route::post('wishlist_authorization', [WishlistMemberController::class, 'authorization']);
Route::post('get_wishlist_levels', [WishlistMemberController::class, 'getLevels']);
