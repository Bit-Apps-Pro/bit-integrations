<?php
namespace BitCode\FI\Triggers\GamiPress;

use BitCode\FI\Flow\Flow;

final class GamiPressController
{
    public static function info()
    {
        $plugin_path = self::pluginActive('get_name');
        return [
            'name' => 'GamiPress',
            'title' => 'GamiPress - is the easiest way to gamify your WordPress website in just a few minutes, letting you award your users with digital rewards for interacting with website.',
            'slug' => $plugin_path,
            'pro' => $plugin_path,
            'type' => 'form',
            'is_active' => is_plugin_active($plugin_path),
            'activation_url' => wp_nonce_url(self_admin_url('plugins.php?action=activate&amp;plugin=' . $plugin_path . '&amp;plugin_status=all&amp;paged=1&amp;s'), 'activate-plugin_' . $plugin_path),
            'install_url' => wp_nonce_url(self_admin_url('update.php?action=install-plugin&plugin=' . $plugin_path), 'install-plugin_' . $plugin_path),
            'list' => [
                'action' => 'gamipress/get',
                'method' => 'get',
            ],
            'fields' => [
                'action' => 'gamipress/get/form',
                'method' => 'post',
                'data' => ['id']
            ],
        ];
    }

    public static function pluginActive($option = null)
    {
        if (is_plugin_active('gamipress/gamipress.php')) {
            return $option === 'get_name' ? 'gamipress/gamipress.php' : true;
        }
        return false;
    }

    public function getAll()
    {
        if (!self::pluginActive()) {
            wp_send_json_error(__('GamiPress is not installed or activated', 'bit-integrations'));
        }

        $types = ['A user earns a rank',
            'A user gains an achievement',
            'User earns an specific achievement type',
            'User achievement gets revoked',
            'User achievement of a type gets revoked',
            'User earns points',
        ];
        $gamiPress_action = [];
        foreach ($types as $index => $type) {
            $gamiPress_action[] = (object)[
                'id' => $index + 1,
                'title' => $type,
            ];
        }
        wp_send_json_success($gamiPress_action);
    }

