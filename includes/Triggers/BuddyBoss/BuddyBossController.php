<?php

namespace BitCode\FI\Triggers\BuddyBoss;

use BitCode\FI\Flow\Flow;

final class BuddyBossController
{
    public static function info()
    {
        $plugin_path = self::pluginActive('get_name');
        return [
            'name' => 'BuddyBoss',
            'title' => 'BuddyBoss - most powerful & customizable open-source community platform, built on WordPress',
            'slug' => $plugin_path,
            'pro' => $plugin_path,
            'type' => 'form',
            'is_active' => is_plugin_active($plugin_path),
            'activation_url' => wp_nonce_url(self_admin_url('plugins.php?action=activate&amp;plugin=' . $plugin_path . '&amp;plugin_status=all&amp;paged=1&amp;s'), 'activate-plugin_' . $plugin_path),
            'install_url' => wp_nonce_url(self_admin_url('update.php?action=install-plugin&plugin=' . $plugin_path), 'install-plugin_' . $plugin_path),
            'list' => [
                'action' => 'buddyboss/get',
                'method' => 'get',
            ],
            'fields' => [
                'action' => 'buddyboss/get/form',
                'method' => 'post',
                'data' => ['id']
            ],
        ];
    }

    public static function pluginActive($option = null)
    {
        if (class_exists('BuddyPress')) {
            return true;
        }
        //  elseif (is_plugin_active('buddyboss-platform-pro/buddyboss-platform-pro.php')) {
        //     return $option === 'get_name' ? 'buddyboss-platform-pro/buddyboss-platform-pro.php' : true;
        // }
        else {
            return false;
        }
    }

    public function getAll()
    {
        if (!self::pluginActive()) {
            wp_send_json_error(__('BuddyBoss is not installed or activated', 'bit-integrations'));
        }

        $types = [
            'A user accepts a friend request',
            'A user sends a friend request',
            'A user creates a topic in a forum',
            'A user replies to a topic in a forum',
            'A user send an email invitation',
            'A user updates their avatar',
            'A user updates his/her profile',
            'A user account is activated',

        ];
        if (is_plugin_active('buddyboss-platform-pro/buddyboss-platform-pro.php')) {
            $types = array_merge($types, [
                'A user joins in a public group Pro',
                'A user joins in a private group Pro',
                'A user leaves/removed from a group Pro',
                'A user makes a post to the ativity stream of a group Pro',
                'A user request to access a private group Pro',
                'A user\'s email invitation results in a new member activation Pro',
                'A user\'s email invitation results in a new member registration Pro'
            ]);
        }
        $buddyboss_action = [];
        foreach ($types as $index => $type) {
            $buddyboss_action[] = (object)[
                'id' => $index + 1,
                'title' => $type,
            ];
        }
        wp_send_json_success($buddyboss_action);
    }

    public function get_a_form($data)
    {
        if (!self::pluginActive()) {
            wp_send_json_error(__('BuddyBoss is not installed or activated', 'bit-integrations'));
        }
        if (empty($data->id)) {
            wp_send_json_error(__('Trigger type doesn\'t exists', 'bit-integrations'));
        }
        $fields = self::fields($data->id);

        if (empty($fields)) {
            wp_send_json_error(__('Trigger doesn\'t exists any field', 'bit-integrations'));
        }

        $responseData['fields'] = $fields;

        $id = $data->id;
        if ($id == 3 || $id == 4) {
            $forums = self::getAllForums();
            $responseData['forums'] = $forums;
        } elseif ($id == 9 || $id == 13) {
            $groups = self::getAllGroups('public');
            $responseData['groups'] = $groups;
        } elseif ($id == 10) {
            $groups = self::getAllGroups('private');
            $responseData['groups'] = $groups;
        } elseif ($id == 11 || $id == 12) {
            $groups = self::getAllGroups('');
            $responseData['groups'] = $groups;
        }

        wp_send_json_success($responseData);
    }

