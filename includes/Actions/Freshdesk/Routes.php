<?php
if (!defined('ABSPATH')) {
    exit;
}

use BitCode\FI\Actions\Freshdesk\FreshdeskController;
use BitCode\FI\Core\Util\Route;

Route::post('freshdesk_authorization_and_fetch_tickets', [FreshdeskController::class, 'checkAuthorizationAndFetchTickets']);