    public function get_a_form($data)
    {
        if (!self::pluginActive()) {
            wp_send_json_error(__('GamiPress is not installed or activated', 'bit-integrations'));
        }
        if (empty($data->id)) {
            wp_send_json_error(__('Trigger type doesn\'t exists', 'bit-integrations'));
        }
        $fields = self::fields($data->id);

        if (empty($fields)) {
            wp_send_json_error(__('Trigger doesn\'t exists any field', 'bit-integrations'));
        }
        $id = $data->id;
        if ($id == 1) {
            $rankTypes = self::getRankTypes();
            $responseData['rankTypes'] = $rankTypes;
        } elseif ($id == 2 || $id == 3 || $id == 5) {
            $achievementTypes = self::getAchievementType();
            array_unshift($achievementTypes, ['post_name' => 'any-achievement', 'post_title' => 'Any Achievement']);
            $responseData['achievementTypes'] = $achievementTypes;
        }

        $responseData['fields'] = $fields;
        wp_send_json_success($responseData);
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
        $userInfoFields = [
            'First Name' => (object) [
                'fieldKey' => 'first_name',
                'fieldName' => 'First Name'
            ],
            'Last Name' => (object) [
                'fieldKey' => 'last_name',
                'fieldName' => 'Last Name'
            ],
            'User Email' => (object) [
                'fieldKey' => 'user_email',
                'fieldName' => 'User Email'
            ],
            'User Url' => (object) [
                'fieldKey' => 'user_url',
                'fieldName' => 'User Url'
            ],
            'Display Name' => (object) [
                'fieldKey' => 'display_name',
                'fieldName' => 'Display Name'
            ],
        ];
        if ($id == 1) {
            $earnRankFields = [
                'Rank Type' => (object) [
                    'fieldKey' => 'rank_type',
                    'fieldName' => 'Rank Type',
                ],
                'Rank' => (object) [
                    'fieldKey' => 'rank',
                    'fieldName' => 'Rank'
                ],
            ];

            $fields = array_merge($userInfoFields, $earnRankFields);
        } elseif ($id == 2) {
            $gainAchieveMentFields = [
                'Achievement type' => (object) [
                    'fieldKey' => 'achievement_type',
                    'fieldName' => 'Achievement type',
                ],
                'Award' => (object) [
                    'fieldKey' => 'award',
                    'fieldName' => 'Award'
                ]
            ];
            $fields = array_merge($userInfoFields, $gainAchieveMentFields);
        } elseif ($id == 3 || $id == 4 || $id == 5) {
            $fields = [
                'Post Id' => (object) [
                    'fieldKey' => 'post_id',
                    'fieldName' => 'Post Id',
                ],
                'Post Title' => (object) [
                    'fieldKey' => 'post_title',
                    'fieldName' => 'Post Title',
                ],
                'Post Url' => (object) [
                    'fieldKey' => 'post_url',
                    'fieldName' => 'Post Url',
                ],
                'Post Type' => (object) [
                    'fieldKey' => 'post_type',
                    'fieldName' => 'Post Type',
                ],
                'Post Author Id' => (object) [
                    'fieldKey' => 'post_author_id',
                    'fieldName' => 'Post Author Id',
                ],
                // 'Post Author Email' => (object) [
                //     'fieldKey' => 'post_author_email',
                //     'fieldName' => 'Post Author Email',
                // ],
                'Post Content' => (object) [
                    'fieldKey' => 'post_content',
                    'fieldName' => 'Post Content',
                ],
                'Post Parent Id' => (object) [
                    'fieldKey' => 'post_parent_id',
                    'fieldName' => 'Post Parent Id',
                ],
            ];
        } elseif ($id == 6) {
            $pointFields = [
                'Total Points' => (object) [
                    'fieldKey' => 'total_points',
                    'fieldName' => 'Total Points',
                ],
                'New Points' => (object) [
                    'fieldKey' => 'new_points',
                    'fieldName' => 'New Points',
                ],
                'Points Type' => (object) [
                    'fieldKey' => 'points_type',
                    'fieldName' => 'Points Type',
                ],
            ];
            $fields = array_merge($userInfoFields, $pointFields);
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

    public static function getRankTypes()
    {
        global $wpdb;

        return $wpdb->get_results(
            "SELECT ID, post_name, post_title, post_type FROM wp_posts where post_type like 'rank_type' AND post_status = 'publish'"
        );
    }

    public static function getAchievementType()
    {
        global $wpdb;
        return $wpdb->get_results(
            "SELECT ID, post_name, post_title, post_type FROM $wpdb->posts WHERE post_type LIKE 'achievement-type' AND post_status = 'publish' ORDER BY post_title ASC"
        );
    }

    // call from route
    public static function getAllRankBYType($query_params)
    {
        $selectRankType = $query_params->post_name;

        global $wpdb;
        $ranks = $wpdb->get_results(
            "SELECT ID, post_name, post_title, post_type FROM wp_posts where post_type like '{$selectRankType}' AND post_status = 'publish'"
        );

        wp_send_json_success($ranks);
    }

    public static function getRanks()
    {
        global $wpdb;
        return $wpdb->get_results(
            "SELECT ID, post_name, post_title, post_type FROM $wpdb->posts
             WHERE post_type LIKE 'level-1' AND post_status = 'publish' ORDER BY post_title ASC"
        );
    }

    public static function getUserInfo($user_id)
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
                'user_url' => $userData->user_url,
                'display_name' => $userData->display_name,
            ];
        }
        return $user;
    }

    public static function handle_user_earn_rank($user_id, $new_rank, $old_rank, $admin_id, $achievement_id)
    {
        $flows = Flow::exists('GamiPress', 1);

        if (!$flows) {
            return;
        }
        foreach ($flows as $flow) {
            if (is_string($flow->flow_details)) {
                $flow->flow_details = json_decode($flow->flow_details);
                $flowDetails = $flow->flow_details;
            }
        }

        $userData = self::getUserInfo($user_id);

        if ($flowDetails->selectedRank === $new_rank->post_name) {
            $newRankData = [
                'rank_type' => $new_rank->post_type,
                'rank' => $new_rank->post_name,
            ];

            $data = array_merge($userData, $newRankData);
            Flow::execute('GamiPress', 1, $data, $flows);
        }
    }

    public static function getAllAwardBYAchievementType($query_params)
    {
        $selectAchievementType = $query_params->achievement_name;

        global $wpdb;
        $awards = $wpdb->get_results(
            "SELECT ID, post_name, post_title, post_type FROM wp_posts where post_type like '{$selectAchievementType}' AND post_status = 'publish'"
        );
        wp_send_json_success($awards);
    }

    public static function handle_award_achievement($user_id, $achievement_id, $trigger, $site_id, $args)
    {
        $flows = Flow::exists('GamiPress', 2);
        if (!$flows) {
            return;
        }

        foreach ($flows as $flow) {
            if (is_string($flow->flow_details)) {
                $flow->flow_details = json_decode($flow->flow_details);
                $flowDetails = $flow->flow_details;
            }
        }

        global $wpdb;
        $awards = $wpdb->get_results(
            "SELECT ID, post_name, post_title, post_type FROM wp_posts where id = {$achievement_id}"
        );

        $userData = self::getUserInfo($user_id);
        $awardData = [
            'achievement_type' => $awards[0]->post_type,
            'award' => $awards[0]->post_name,
        ];
        $data = array_merge($userData, $awardData);

        if ($flowDetails->selectedAward === $awards[0]->post_name) {
            Flow::execute('GamiPress', 2, $data, $flows);
        }
    }

    public static function handle_gain_achievement_type($user_id, $achievement_id, $trigger, $site_id, $args)
    {
        $flows = Flow::exists('GamiPress', 3);
        if (!$flows) {
            return;
        }
        foreach ($flows as $flow) {
            if (is_string($flow->flow_details)) {
                $flow->flow_details = json_decode($flow->flow_details);
                $flowDetails = $flow->flow_details;
            }
        }

        $postData = get_post($achievement_id);

        $data = [
            'post_id' => $achievement_id,
            'post_title' => $postData->post_title,
            'post_url' => get_permalink($achievement_id),
            'post_type' => $postData->post_type,
            'post_author_id' => $postData->post_author,
            // 'post_author_email' => $postData->post_author_email,
            'post_content' => $postData->post_content,
            'post_parent_id' => $postData->post_parent,
        ];

        if ($flowDetails->selectedAchievementType === $postData->post_type || $flowDetails->selectedAchievementType === 'any-achievement') {
            Flow::execute('GamiPress', 3, $data, $flows);
        }
    }

    public static function handle_revoke_achieve($user_id, $achievement_id, $earning_id)
    {
        // $flows = Flow::exists('GamiPress', 4);
        // if (!$flows) {
        //     return;
        // }

        // $postData = get_post($achievement_id);

        // $data = [
        //     'post_id' => $achievement_id,
        //     'post_title' => $postData->post_title,
        //     'post_url' => get_permalink($achievement_id),
        //     'post_type' => $postData->post_type,
        //     'post_author_id' => $postData->post_author,
        //     // 'post_author_email' => $postData->post_author_email,
        //     'post_content' => $postData->post_content,
        //     'post_parent_id' => $postData->post_parent,
        // ];

        // Flow::execute('GamiPress', 4, $data, $flows);

        $postData = get_post($achievement_id);
        $expectedData = get_post($postData->post_parent);

        $data = [
            'post_id' => $achievement_id,
            'post_title' => !empty($expectedData->post_title) ? $expectedData->post_title : '',
            'post_url' => get_permalink($achievement_id),
            'post_type' => isset($expectedData->post_type),
            'post_author_id' => isset($expectedData->post_author),
            // 'post_author_email' => $postData->post_author_email,
            'post_content' => isset($expectedData->post_content),
            'post_parent_id' => isset($expectedData->post_parent),
        ];

        for ($i = 4; $i <= 5; $i++) {
            if ($i == 4) {
                $flows = Flow::exists('GamiPress', $i);
                Flow::execute('GamiPress', $i, $data, $flows);
            }
            if ($i == 5) {
                $flows = Flow::exists('GamiPress', $i);
                foreach ($flows as $flow) {
                    if (is_string($flow->flow_details)) {
                        $flow->flow_details = json_decode($flow->flow_details);
                        $flowDetails = $flow->flow_details;
                    }
                }
                if ($flowDetails->selectedAchievementType === $expectedData->post_type || $flowDetails->selectedAchievementType === 'any-achievement') {
                    Flow::execute('GamiPress', $i, $data, $flows);
                }
            }
        }
    }

    public static function handle_earn_points($user_id, $new_points, $total_points, $admin_id, $achievement_id, $points_type, $reason, $log_type)
    {
        $flows = Flow::exists('GamiPress', 6);
        if (!$flows) {
            return;
        }

        $userData = self::getUserInfo($user_id);
        unset($userData['user_url']);

        foreach ($flows as $flow) {
            if (is_string($flow->flow_details)) {
                $flow->flow_details = json_decode($flow->flow_details);
                $flowDetails = $flow->flow_details;
            }
        }
        $pointData = [
            'total_points' => $total_points,
            'new_points' => $new_points,
            'points_type' => $points_type,
        ];
        $data = array_merge($userData, $pointData);
        if ($flowDetails->selectedPoint === (string)$total_points || $flowDetails->selectedPoint === '') {
            Flow::execute('GamiPress', 6, $data, $flows);
        }
    }

    public static function getAllAchievementType()
    {
        $achievementTypes = self::getAchievementType();
        array_unshift($achievementTypes, ['post_name' => 'any-achievement', 'post_title' => 'Any Achievement']);
        wp_send_json_success($achievementTypes);
    }

    public static function getAllRankType()
    {
        $rankTypes = self::getRankTypes();
        wp_send_json_success($rankTypes);
    }
}