    public static function getAllForums()
    {
        $forum_args = [
            'post_type' => bbp_get_forum_post_type(),
            'posts_per_page' => 999,
            'orderby' => 'title',
            'order' => 'ASC',
            'post_status' => ['publish', 'private'],
        ];

        $forumList = get_posts($forum_args);

        $forums[] = [
            'forum_id' => 'any',
            'forum_title' => 'Any Forums',
        ];

        foreach ($forumList as $key => $val) {
            $forums[] = [
                'forum_id' => $val->ID,
                'forum_title' => $val->post_title,
            ];
        }

        return $forums;
    }

    public static function getAllGroups($status)
    {
        $public_groups = groups_get_groups(
            [
                'status' => $status,
                'per_page' => -1,
            ]
        );

        if (!empty($public_groups['groups'])) {
            $public_groups = $public_groups['groups'];
        } else {
            $public_groups = [];
        }
        $groups[] = [
            'group_id' => 'any',
            'group_title' => 'Any Group',
        ];
        foreach ($public_groups as $k => $group) {
            $groups[] = [
                'group_id' => $group->id,
                'group_title' => $group->name
            ];
        }
        return $groups;
    }

    public static function fields($id)
    {
        if (empty($id)) {
            wp_send_json_error(
                __(
                    'Requested parameter is empty',
                    'bit-integrations'
                ),
                400
            );
        }
        if ($id == 1 || $id == 2) {
            $fields = [
                'First Name' => (object) [
                    'fieldKey' => 'first_name',
                    'fieldName' => 'First Name'
                ],
                'Last Name' => (object) [
                    'fieldKey' => 'last_name',
                    'fieldName' => 'Last Name'
                ],
                'Nick Name' => (object) [
                    'fieldKey' => 'nickname',
                    'fieldName' => 'Nick Name'
                ],
                'Avatar URL' => (object) [
                    'fieldKey' => 'avatar_url',
                    'fieldName' => 'Avatar URL'
                ],
                'Email' => (object) [
                    'fieldKey' => 'user_email',
                    'fieldName' => 'Email',
                ],
                'Friend ID' => (object) [
                    'fieldKey' => 'friend_id',
                    'fieldName' => 'Friend ID',
                ],
                'Friend First Name' => (object) [
                    'fieldKey' => 'friend_first_name',
                    'fieldName' => 'Friend First Name'
                ],
                'Friend Last Name' => (object) [
                    'fieldKey' => 'friend_last_name',
                    'fieldName' => 'Friend Last Name'
                ],
                'Fiend Nick Name' => (object) [
                    'fieldKey' => 'friend_nickname',
                    'fieldName' => 'Fiend Nick Name'
                ],
                'Friend Email' => (object) [
                    'fieldKey' => 'friend_email',
                    'fieldName' => 'Friend Email'
                ],
                'Friend Avatar URL' => (object) [
                    'fieldKey' => 'friend_avatar_url',
                    'fieldName' => 'Friend Avatar URL'
                ],

            ];
        } elseif ($id == 3 || $id == 4) {
            $fields = [
                'First Name' => (object) [
                    'fieldKey' => 'first_name',
                    'fieldName' => 'First Name'
                ],
                'Last Name' => (object) [
                    'fieldKey' => 'last_name',
                    'fieldName' => 'Last Name'
                ],
                'Nick Name' => (object) [
                    'fieldKey' => 'nickname',
                    'fieldName' => 'Nick Name'
                ],
                'Avatar URL' => (object) [
                    'fieldKey' => 'avatar_url',
                    'fieldName' => 'Avatar URL'
                ],
                'Email' => (object) [
                    'fieldKey' => 'user_email',
                    'fieldName' => 'Email',
                ],
                'Topic Title' => (object) [
                    'fieldKey' => 'topic_title',
                    'fieldName' => 'Topic Title',
                ],
                'Topic ID' => (object) [
                    'fieldKey' => 'topic_id',
                    'fieldName' => 'Topic ID',
                ],
                'Topic URL' => (object) [
                    'fieldKey' => 'topic_url',
                    'fieldName' => 'Topic URL',
                ],
                'Topic Content' => (object) [
                    'fieldKey' => 'topic_content',
                    'fieldName' => 'Topic Content',
                ],
                'Forum ID' => (object) [
                    'fieldKey' => 'forum_id',
                    'fieldName' => 'Forum ID',
                ],
                'Forum Title' => (object) [
                    'fieldKey' => 'forum_title',
                    'fieldName' => 'Forum Title',
                ],
                'Forum URL' => (object) [
                    'fieldKey' => 'forum_url',
                    'fieldName' => 'Forum URL',
                ],
            ];
            if ($id == 4) {
                $fields['Reply Content'] = (object) [
                    'fieldKey' => 'reply_content',
                    'fieldName' => 'Reply Content',
                ];
            }
        } elseif ($id == 7) {
            $buddyBossProfileFields = BuddyBossHelper::getBuddyBossProfileField();
            foreach ($buddyBossProfileFields as $key => $val) {
                $fields[$val->name] = (object) [
                    'fieldKey' => str_replace(' ', '_', $val->name),
                    'fieldName' => $val->name,
                ];
            }
        } elseif ($id == 9 || $id == 10 || $id == 11 || $id == 13) {
            $fields = [
                'Group Title' => (object) [
                    'fieldKey' => 'group_title',
                    'fieldName' => 'Group Title',
                ],
                'Group ID' => (object) [
                    'fieldKey' => 'group_id',
                    'fieldName' => 'Group ID',
                ],
                'Group Description' => (object) [
                    'fieldKey' => 'group_desc',
                    'fieldName' => 'Group Description',
                ],
                'First Name' => (object) [
                    'fieldKey' => 'first_name',
                    'fieldName' => 'First Name'
                ],
                'Last Name' => (object) [
                    'fieldKey' => 'last_name',
                    'fieldName' => 'Last Name'
                ],
                'Nick Name' => (object) [
                    'fieldKey' => 'nickname',
                    'fieldName' => 'Nick Name'
                ],
                'Avatar URL' => (object) [
                    'fieldKey' => 'avatar_url',
                    'fieldName' => 'Avatar URL'
                ],
                'Email' => (object) [
                    'fieldKey' => 'user_email',
                    'fieldName' => 'Email',
                ]
            ];
            if ($id == 13) {
                $fields['User Profile URL'] = (object) [
                    'fieldKey' => 'user_profile_url',
                    'fieldName' => 'User Profile URL',
                ];

                $fields['Manage Group Request URL'] = (object) [
                    'fieldKey' => 'manage_group_request_url',
                    'fieldName' => 'Manage Group Request URL',
                ];
            }
        } elseif ($id == 12) {
            $fields = [
                'Group Title' => (object) [
                    'fieldKey' => 'group_title',
                    'fieldName' => 'Group Title',
                ],
                'Group ID' => (object) [
                    'fieldKey' => 'group_id',
                    'fieldName' => 'Group ID',
                ],
                'Group Description' => (object) [
                    'fieldKey' => 'group_desc',
                    'fieldName' => 'Group Description',
                ],
                'First Name' => (object) [
                    'fieldKey' => 'first_name',
                    'fieldName' => 'First Name'
                ],
                'Last Name' => (object) [
                    'fieldKey' => 'last_name',
                    'fieldName' => 'Last Name'
                ],
                'Nick Name' => (object) [
                    'fieldKey' => 'nickname',
                    'fieldName' => 'Nick Name'
                ],
                'Avatar URL' => (object) [
                    'fieldKey' => 'avatar_url',
                    'fieldName' => 'Avatar URL'
                ],
                'Email' => (object) [
                    'fieldKey' => 'user_email',
                    'fieldName' => 'Email',
                ],
                'Activity ID' => (object) [
                    'fieldKey' => 'activity_id',
                    'fieldName' => 'Activity ID',
                ],
                'Activity URL' => (object) [
                    'fieldKey' => 'activity_url',
                    'fieldName' => 'Activity URL',
                ],
                'Activity Content' => (object) [
                    'fieldKey' => 'activity_content',
                    'fieldName' => 'Activity Content',
                ],
                'Activity Stream URL' => (object) [
                    'fieldKey' => 'activity_stream_url',
                    'fieldName' => 'Activity Stream URL',
                ],

            ];
        } else {
            $fields = [
                'First Name' => (object) [
                    'fieldKey' => 'first_name',
                    'fieldName' => 'First Name'
                ],
                'Last Name' => (object) [
                    'fieldKey' => 'last_name',
                    'fieldName' => 'Last Name'
                ],
                'Nick Name' => (object) [
                    'fieldKey' => 'nickname',
                    'fieldName' => 'Nick Name'
                ],
                'Avatar URL' => (object) [
                    'fieldKey' => 'avatar_url',
                    'fieldName' => 'Avatar URL'
                ],
                'Email' => (object) [
                    'fieldKey' => 'user_email',
                    'fieldName' => 'Email',
                ],
            ];
        }

        foreach ($fields as $field) {
            $fieldsNew[] = [
                'name' => $field->fieldKey,
                'type' => 'text',
                'label' => $field->fieldName,
            ];
        }
        return $fieldsNew;
    }

