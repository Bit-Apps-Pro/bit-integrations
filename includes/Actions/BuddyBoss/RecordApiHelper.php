<?php

/**
 * BuddyBoss Record Api
 */

namespace BitCode\FI\Actions\BuddyBoss;

use BitCode\FI\Log\LogHandler;
use BitCode\FI\Core\Util\Common;

/**
 * Provide functionality for Record insert, upsert
 */
class RecordApiHelper
{
    private static $integrationID;
    private $_integrationDetails;
    private $quiz_list;
    private $assignment_list;

    public function __construct($integrationDetails, $integId)
    {
        $this->_integrationDetails = $integrationDetails;
        self::$integrationID = $integId;
    }

    public static function getIntegrationId()
    {
        return $integrationID = self::$integrationID;
    }

    public function getAssignmentList()
    {
        return $assignment_list = $this->assignment_list;
    }

    public function generateReqDataFromFieldMap($data, $fieldMap)
    {
        $dataFinal = [];

        foreach ($fieldMap as $key => $value) {
            $triggerValue = $value->formField;
            $actionValue = $value->buddyBossFormField;
            if ($triggerValue === 'custom') {
                $dataFinal[$actionValue] = Common::replaceFieldWithValue($value->customValue, $data);
            } elseif (!is_null($data[$triggerValue])) {
                $dataFinal[$actionValue] = $data[$triggerValue];
            }
        }
        return $dataFinal;
    }

    public function createGroup($privacyId, $finalData)
    {
        switch ($privacyId) {
            case '1':
                $privacy = 'public';
                break;
            case '2':
                $privacy = 'private';
                break;
            case '3':
                $privacy = 'hidden';
                break;
        }

        $user_id = get_current_user_id();
        $data = [
            "creator_id" => $user_id,
            "name" => $finalData['group_name'],
            "status" => $privacy
        ];

        return groups_create_group($data);
    }

    public static function addUserToGroup($groupId)
    {
        $user_id = get_current_user_id();
        if (function_exists('groups_join_group')) {
            $response = groups_join_group($groupId, $user_id);
            if ($response) {
                LogHandler::save(self::$integrationID, json_encode(['type' => 'group', 'type_name' => 'add-user-to-group']), 'success', json_encode('Successfully add user to group'));
            } else {
                LogHandler::save(self::$integrationID, json_encode(['type' => 'group', 'type_name' => 'add-user-to-group']), 'error', json_encode('Unauthorized user'));
            }
        } else {
            LogHandler::save(self::$integrationID, json_encode(['type' => 'group', 'type_name' => 'add-user-to-group']), 'error', json_encode('Failed to add user to group'));
        }
    }

    public static function EndFriendshipWithUser($friendId)
    {
        $user_id = get_current_user_id();
        if (function_exists('friends_remove_friend')) {
            friends_remove_friend($user_id, $friendId);
            LogHandler::save(self::$integrationID, json_encode(['type' => 'friend', 'type_name' => 'end-friendship-with-user']), 'success', json_encode('Successfully end friendship with user'));
        } else {
            LogHandler::save(self::$integrationID, json_encode(['type' => 'friend', 'type_name' => 'end-friendship-with-user']), 'error', json_encode('Failed to end friendship with user'));
        }
    }

    public static function FollowUser($friendId)
    {
        $user_id = get_current_user_id();

        $data = [
            'follower_id' => $user_id,
            'leader_id' => $friendId,
        ];


        if ($user_id === $friendId) {
            LogHandler::save(self::$integrationID, json_encode(['type' => 'friend', 'type_name' => 'follow-user']), 'error', json_encode('A user can not follow itself. '));
            return;
        }

        if (bp_is_active('follow') && function_exists('bp_follow_start_following')) {
            $following = bp_follow_start_following($data);
        } elseif (function_exists('bp_start_following')) {
            $following = bp_start_following($data);
        }
        if ($following) {
            return LogHandler::save(self::$integrationID, json_encode(['type' => 'friend', 'type_name' => 'follow-user']), 'success', json_encode('The user successfully start following a member ID - ' . $friendId));
        } else {
            LogHandler::save(self::$integrationID, json_encode(['type' => 'friend', 'type_name' => 'follow-user']), 'error', json_encode('The user was already following a member ID - ' . $friendId));
            return;
        }
    }


