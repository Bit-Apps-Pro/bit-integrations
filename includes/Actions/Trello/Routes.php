<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitApps\Integrations\Actions\Trello\TrelloController;
use BitApps\Integrations\Core\Util\Route;

Route::post('trello_fetch_all_board', [TrelloController::class, 'fetchAllBoards']);
Route::post('trello_fetch_all_list_Individual_board', [TrelloController::class, 'fetchAllLists']);
Route::post('trello_fetch_all_custom_fields', [TrelloController::class, 'fetchAllCustomFields']);