    public static function getUserInfo($user_id, $extra = false)
    {
        $userInfo = get_userdata($user_id);
        $user = [];
        if ($userInfo) {
            $userData = $userInfo->data;
            $user_meta = get_user_meta($user_id);
            $user = [
                'first_name' => $user_meta['first_name'][0],
                'last_name' => $user_meta['last_name'][0],
                'user_email' => $userData->user_email,
                'nickname' => $userData->user_nicename,
                'avatar_url' => get_avatar_url($user_id),
            ];
        }
        if ($extra == '13') {
            $user['user_profile_url'] = maybe_serialize(bbp_get_user_profile_url($user_id));
        }
        return $user;
    }

    public static function getTopicInfo($topic_id)
    {
        $topicInfo = get_post($topic_id);
        $topic = [];
        if ($topicInfo) {
            $topic = [
                'topic_title' => $topicInfo->post_title,
                'topic_id' => $topicInfo->ID,
                'topic_url' => get_permalink($topicInfo->ID),
                'topic_content' => $topicInfo->post_content,
            ];
        }
        return $topic;
    }

    public static function getForumInfo($forum_id)
    {
        $forumInfo = get_post($forum_id);
        $forum = [];
        if ($forumInfo) {
            $forum = [
                'forum_title' => $forumInfo->post_title,
                'forum_id' => $forumInfo->ID,
                'forum_url' => get_permalink($forumInfo->ID),
            ];
        }
        return $forum;
    }