    // for action 5
    public static function posTopicForum($forum_id, $finalData)
    {
        $user_id = get_current_user_id();
        $data = [
            'forum_id' => $forum_id,
            'topic_title' => do_shortcode($finalData['topic_title']),
            'topic_content'  => do_shortcode($finalData['topic_content']),
            'topic_author' => $user_id,
        ];

        if (!empty($forum_id)) {
            if (bbp_is_forum_category($forum_id)) {
                LogHandler::save(self::$integrationID, json_encode(['type' => 'topic', 'type_name' => 'post-topic-forum']), 'error', json_encode('Sorry, This forum is a category. No discussions can be created in this forum. '));
                return;
            } else {
                if (bbp_is_forum_closed($forum_id) && !current_user_can('edit_forum', $forum_id)) {
                    LogHandler::save(self::$integrationID, json_encode(['type' => 'topic', 'type_name' => 'post-topic-forum']), 'error', json_encode('Sorry, This forum has been closed to new discussions. '));
                    return;
                }

                $is_member = false;
                $group_ids = array();
                if (function_exists('bbp_get_forum_group_ids')) {
                    $group_ids = bbp_get_forum_group_ids($forum_id);
                    if (!empty($group_ids)) {
                        foreach ($group_ids as $group_id) {
                            if (groups_is_user_member($user_id, $group_id)) {
                                $is_member = true;
                                break;
                            }
                        }
                    }
                }

                if (bbp_is_forum_private($forum_id) && !bbp_is_user_keymaster()) {
                    if (
                        (empty($group_ids) && !current_user_can('read_private_forums'))
                        || (!empty($group_ids) && !$is_member)
                    ) {
                        LogHandler::save(self::$integrationID, json_encode(['type' => 'topic', 'type_name' => 'post-topic-forum']), 'error', json_encode('Sorry, This forum is private and you do not have the capability to read or create new discussions in it. '));
                        return;
                    }
                } elseif (bbp_is_forum_hidden($forum_id) && !bbp_is_user_keymaster()) {
                    if (
                        (empty($group_ids) && !current_user_can('read_hidden_forums'))
                        || (!empty($group_ids) && !$is_member)
                    ) {
                        LogHandler::save(self::$integrationID, json_encode(['type' => 'topic', 'type_name' => 'post-topic-forum']), 'error', json_encode('Sorry, This forum is hidden and you do not have the capability to read or create new discussions in it.'));
                        return;
                    }
                }
            }
        }

        if (!bbp_check_for_duplicate(
            array(
                'post_type'      => bbp_get_topic_post_type(),
                'post_author'    => $user_id,
                'post_content'   => do_shortcode($finalData['topic_content'])
            )
        )) {
            LogHandler::save(self::$integrationID, json_encode(['type' => 'topic', 'type_name' => 'post-topic-forum']), 'error', json_encode('Duplicate discussion detected; it looks as though you\'ve already said that!'));
            return;
        }



        if (!bbp_check_for_blacklist(null, $user_id, do_shortcode($finalData['topic_title']), do_shortcode($finalData['topic_content']))) {
            LogHandler::save(self::$integrationID, json_encode(['type' => 'topic', 'type_name' => 'post-topic-forum']), 'error', json_encode('Sorry, Your discussion cannot be created at this time.'));
            return;
        }

        $topic_data = apply_filters(
            'bbp_new_topic_pre_insert',
            array(
                'post_author'    => $user_id,
                'post_title'     => $data['topic_title'],
                'post_content'   => $data['topic_content'],
                'post_status'    => "publish",
                'post_parent'    => $forum_id,
                'post_type'      => bbp_get_topic_post_type(),
                'tax_input'      => [],
                'comment_status' => 'closed',
            )
        );

        $topic_id = wp_insert_post($topic_data);

        if (empty($topic_id) || is_wp_error($topic_id)) {
            LogHandler::save(self::$integrationID, json_encode(['type' => 'topic', 'type_name' => 'post-topic-forum']), 'error', json_encode('We are facing a problem to creating a topic.'));
            return;
        } else {
            LogHandler::save(self::$integrationID, json_encode(['type' => 'topic', 'type_name' => 'post-topic-forum']), 'success', json_encode("Post created successfully and id is" . $topic_id));
        }

        if (
            (bbp_get_trash_status_id() === get_post_field('post_status', $forum_id))
            || (bbp_get_trash_status_id() === $topic_data['post_status'])
        ) {
            wp_trash_post($topic_id);
        }

        if (bbp_get_spam_status_id() === $topic_data['post_status']) {
            add_post_meta($topic_id, '_bbp_spam_meta_status', bbp_get_public_status_id());
        }

        remove_action('bbp_new_topic', 'bbp_notify_forum_subscribers', 11);

        do_action('bbp_new_topic', $topic_id, $forum_id, null, $user_id);

        if (bbp_is_subscriptions_active()) {
            $author_id = bbp_get_user_id(0, true, true);
            $subscribed = bbp_is_user_subscribed($author_id, $topic_id);

            if (true === $subscribed && empty($topic->bbp_topic_subscription)) {
                bbp_remove_user_subscription($author_id, $topic_id);
            } elseif (false === $subscribed && !empty($topic->bbp_topic_subscription)) {
                bbp_add_user_subscription($author_id, $topic_id);
            }
        }

        do_action('bbp_new_topic_post_extras', $topic_id);


        if (function_exists('bbp_notify_forum_subscribers')) {
            bbp_notify_forum_subscribers($topic_id, $forum_id, null, $user_id);
        }
    }

