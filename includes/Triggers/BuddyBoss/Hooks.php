<?php
if (!defined('ABSPATH')) {
    exit;
}

use BitCode\FI\Core\Util\Hooks;
use BitCode\FI\Triggers\BuddyBoss\BuddyBossController;

Hooks::add('friends_friendship_accepted', [BuddyBossController::class, 'handle_accept_friend_request'], 10, 4);
Hooks::add('friends_friendship_requested', [BuddyBossController::class, 'handle_sends_friend_request'], 10, 4);
Hooks::add('bbp_new_topic', [BuddyBossController::class, 'handle_create_topic'], 10, 4);
Hooks::add('groups_join_group', [BuddyBossController::class, 'handle_join_public_group'], 10, 2);
Hooks::add('groups_membership_accepted', [BuddyBossController::class, 'handle_join_private_group'], 10, 2);
Hooks::add('groups_accept_invite', [BuddyBossController::class, 'handle_join_private_group'], 10, 2);
Hooks::add('groups_leave_group', [BuddyBossController::class, 'handle_leaves_group'], 10, 2);
Hooks::add('groups_remove_member', [BuddyBossController::class, 'handle_leaves_group'], 10, 2);
Hooks::add('bp_groups_posted_update', [BuddyBossController::class, 'handle_post_group_activity'], 10, 4);
Hooks::add('bbp_new_reply', [BuddyBossController::class, 'handle_replies_topic'], 10, 3);
Hooks::add('groups_membership_requested', [BuddyBossController::class, 'handle_request_private_group'], 10, 4);
Hooks::add('bp_member_invite_submit', [BuddyBossController::class, 'handle_send_email_invites'], 10, 2);
Hooks::add('xprofile_avatar_uploaded', [BuddyBossController::class, 'handle_update_avatar'], 10, 3);
Hooks::add('xprofile_updated_profile', [BuddyBossController::class, 'handle_update_profile'], 10, 5);
Hooks::add('bp_core_activated_user', [BuddyBossController::class, 'handle_account_active'], 10, 5);
Hooks::add('bp_invites_member_invite_activate_user', [BuddyBossController::class, 'handle_invitee_active_account'], 10, 3);
Hooks::add('bp_invites_member_invite_mark_register_user', [BuddyBossController::class, 'handle_invitee_register_account'], 10, 3);