    public static function getReplyInfo($reply_id)
    {
        $replyInfo = get_post($reply_id);
        $reply = [];
        if ($replyInfo) {
            $reply = [
                'reply_content' => $replyInfo->post_content,
            ];
        }
        return $reply;
    }

    public static function getGroupInfo($group_id, $status = '', $extra = false)
    {
        global $wpdb;
        if ($status == '') {
            $group = $wpdb->get_results(
                $wpdb->prepare("select id,name,description from {$wpdb->prefix}bp_groups where id = %d", $group_id)
            );
        } else {
            $group = $wpdb->get_results(
                $wpdb->prepare(
                    "SELECT id,name,description FROM {$wpdb->prefix}bp_groups WHERE id = %d AND status = %s",
                    $group_id,
                    $status
                )
            );
        }

        if (count($group)) {
            $groupInfo = [
                'group_id' => $group[0]->id,
                'group_title' => $group[0]->name,
                'group_desc' => $group[0]->description
            ];
        }
        if ($extra == '9') {
            $group_obj = groups_get_group($group_id);
            $groupInfo['manage_group_request_url'] = maybe_serialize(bp_get_group_permalink($group_obj) . 'admin/membership-requests/');
        }
        return $groupInfo;
    }

    public static function getTopicByForum($queryParams)
    {
        $forum_id = $queryParams->forum_id;
        if ($forum_id === 'any') {
            $topics[] = [
                'topic_id' => 'any',
                'topic_title' => 'Any Topic',
            ];
        } else {
            $topic_args = [
                'post_type' => bbp_get_topic_post_type(),
                'posts_per_page' => -1,
                'orderby' => 'title',
                'order' => 'ASC',
                'post_parent' => $forum_id,
                'post_status' => 'publish',
            ];

            $topic_list = get_posts($topic_args);
            $topics = [];

            foreach ($topic_list as $key => $val) {
                $topics[] = [
                    'topic_id' => $val->ID,
                    'topic_title' => $val->post_title,
                ];
            }
        }
        wp_send_json_success($topics);
    }