    // action 6 start

    public static function removeUserFromGroup($group_id)
    {
        $user_id = get_current_user_id();

        if ($group_id === "any") {
            $all_user_groups = groups_get_user_groups($user_id);
            if (!empty($all_user_groups['groups'])) {
                foreach ($all_user_groups['groups'] as $group) {
                    $result = groups_leave_group($group, $user_id);
                }
            }
        } else {
            $result = groups_leave_group($group_id, $user_id);
        }
        return $result;
    }

    public static function sendFriendshipRequestUser($friendId)
    {
        $user_id = get_current_user_id();
        if (function_exists('friends_add_friend')) {
            return friends_add_friend($user_id, $friendId);
        }
        return false;
    }

    public static function sendNotificationMembersGroup($group_id, $friendId, $finalData)
    {
        $user_id = get_current_user_id();
        $data = [
            'group_id' => $group_id,
            'friend_id' => $friendId,
            'notification_content' => do_shortcode($finalData['notification_content']),
            'notification_link' => do_shortcode($finalData['notification_link']),
        ];

        if (function_exists('groups_get_group_members')) {
            $members = groups_get_group_members([
                'group_id'       => $group_id,
                'per_page'       => 999999,
                'type'           => 'last_joined',
                'exclude_banned' => true
            ]);

            if (isset($members['members'])) {
                if (function_exists('bp_notifications_add_notification')) {
                    foreach ($members['members'] as $member) {
                        $notification_id = '';
                        $notification_id = bp_notifications_add_notification(
                            array(
                                'user_id'           => $member->ID,
                                'item_id'           => 1,
                                'secondary_item_id' => $user_id,
                                'component_name'    => 'bit-integrations',
                                'component_action'  => 'bit_integrations_send_notification',
                                'date_notified'     => bp_core_current_time(),
                                'is_new'            => 1,
                                'allow_duplicate'   => true,
                            )
                        );
                        bp_notifications_update_meta($notification_id, 'uo_notification_content', $data['notification_content']);
                        bp_notifications_update_meta($notification_id, 'uo_notification_link', $data['notification_link']);
                    }

                    return true;
                }
            }
        } else {
            return false;
        }
    }

    public static function SendPrivateMessageMembersGroup($group_id, $friendId, $finalData)
    {
        $user_id = get_current_user_id();
        $data = [
            'group_id' => $group_id,
            'friend_id' => $friendId,
            'message_content' => do_shortcode($finalData['message_content']),
            'message_subject' => do_shortcode($finalData['message_subject']),
        ];


        if (function_exists('groups_get_group_members')) {
            $members = groups_get_group_members(['group_id' => $group_id, 'per_page' => -1, 'type' => 'last_joined', 'exclude_banned' => true]);

            if (isset($members['members'])) {
                foreach ($members['members'] as $member) {
                    array_push($members_ids, $member->ID);
                }

                $msg = [
                    'sender_id'  => $friendId,
                    'recipients' => $members_ids,
                    'subject'    => $data['message_subject'],
                    'content'    => $data['message_content'],
                    'error_type' => 'wp_error',
                ];

                if (function_exists('messages_new_message')) {
                    $send = messages_new_message($msg);
                    if (is_wp_error($send)) {
                        $messages = $send->get_error_messages();
                        $err      = array();
                        if ($messages) {
                            foreach ($messages as $msg) {
                                $err[] = $msg;
                            }
                        }
                        return false;
                    } else {
                        return $send;
                    }
                }
            }
        } else {
            return false;
        }
    }

    public static function SendPrivateMessageUser($friendId, $finalData)
    {
        $user_id = get_current_user_id();
        $data = [
            'sender_id' => $friendId,
            'message_content' => do_shortcode($finalData['message_content']),
            'message_subject' => do_shortcode($finalData['message_subject']),
        ];

        $msg = [
            'sender_id'  => $data['sender_id'],
            'recipients' => [$user_id],
            'subject'    => $data['message_subject'],
            'content'    => $data['message_content'],
            'error_type' => 'wp_error',
        ];
        if (function_exists('messages_new_message')) {
            $send = messages_new_message($msg);
            if (is_wp_error($send)) {
                $messages = $send->get_error_messages();
                $err      = array();
                if ($messages) {
                    foreach ($messages as $msg) {
                        $err[] = $msg;
                    }
                }
                return false;
            } else {
                return $send;
            }
        } else {
            return false;
        }
    }

