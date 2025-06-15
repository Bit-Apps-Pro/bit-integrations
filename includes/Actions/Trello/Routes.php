<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitCode\FI\Actions\Trello\TrelloController;
use BitCode\FI\Core\Util\Route;

Route::post('trello_fetch_all_board', [TrelloController::class, 'fetchAllBoards']);
Route::post('trello_fetch_all_list_Individual_board', [TrelloController::class, 'fetchAllLists']);
Route::post('trello_fetch_all_custom_fields', [TrelloController::class, 'fetchAllCustomFields']);