    public static function getActivityInfo($activity_id, $group_id, $user_id)
    {
        global $wpdb;

        $activity = $wpdb->get_results("select id,content from {$wpdb->prefix}bp_activity where id = $activity_id");

        $group = groups_get_group($group_id);
        $activityInfo = [];
        if (count($activity)) {
            $activityInfo = [
                'activity_id' => $activity[0]->id,
                'activity_url' => bp_get_group_permalink($group) . 'activity',
                'activity_content' => $activity[0]->content,
                'activity_stream_url' => bp_core_get_user_domain($user_id) . 'activity/' . $activity_id,
            ];
        }
        return $activityInfo;
    }

    public static function handle_accept_friend_request($id, $initiator_user_id, $friend_user_id, $friendship)
    {
        $flows = Flow::exists('BuddyBoss', 1);
        if (!$flows) {
            return;
        }

        $user = self::getUserInfo($friend_user_id);
        $current_user = [];
        $init_user = [];

        $current_user = [
            'first_name' => $user['first_name'],
            'last_name' => $user['last_name'],
            'user_email' => $user['user_email'],
            'nickname' => $user['nickname'],
            'avatar_url' => $user['avatar_url'],
        ];
        $user = self::getUserInfo($initiator_user_id);
        $init_user = [
            'friend_first_name' => $user['first_name'],
            'friend_last_name' => $user['last_name'],
            'friend_email' => $user['user_email'],
            'friend_nickname' => $user['nickname'],
            'friend_avatar_url' => $user['avatar_url'],
            'friend_id' => $initiator_user_id,
        ];
        $data = $current_user + $init_user;

        Flow::execute('BuddyBoss', 1, $data, $flows);
    }

    public static function handle_sends_friend_request($id, $initiator_user_id, $friend_user_id, $friendship)
    {
        $flows = Flow::exists('BuddyBoss', 2);
        if (!$flows) {
            return;
        }

        $user = self::getUserInfo($initiator_user_id);
        $current_user = [];
        $init_user = [];

        $current_user = [
            'first_name' => $user['first_name'],
            'last_name' => $user['last_name'],
            'user_email' => $user['user_email'],
            'nickname' => $user['nickname'],
            'avatar_url' => $user['avatar_url'],
        ];
        $user = self::getUserInfo($friend_user_id);
        $init_user = [
            'friend_first_name' => $user['first_name'],
            'friend_last_name' => $user['last_name'],
            'friend_email' => $user['user_email'],
            'friend_nickname' => $user['nickname'],
            'friend_avatar_url' => $user['avatar_url'],
            'friend_id' => $friend_user_id,
        ];
        $data = $current_user + $init_user;

        Flow::execute('BuddyBoss', 2, $data, $flows);
    }