    public static function sendNotificationUser($finalData)
    {
        $user_id = get_current_user_id();

        if (function_exists('bp_notifications_add_notification')) {
            $notification_id = bp_notifications_add_notification(
                array(
                    'user_id'           => $user_id,
                    'item_id'           => 1,
                    'secondary_item_id' => $user_id,
                    'component_name'    => 'bit-integrations',
                    'component_action'  => 'bit_integrations_send_notification',
                    'date_notified'     => bp_core_current_time(),
                    'is_new'            => 1,
                    'allow_duplicate'   => true,
                )
            );


            $data = [
                'notification_content' => do_shortcode($finalData['notification_content']),
                'notification_link' => do_shortcode($finalData['notification_link']),
            ];

            if (is_wp_error($notification_id)) {
                return false;
            } else {
                if (!empty($data['notification_link'])) {
                    $notification_content = '<a href="' . esc_attr(esc_url($data['notification_link'])) . '" title="' . esc_attr(wp_strip_all_tags($data['notification_content'])) . '">' . ($data['notification_content']) . '</a>';
                }


                bp_notifications_update_meta($notification_id, 'uo_notification_content', $notification_content);
                bp_notifications_update_meta($notification_id, 'uo_notification_link', $data['notification_link']);
                return true;
            }
        } else {
            return false;
        }
    }

    public static function stopFollowingUser($friendId)
    {
        $user_id = get_current_user_id();
        $follower_ids = explode(',', $friendId);

        if (function_exists('bp_stop_following') || (bp_is_active('follow') && function_exists('bp_follow_stop_following'))) {
            foreach ($follower_ids as $k => $follower_id) {
                if ((int)$follower_id == $user_id) {
                    continue;
                }
                $message = '';
                $data      = array(
                    'follower_id' => $user_id,
                    'leader_id'   => (int)$follower_id
                );
                if (bp_is_active('follow') && function_exists('bp_follow_stop_following')) {
                    $following = bp_follow_stop_following($data);
                } elseif (function_exists('bp_stop_following')) {
                    $following = bp_stop_following($data);
                }
                if ($following == false) {
                    $message .= 'The user was not following a member id is - ' . $follower_id . '. ';
                    LogHandler::save(self::$integrationID, json_encode(['type' => 'follow', 'type_name' => 'stop-follow-user']), 'error', json_encode($message));
                } else {
                    LogHandler::save(self::$integrationID, json_encode(['type' => 'follow', 'type_name' => 'stop-follow-user']), 'success', json_encode("Stop following users successfully ."));
                }
            }
        }
    }

    public static function subscribeForum($forumId)
    {
        if (bbp_is_subscriptions_active() === false) {
            return;
        }
        $user_id = get_current_user_id();
        $forum_ids = explode(',', $forumId);

        if (!empty($forum_ids)) {
            foreach ($forum_ids as $forum_id) {
                $is_subscription = bbp_is_user_subscribed($user_id, (int)$forum_id);
                $success         = false;

                if (true === $is_subscription) {
                    LogHandler::save(self::$integrationID, json_encode(['type' => 'subscribed', 'type_name' => 'subscribe-forum']), 'error', json_encode("The user is already subscribed to the specified forum."));
                    return;
                } else {
                    $success = bbp_add_user_subscription($user_id, (int)$forum_id);
                    do_action('buddyBoss_subscriptions_handler', $success, $user_id, (int)$forum_id, 'bbp_subscribe');
                }

                if ($success === false && $is_subscription === false) {
                    LogHandler::save(self::$integrationID, json_encode(['type' => 'subscribed', 'type_name' => 'subscribe-forum']), 'error', json_encode("There was a problem subscribing to that forum!"));
                    return;
                }

                return $success;
            }
        }
    }

    public static function addPostToGroup($group_id, $friendId, $finalData)
    {
        $action_author = $friendId;
        $data = [
            'action' => $finalData['activity_action'],
            'action_content' => $finalData['activity_content'],
        ];

        if (empty($group_id)) {
            return false;
        }
        $activity = false;

        if ('any' === $group_id) {
            global $wpdb;
            $statuses   = ['public', 'private', 'hidden'];
            $in_str_arr = array_fill(0, count($statuses), '%s');
            $in_str     = join(',', $in_str_arr);
            $results    = $wpdb->get_results($wpdb->prepare("SELECT * FROM {$wpdb->prefix}bp_groups WHERE status IN (%s)", $in_str));
            if ($results) {
                foreach ($results as $result) {
                    $hide_sitewide = false;
                    if (in_array($result->status, ['private', 'hidden'], true)) {
                        $hide_sitewide = true;
                    }
                    $activity = bp_activity_add([
                        'action'        => $data['action'],
                        'content'       => $data['action_content'],
                        'primary_link'  => null,
                        'component'     => 'groups',
                        'item_id'       => $result->id,
                        'type'          => 'activity_update',
                        'user_id'       => $action_author,
                        'hide_sitewide' => $hide_sitewide,
                    ]);
                    if (is_wp_error($activity)) {
                        break;
                    }
                    if (!$activity) {
                        break;
                    }
                }
            }
        } else {
            global $wpdb;
            $results = $wpdb->get_results($wpdb->prepare("SELECT * FROM {$wpdb->prefix}bp_groups WHERE id = %d", $group_id));
            if ($results) {
                foreach ($results as $result) {
                    $hide_sitewide = false;
                    if (in_array($result->status, ['private', 'hidden'], true)) {
                        $hide_sitewide = true;
                    }
                    $activity = bp_activity_add([
                        'action'        => $data['action'],
                        'content'       => $data['action_content'],
                        'primary_link'  => null,
                        'component'     => 'groups',
                        'item_id'       => $result->id,
                        'type'          => 'activity_update',
                        'user_id'       => $action_author,
                        'hide_sitewide' => $hide_sitewide,
                    ]);
                    if (is_wp_error($activity)) {
                        break;
                    }
                    if (!$activity) {
                        break;
                    }
                }
            }
        }
        if (is_wp_error($activity)) {
            $error_message = $activity->get_error_message();
            return $error_message;
        } elseif (!$activity) {
            return $error_message = 'There is an error on posting stream.';
        } else {
            return $activity;
        }
    }

