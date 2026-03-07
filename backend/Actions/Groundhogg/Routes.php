<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitApps\Integrations\Actions\Groundhogg\GroundhoggController;
use BitApps\Integrations\Core\Util\Route;

Route::post('groundhogg_authorization_and_fetch_contacts', [GroundhoggController::class, 'fetchAllContacts']);
Route::post('groundhogg_fetch_all_tags', [GroundhoggController::class, 'groundhoggFetchAllTags']);