    public static function handle_create_topic($topic_id, $forum_id, $anonymous_data, $topic_author)
    {
        $flows = Flow::exists('BuddyBoss', 3);
        $flows = self::flowFilter($flows, 'selectedForum', $forum_id);
        if (!$flows) {
            return;
        }

        $user = self::getUserInfo($topic_author);
        $current_user = [];

        $current_user = [
            'first_name' => $user['first_name'],
            'last_name' => $user['last_name'],
            'user_email' => $user['user_email'],
            'nickname' => $user['nickname'],
            'avatar_url' => $user['avatar_url'],
        ];

        $topics = self::getTopicInfo($topic_id);
        $forums = self::getForumInfo($forum_id);

        $data = $current_user + $topics + $forums;

        Flow::execute('BuddyBoss', 3, $data, $flows);
    }

    public static function handle_join_public_group($group_id, $user_id)
    {
        $flows = Flow::exists('BuddyBoss', 9);
        $flows = self::flowFilter($flows, 'selectedGroup', $group_id);
        if (!$flows) {
            return;
        }

        $groups = self::getGroupInfo($group_id, 'public');
        if (!count($groups)) {
            return;
        }

        $user = self::getUserInfo($user_id);
        $current_user = [];

        $current_user = [
            'first_name' => $user['first_name'],
            'last_name' => $user['last_name'],
            'user_email' => $user['user_email'],
            'nickname' => $user['nickname'],
            'avatar_url' => $user['avatar_url'],
        ];

        $data = $current_user + $groups;
        Flow::execute('BuddyBoss', 9, $data, $flows);
    }

    public static function handle_join_private_group($user_id, $group_id)
    {
        $flows = Flow::exists('BuddyBoss', 10);
        $flows = self::flowFilter($flows, 'selectedGroup', $group_id);
        if (!$flows) {
            return;
        }

        $groups = self::getGroupInfo($group_id, 'private');
        if (!count($groups)) {
            return;
        }

        $user = self::getUserInfo($user_id);
        $current_user = [];

        $current_user = [
            'first_name' => $user['first_name'],
            'last_name' => $user['last_name'],
            'user_email' => $user['user_email'],
            'nickname' => $user['nickname'],
            'avatar_url' => $user['avatar_url'],
        ];

        $data = $current_user + $groups;
        Flow::execute('BuddyBoss', 10, $data, $flows);
    }

    public static function handle_leaves_group($group_id, $user_id)
    {
        $flows = Flow::exists('BuddyBoss', 11);
        $flows = self::flowFilter($flows, 'selectedGroup', $group_id);
        if (!$flows) {
            return;
        }
        $groups = self::getGroupInfo($group_id);
        if (!count($groups)) {
            return;
        }

        $user = self::getUserInfo($user_id);
        $current_user = [];

        $current_user = [
            'first_name' => $user['first_name'],
            'last_name' => $user['last_name'],
            'user_email' => $user['user_email'],
            'nickname' => $user['nickname'],
            'avatar_url' => $user['avatar_url'],
        ];

        $data = $current_user + $groups;
        Flow::execute('BuddyBoss', 11, $data, $flows);
    }

    public static function handle_post_group_activity($content, $user_id, $group_id, $activity_id)
    {
        $flows = Flow::exists('BuddyBoss', 12);
        $flows = self::flowFilter($flows, 'selectedGroup', $group_id);
        if (!$flows) {
            return;
        }

        $groups = self::getGroupInfo($group_id);
        if (!count($groups)) {
            return;
        }

        $user = self::getUserInfo($user_id);
        $current_user = [];

        $current_user = [
            'first_name' => $user['first_name'],
            'last_name' => $user['last_name'],
            'user_email' => $user['user_email'],
            'nickname' => $user['nickname'],
            'avatar_url' => $user['avatar_url'],
        ];

        $posts = self::getActivityInfo($activity_id, $group_id, $user_id);
        $data = $current_user + $groups + $posts;
        Flow::execute('BuddyBoss', 12, $data, $flows);
    }