    public static function postActivityStream($friendId, $finalData)
    {
        $data = [
            'action' => $finalData['activity_action'],
            'action_link' => $finalData['activity_link'],
            'action_content' => $finalData['activity_content'],
        ];

        $activity = bp_activity_add([
            'action'        => $data['action'],
            'content'       => $data['action_content'],
            'primary_link'  => $data['action_link'],
            'component'     => 'activity',
            'type'          => 'activity_update',
            'user_id'       => (int)$friendId,
            'hide_sitewide' => false,
        ]);

        return $activity;
    }

    public static function postActivityUsersStream($friendId, $finalData)
    {
        $data = [
            'action' => $finalData['activity_action'],
            'action_link' => $finalData['activity_link'],
            'action_content' => $finalData['activity_content'],
        ];


        $activity = bp_activity_add([
            'action'        => $data['action'],
            'content'       => $data['action_content'],
            'primary_link'  => $data['action_link'],
            'component'     => 'activity',
            'type'          => 'activity_update',
            'user_id'       => (int)$friendId,
            'hide_sitewide' => true,
        ]);

        return $activity;
    }

    public static function postReplyTopicForum($forum_id, $topic_id, $finalData)
    {
        $data = [
            'forum_id' => $forum_id,
            'topic_id' => $topic_id,
            'reply_content' => $finalData['reply_content'],
            'reply_author' => get_current_user_id(),
            'anonymous_data' => 0,
            'reply_title' => '',
            'reply_to' => 0,
        ];

        if (!bbp_get_topic($topic_id)) {
            LogHandler::save(self::$integrationID, json_encode(['type' => 'reply', 'type_name' => 'reply-forum-topic']), 'error', json_encode("Sorry, Discussion does not exist."));
            return;
        }

        if (!bbp_get_forum($forum_id)) {
            LogHandler::save(self::$integrationID, json_encode(['type' => 'reply', 'type_name' => 'reply-forum-topic']), 'error', json_encode("Sorry, Forum does not exist."));
            return;
        }
        if (!empty($forum_id)) {
            if (bbp_is_forum_category($forum_id)) {
                LogHandler::save(self::$integrationID, json_encode(['type' => 'reply', 'type_name' => 'reply-forum-topic']), 'error', json_encode("Sorry, This forum is a category. No discussions can be created in this forum."));

                return;
            } else {
                if (bbp_is_forum_closed($forum_id) && !current_user_can('edit_forum', $forum_id)) {
                    LogHandler::save(self::$integrationID, json_encode(['type' => 'reply', 'type_name' => 'reply-forum-topic']), 'error', json_encode("Sorry, This forum has been closed to new discussions."));
                    return;
                }

                $is_member = false;
                $group_ids = array();
                if (function_exists('bbp_get_forum_group_ids')) {
                    $group_ids = bbp_get_forum_group_ids($forum_id);
                    if (!empty($group_ids)) {
                        foreach ($group_ids as $group_id) {
                            if (groups_is_user_member($reply_author, $group_id)) {
                                $is_member = true;
                                break;
                            }
                        }
                    }
                }

                if (bbp_is_forum_private($forum_id) && !bbp_is_user_keymaster()) {
                    if (
                        (empty($group_ids) && !current_user_can('read_private_forums'))
                        || (!empty($group_ids) && !$is_member)
                    ) {
                        LogHandler::save(self::$integrationID, json_encode(['type' => 'reply', 'type_name' => 'reply-forum-topic']), 'error', json_encode("Sorry, This forum is private and you do not have the capability to read or create new discussions in it."));

                        return;
                    }
                } elseif (bbp_is_forum_hidden($forum_id) && !bbp_is_user_keymaster()) {
                    if (
                        (empty($group_ids) && !current_user_can('read_hidden_forums'))
                        || (!empty($group_ids) && !$is_member)
                    ) {
                        LogHandler::save(self::$integrationID, json_encode(['type' => 'reply', 'type_name' => 'reply-forum-topic']), 'error', json_encode("Sorry, This forum is hidden and you do not have the capability to read or create new discussions in it."));

                        return;
                    }
                }
            }
        }

        $reply_content = apply_filters('bbp_new_reply_pre_content', $data['reply_content']);

        if (!bbp_check_for_duplicate(
            array(
                'post_type'      => bbp_get_reply_post_type(),
                'post_author'    => $data['reply_author'],
                'post_content'   => $reply_content,
                'post_parent'    => $topic_id,
                'anonymous_data' => $data['anonymous_data'],
            )
        )) {
            LogHandler::save(self::$integrationID, json_encode(['type' => 'reply', 'type_name' => 'reply-forum-topic']), 'error', json_encode("Duplicate reply detected; it looks as though you've already said that!"));
            return;
        }


        if (bbp_is_topic_closed($topic_id) && !current_user_can('moderate')) {
            LogHandler::save(self::$integrationID, json_encode(['type' => 'reply', 'type_name' => 'reply-forum-topic']), 'error', json_encode("Sorry, Discussion is closed."));

            return;
        }

        if (!bbp_check_for_blacklist($data['anonymous_data'], $data['reply_author'], $data['reply_title'], $reply_content)) {
            LogHandler::save(self::$integrationID, json_encode(['type' => 'reply', 'type_name' => 'reply-forum-topic']), 'error', json_encode("Sorry, Your reply cannot be created at this time."));

            return;
        }


        if (!bbp_check_for_moderation($data['anonymous_data'], $data['reply_author'], $data['reply_title'], $reply_content)) {
            $reply_status = bbp_get_pending_status_id();
        } else {
            $reply_status = bbp_get_public_status_id();
        }


        if (bbp_is_topic_closed($topic_id) && !current_user_can('moderate')) {
            LogHandler::save(self::$integrationID, json_encode(['type' => 'reply', 'type_name' => 'reply-forum-topic']), 'error', json_encode("Sorry, Discussion is closed."));

            return;
        }
        $reply_data = apply_filters(
            'bbp_new_reply_pre_insert',
            array(
                'post_author'    => $data['reply_author'],
                'post_title'     => $data['reply_title'],
                'post_content'   => $data['reply_content'],
                'post_status'    => $reply_status,
                'post_parent'    => $topic_id,
                'post_type'      => bbp_get_reply_post_type(),
                'comment_status' => 'closed',
                'menu_order'     => bbp_get_topic_reply_count($topic_id, false) + 1,
            )
        );

        $reply_id = wp_insert_post($reply_data);

        if (empty($reply_id) || is_wp_error($reply_id)) {
            $append_error = (
                (is_wp_error($reply_id) && $reply_id->get_error_message())
                ? __('The following problems have been found with your reply: ') . $reply_id->get_error_message()
                : __('We are facing a problem to creating a reply.')
            );

            LogHandler::save(self::$integrationID, json_encode(['type' => 'reply', 'type_name' => 'reply-forum-topic']), 'error', json_encode($append_error));

            return;
        }


        if (bbp_is_topic_trash($topic_id) || (bbp_get_trash_status_id() === $reply_data['post_status'])) {
            wp_trash_post($reply_id);

            if (bbp_is_topic_trash($topic_id)) {
                $pre_trashed_replies = (array) get_post_meta($topic_id, '_bbp_pre_trashed_replies', true);

                $pre_trashed_replies[] = $reply_id;

                update_post_meta($topic_id, '_bbp_pre_trashed_replies', $pre_trashed_replies);
            }
        } elseif (bbp_is_topic_spam($topic_id) || (bbp_get_spam_status_id() === $reply_data['post_status'])) {
            add_post_meta($reply_id, '_bbp_spam_meta_status', bbp_get_public_status_id());

            if (bbp_is_topic_spam($topic_id)) {
                $pre_spammed_replies = (array) get_post_meta($topic_id, '_bbp_pre_spammed_replies', true);

                $pre_spammed_replies[] = $reply_id;

                update_post_meta($topic_id, '_bbp_pre_spammed_replies', $pre_spammed_replies);
            }
        }

        remove_action('bbp_new_reply', 'bbp_notify_topic_subscribers', 11);

        do_action('bbp_new_reply', $reply_id, $topic_id, $forum_id, $data['anonymous_data'], $data['reply_author'], false, $data['reply_to']);

        do_action('bbp_new_reply_post_extras', $reply_id);
        return $reply_id;
    }

