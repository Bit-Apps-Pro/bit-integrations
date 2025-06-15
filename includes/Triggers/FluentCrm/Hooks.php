<?php
if (!defined('ABSPATH')) {
    exit;
}

use BitCode\FI\Core\Util\Hooks;
use BitCode\FI\Triggers\FluentCrm\FluentCrmController;

Hooks::add('fluentcrm_contact_added_to_tags', [FluentCrmController::class, 'handle_add_tag'], 20, 2);
Hooks::add('fluentcrm_contact_removed_from_tags', [FluentCrmController::class, 'handle_remove_tag'], 20, 2);
Hooks::add('fluentcrm_contact_added_to_lists', [FluentCrmController::class, 'handle_add_list'], 20, 2);
Hooks::add('fluentcrm_contact_removed_from_lists', [FluentCrmController::class, 'handle_remove_list'], 20, 2);
Hooks::add('fluentcrm_contact_created', [FluentCrmController::class, 'handle_contact_create'], 20, 1);


Hooks::add('fluentcrm_subscriber_status_to_subscribed', [FluentCrmController::class, 'handle_change_status'], 10, 2);
Hooks::add('fluentcrm_subscriber_status_to_pending', [FluentCrmController::class, 'handle_change_status'], 10, 2);
Hooks::add('fluentcrm_subscriber_status_to_unsubscribed', [FluentCrmController::class, 'handle_change_status'], 10, 2);
Hooks::add('fluentcrm_subscriber_status_to_bounced', [FluentCrmController::class, 'handle_change_status'], 10, 2);
Hooks::add('fluentcrm_subscriber_status_to_complained', [FluentCrmController::class, 'handle_change_status'], 10, 2);