    public static function handle_replies_topic($reply_id, $topic_id, $forum_id)
    {
        $flows = Flow::exists('BuddyBoss', 4);
        $flows = self::flowFilter($flows, 'selectedTopic', $topic_id);
        if (!$flows) {
            return;
        }

        $topics = self::getTopicInfo($topic_id);
        if (!count($topics)) {
            return;
        }

        $forums = self::getForumInfo($forum_id);
        if (!count($forums)) {
            return;
        }

        $replies = self::getReplyInfo($reply_id);
        if (!count($replies)) {
            return;
        }

        $user_id = get_current_user_id();
        $user = self::getUserInfo($user_id);
        $current_user = [];

        $current_user = [
            'first_name' => $user['first_name'],
            'last_name' => $user['last_name'],
            'user_email' => $user['user_email'],
            'nickname' => $user['nickname'],
            'avatar_url' => $user['avatar_url'],
        ];

        $data = $current_user + $topics + $forums + $replies;
        Flow::execute('BuddyBoss', 4, $data, $flows);
    }

    public static function handle_request_private_group($user_id, $admins, $group_id, $request_id)
    {
        $flows = Flow::exists('BuddyBoss', 13);
        $flows = self::flowFilter($flows, 'selectedGroup', $group_id);
        if (!$flows) {
            return;
        }

        $groups = self::getGroupInfo($group_id, 'private', '13');
        if (!count($groups)) {
            return;
        }

        $user = self::getUserInfo($user_id, '13');
        $current_user = [];

        $current_user = [
            'first_name' => $user['first_name'],
            'last_name' => $user['last_name'],
            'user_email' => $user['user_email'],
            'nickname' => $user['nickname'],
            'avatar_url' => $user['avatar_url'],
            'user_profile_url' => $user['user_profile_url'],
        ];

        $data = $current_user + $groups;
        Flow::execute('BuddyBoss', 13, $data, $flows);
    }

    public static function handle_send_email_invites($user_id, $post)
    {
        $flows = Flow::exists('BuddyBoss', 5);
        if (!$flows) {
            return;
        }

        $user = self::getUserInfo($user_id);
        $current_user = [];

        $current_user = [
            'first_name' => $user['first_name'],
            'last_name' => $user['last_name'],
            'user_email' => $user['user_email'],
            'nickname' => $user['nickname'],
            'avatar_url' => $user['avatar_url'],
        ];

        $data = $current_user;
        Flow::execute('BuddyBoss', 5, $data, $flows);
    }

    public static function handle_update_avatar($item_id, $type, $avatar_data)
    {
        $flows = Flow::exists('BuddyBoss', 6);
        if (!$flows) {
            return;
        }

        $user_id = $avatar_data['item_id'];

        $user = self::getUserInfo($user_id);
        $current_user = [];

        $current_user = [
            'first_name' => $user['first_name'],
            'last_name' => $user['last_name'],
            'user_email' => $user['user_email'],
            'nickname' => $user['nickname'],
            'avatar_url' => $user['avatar_url'],
        ];

        $data = $current_user;
        Flow::execute('BuddyBoss', 6, $data, $flows);
    }

    public static function handle_update_profile($user_id, $posted_field_ids, $errors, $old_values, $new_values)
    {
        $flows = Flow::exists('BuddyBoss', 7);
        if (!$flows) {
            return;
        }

        // $user = self::getUserInfo($user_id);
        $current_user = [];

        // $current_user = [
        //     'first_name' => $user['first_name'],
        //     'last_name' => $user['last_name'],
        //     'user_email' => $user['user_email'],
        //     'nickname' => $user['nickname'],
        //     'avatar_url' => $user['avatar_url'],
        // ];

        $fields = self::fields(7);
        for ($i = 0; $i < count($fields); $i++) {
            $current_user[$fields[$i]['name']] = $new_values[$i + 1]['value'];
        }

        Flow::execute('BuddyBoss', 7, $current_user, $flows);
    }