    public static function setUserStatus($userStatusId)
    {
        $user_id = get_current_user_id();
        $set_user_status = $userStatusId === '1' ? 'active' : 'suspend';
        if (bp_is_active('moderation')) {
            if ('suspend' === $set_user_status) {
                \BP_Suspend_Member::suspend_user($user_id);
            } elseif (bp_moderation_is_user_suspended($user_id)) {
                \BP_Suspend_Member::unsuspend_user($user_id);
            }
            return true;
        }

        return false;
    }


    public function execute(
        $mainAction,
        $fieldValues,
        $fieldMap,
        $integrationDetails
    ) {
        $fieldData = [];
        $apiResponse = null;
        if ($mainAction === '1') {
            $privacyId = $integrationDetails->privacyId;
            $finalData = $this->generateReqDataFromFieldMap($fieldValues, $fieldMap);
            $apiResponse = self::createGroup(
                $privacyId,
                $finalData
            );
            if ($apiResponse !== 0) {
                LogHandler::save(self::$integrationID, json_encode(['type' => 'group', 'type_name' => 'create-group']), 'success', json_encode("Group created successfully and is is " . $apiResponse));
            } else {
                LogHandler::save(self::$integrationID, json_encode(['type' => 'group', 'type_name' => 'create-group']), 'error', json_encode($apiResponse));
            }
        }
        if ($mainAction === '2') {
            $groupId = $integrationDetails->groupId;
            self::addUserToGroup(
                $groupId
            );
        }
        if ($mainAction === '3') {
            $friendId = $integrationDetails->friendId;
            self::EndFriendshipWithUser(
                $friendId
            );
        }
        if ($mainAction === '4') {
            $friendId = $integrationDetails->friendId;
            self::FollowUser(
                $friendId
            );
        }
        if ($mainAction === '5') {
            $forumId = $integrationDetails->forumId;
            $finalData = $this->generateReqDataFromFieldMap($fieldValues, $fieldMap);
            self::posTopicForum(
                $forumId,
                $finalData
            );
        }
        if ($mainAction === '6') {
            $groupId = $integrationDetails->groupId;
            $apiResponse = self::removeUserFromGroup(
                $groupId
            );
            if ($apiResponse) {
                LogHandler::save(self::$integrationID, json_encode(['type' => 'user', 'type_name' => 'user-remove-group']), 'success', json_encode("User removed from group successfully ."));
            } else {
                LogHandler::save(self::$integrationID, json_encode(['type' => 'user', 'type_name' => 'user-remove-group']), 'error', json_encode("Failed to remove user form group ."));
            }
        }
        if ($mainAction === '7') {
            $friendId = $integrationDetails->friendId;
            $apiResponse = self::sendFriendshipRequestUser(
                $friendId
            );
            if ($apiResponse) {
                LogHandler::save(self::$integrationID, json_encode(['type' => 'user', 'type_name' => 'send-friend-request']), 'success', json_encode("Send friend request successfully ."));
            } else {
                LogHandler::save(self::$integrationID, json_encode(['type' => 'user', 'type_name' => 'send-friend-request']), 'error', json_encode("Failed to send friend request to user ."));
            }
        }
        if ($mainAction === '8') {
            $group_id = $integrationDetails->groupId;
            $friendId = $integrationDetails->friendId;
            $finalData = $this->generateReqDataFromFieldMap($fieldValues, $fieldMap);
            $apiResponse = self::sendNotificationMembersGroup($group_id, $friendId, $finalData);
            if ($apiResponse) {
                LogHandler::save(self::$integrationID, json_encode(['type' => 'notification', 'type_name' => 'send-notification-allMember']), 'success', json_encode("Notification are send successfully ."));
            } else {
                LogHandler::save(self::$integrationID, json_encode(['type' => 'notification', 'type_name' => 'send-notification-allMember']), 'error', json_encode("BuddyBoss notification module is not active."));
            }
        }
        if ($mainAction === '9') {
            $group_id = $integrationDetails->groupId;
            $friendId = $integrationDetails->friendId;
            $finalData = $this->generateReqDataFromFieldMap($fieldValues, $fieldMap);
            $apiResponse = self::SendPrivateMessageMembersGroup($group_id, $friendId, $finalData);
            if ($apiResponse) {
                LogHandler::save(self::$integrationID, json_encode(['type' => 'message', 'type_name' => 'send-private-message']), 'success', json_encode("Send private message to all group member successfully ."));
            } else {
                LogHandler::save(self::$integrationID, json_encode(['type' => 'message', 'type_name' => 'send-private-message']), 'error', json_encode("BuddyBoss message module is not active."));
            }
        }
        if ($mainAction === '10') {
            $friendId = $integrationDetails->friendId;
            $finalData = $this->generateReqDataFromFieldMap($fieldValues, $fieldMap);
            $apiResponse = self::SendPrivateMessageUser($friendId, $finalData);
            if ($apiResponse) {
                LogHandler::save(self::$integrationID, json_encode(['type' => 'message', 'type_name' => 'send-private-message']), 'success', json_encode("Send private message to user successfully ."));
            } else {
                LogHandler::save(self::$integrationID, json_encode(['type' => 'message', 'type_name' => 'send-private-message']), 'error', json_encode("BuddyBoss message module is not active."));
            }
        }
        if ($mainAction === '11') {
            $finalData = $this->generateReqDataFromFieldMap($fieldValues, $fieldMap);
            $apiResponse = self::sendNotificationUser($finalData);
            if ($apiResponse) {
                LogHandler::save(self::$integrationID, json_encode(['type' => 'notification', 'type_name' => 'send-notification-allMember']), 'success', json_encode("Notification are send successfully ."));
            } else {
                LogHandler::save(self::$integrationID, json_encode(['type' => 'notification', 'type_name' => 'send-notification-allMember']), 'error', json_encode("BuddyBoss message module is not active."));
            }
        }
        if ($mainAction === '12') {
            $friendId = $integrationDetails->friendId;
            $apiResponse = self::stopFollowingUser(
                $friendId
            );
        }
        if ($mainAction === '13') {
            $forum_id = $integrationDetails->forumId;
            $apiResponse = self::subscribeForum(
                $forum_id
            );
            if ($apiResponse) {
                LogHandler::save(self::$integrationID, json_encode(['type' => 'subscribe', 'type_name' => 'subscribe-forum']), 'success', json_encode("Forum subscribe successfully ."));
            } else {
                LogHandler::save(self::$integrationID, json_encode(['type' => 'subscribe', 'type_name' => 'subscribe-forum']), 'error', json_encode("Failed to subscribe Forum ."));
            }
        }
        if ($mainAction === '14') {
            $group_id = $integrationDetails->groupId;
            $friendId = $integrationDetails->friendId;
            $finalData = $this->generateReqDataFromFieldMap($fieldValues, $fieldMap);
            $apiResponse = self::addPostToGroup($group_id, $friendId, $finalData);
            if (gettype($apiResponse) === 'integer') {
                LogHandler::save(self::$integrationID, json_encode(['type' => 'post', 'type_name' => 'add-post-to-group']), 'success', json_encode("Post added to group successfully and id is -> " . $apiResponse));
            } else {
                LogHandler::save(self::$integrationID, json_encode(['type' => 'post', 'type_name' => 'add-post-to-group']), 'error', json_encode($apiResponse));
            }
        }
        if ($mainAction === '15') {
            $friendId = $integrationDetails->friendId;
            $finalData = $this->generateReqDataFromFieldMap($fieldValues, $fieldMap);
            $apiResponse = self::postActivityStream($friendId, $finalData);
            if (gettype($apiResponse) === 'integer') {
                LogHandler::save(self::$integrationID, json_encode(['type' => 'post', 'type_name' => 'add-post-sitewide-activity']), 'success', json_encode("Post added to sitewide activity stream successfully and id is -> " . $apiResponse));
            } else {
                LogHandler::save(self::$integrationID, json_encode(['type' => 'post', 'type_name' => 'add-post-sitewide-activity']), 'error', json_encode($apiResponse));
            }
        }
        if ($mainAction === '16') {
            $friendId = $integrationDetails->friendId;
            $finalData = $this->generateReqDataFromFieldMap($fieldValues, $fieldMap);
            $apiResponse = self::postActivityUsersStream($friendId, $finalData);
            if (gettype($apiResponse) === 'integer') {
                LogHandler::save(self::$integrationID, json_encode(['type' => 'post', 'type_name' => 'add-post-user-activity']), 'success', json_encode("Post added to Users activity stream successfully and id is -> " . $apiResponse));
            } else {
                LogHandler::save(self::$integrationID, json_encode(['type' => 'post', 'type_name' => 'add-post-user-activity']), 'error', json_encode($apiResponse));
            }
        }
        if ($mainAction === '17') {
            $forum_id = $integrationDetails->forumId;
            $topic_id = $integrationDetails->topicId;
            $finalData = $this->generateReqDataFromFieldMap($fieldValues, $fieldMap);
            $apiResponse = self::postReplyTopicForum($forum_id, $topic_id, $finalData);
            if (gettype($apiResponse) === 'integer') {
                LogHandler::save(self::$integrationID, json_encode(['type' => 'reply', 'type_name' => 'reply-forum-topic']), 'success', json_encode("Reply forum topic successfully and id is -> " . $apiResponse));
            } else {
                LogHandler::save(self::$integrationID, json_encode(['type' => 'reply', 'type_name' => 'reply-forum-topic']), 'error', json_encode('Failed to reply forum topic.'));
            }
        }
        if ($mainAction === '18') {
            $userStatusId = $integrationDetails->userStatusId;
            $apiResponse = self::setUserStatus($userStatusId);
            if ($apiResponse) {
                LogHandler::save(self::$integrationID, json_encode(['type' => 'user', 'type_name' => 'user-specific-status']), 'success', json_encode("Change user status successfully ."));
            } else {
                LogHandler::save(self::$integrationID, json_encode(['type' => 'user', 'type_name' => 'user-specific-status']), 'error', json_encode('To change members status in your network, please activate the Moderation component.'));
            }
        }

        return $apiResponse;
    }
}