    public static function handle_account_active($user_id, $key, $user)
    {
        $flows = Flow::exists('BuddyBoss', 8);
        if (!$flows) {
            return;
        }

        $user = self::getUserInfo($user_id);
        $current_user = [];

        $current_user = [
            'first_name' => $user['first_name'],
            'last_name' => $user['last_name'],
            'user_email' => $user['user_email'],
            'nickname' => $user['nickname'],
            'avatar_url' => $user['avatar_url'],
        ];

        $data = $current_user;
        Flow::execute('BuddyBoss', 8, $data, $flows);
    }

    public static function handle_invitee_active_account($user_id, $inviter_id, $post_id)
    {
        $flows = Flow::exists('BuddyBoss', 14);
        if (!$flows) {
            return;
        }

        $user = self::getUserInfo($inviter_id);
        $current_user = [];

        $current_user = [
            'first_name' => $user['first_name'],
            'last_name' => $user['last_name'],
            'user_email' => $user['user_email'],
            'nickname' => $user['nickname'],
            'avatar_url' => $user['avatar_url'],
        ];

        $data = $current_user;
        Flow::execute('BuddyBoss', 14, $data, $flows);
    }

    public static function handle_invitee_register_account($user_id, $inviter_id, $post_id)
    {
        $flows = Flow::exists('BuddyBoss', 15);
        if (!$flows) {
            return;
        }

        $user = self::getUserInfo($inviter_id);
        $current_user = [];

        $current_user = [
            'first_name' => $user['first_name'],
            'last_name' => $user['last_name'],
            'user_email' => $user['user_email'],
            'nickname' => $user['nickname'],
            'avatar_url' => $user['avatar_url'],
        ];

        $data = $current_user;
        Flow::execute('BuddyBoss', 15, $data, $flows);
    }

    protected static function flowFilter($flows, $key, $value)
    {
        $filteredFlows = [];
        foreach ($flows as $flow) {
            if (is_string($flow->flow_details)) {
                $flow->flow_details = json_decode($flow->flow_details);
            }
            if (!isset($flow->flow_details->$key) || $flow->flow_details->$key === 'any' || $flow->flow_details->$key == $value || $flow->flow_details->$key === '') {
                $filteredFlows[] = $flow;
            }
        }
        return $filteredFlows;
    }

    public static function getAllGroup($queryParams)
    {
        $select_option_id = $queryParams->select_option_id;
        if ($select_option_id == 9 || $select_option_id == 13) {
            $status = 'public';
        } elseif ($select_option_id == 10) {
            $status = 'private';
        } elseif ($select_option_id == 11 || $select_option_id == 12) {
            $status = '';
        }

        $public_groups = groups_get_groups(
            [
                'status' => $status,
                'per_page' => -1,
            ]
        );

        if (!empty($public_groups['groups'])) {
            $public_groups = $public_groups['groups'];
        } else {
            $public_groups = [];
        }
        $groups[] = [
            'group_id' => 'any',
            'group_title' => 'Any Group',
        ];
        foreach ($public_groups as $k => $group) {
            $groups[] = [
                'group_id' => $group->id,
                'group_title' => $group->name
            ];
        }
        return $groups;
    }

    public static function getAllTopic($queryParams)
    {
        $forum_id = $queryParams->forum_id;
        if ($forum_id === 'any') {
            $topics[] = [
                'topic_id' => 'any',
                'topic_title' => 'Any Topic',
            ];
        } else {
            $topic_args = [
                'post_type' => bbp_get_topic_post_type(),
                'posts_per_page' => -1,
                'orderby' => 'title',
                'order' => 'ASC',
                'post_parent' => $forum_id,
                'post_status' => 'publish',
            ];

            $topic_list = get_posts($topic_args);
            $topics = [];

            foreach ($topic_list as $key => $val) {
                $topics[] = [
                    'topic_id' => $val->ID,
                    'topic_title' => $val->post_title,
                ];
            }
        }
        wp_send_json_success($topics);
    }
}
