<?php

/**
 * Fluent Community Integration
 */

namespace BitCode\FI\Actions\FluentCommunity;

use FluentCrm\App\Models\Lists;

/**
 * Provide functionality for FluentCommunity integration
 */
class FluentCommunityController
{
    private $_integrationID;

    public function __construct($integrationID)
    {
        $this->_integrationID = $integrationID;
    }

    /**
     * Fluent community plugin is exists
     *
     * @return void
     */
    public static function checkedExistsFluentCommunity()
    {
        if (!is_plugin_active('fluent-community/fluent-community.php')) {
            wp_send_json_error(wp_sprintf(__('%s is not active or not installed', 'bit-integrations'), 'Fluent Community'), 400);
        } else {
            return true;
        }
    }

    /**
     * Fetch Community spaces
     *
     * @return Fluent Community spaces
     */
    public static function fluentCommunityLists()
    {
        self::checkedExistsFluentCommunity();

        // Check if FluentCommunity plugin exists and get spaces
        if (class_exists('\FluentCommunity\App\Models\Space')) {
            $spaces = \FluentCommunity\App\Models\Space::get();
            $fluentCommunityList = [];
            foreach ($spaces as $space) {
                $fluentCommunityList[$space->title] = (object) [
                    'id'    => $space->id,
                    'title' => $space->title
                ];
            }
        } else {
            // Fallback to FluentCRM lists if FluentCommunity not available
            $lists = Lists::get();
            $fluentCommunityList = [];
            foreach ($lists as $list) {
                $fluentCommunityList[$list->title] = (object) [
                    'id'    => $list->id,
                    'title' => $list->title
                ];
            }
        }

        $response['fluentCommunityList'] = $fluentCommunityList;
        wp_send_json_success($response, 200);
    }

    /**
     * Fetch Community courses
     *
     * @return Fluent Community courses
     */
    public static function fluentCommunityCourses()
    {
        self::checkedExistsFluentCommunity();

        $fluentCommunityCourses = [];

        // Use FluentCommunity's Utility::getCourses() method
        if (class_exists('\FluentCommunity\App\Functions\Utility')) {
            $courses = \FluentCommunity\App\Functions\Utility::getCourses();

            // Handle different data formats
            if (\is_string($courses)) {
                // JSON string format
                $coursesArray = json_decode($courses, true);
                if (\is_array($coursesArray)) {
                    foreach ($coursesArray as $course) {
                        if (isset($course['title'], $course['id'])) {
                            $fluentCommunityCourses[$course['title']] = (object) [
                                'id'    => $course['id'],
                                'title' => $course['title']
                            ];
                        }
                    }
                }
            } elseif (\is_object($courses) && method_exists($courses, 'toArray')) {
                // Collection object - convert to array first
                $coursesArray = $courses->toArray();
                foreach ($coursesArray as $course) {
                    if (isset($course['title'], $course['id'])) {
                        $fluentCommunityCourses[$course['title']] = (object) [
                            'id'    => $course['id'],
                            'title' => $course['title']
                        ];
                    }
                }
            } elseif (\is_array($courses)) {
                // Array format - could be Eloquent models or regular arrays
                foreach ($courses as $course) {
                    if (\is_object($course) && method_exists($course, 'getAttributes')) {
                        // Eloquent model
                        if (isset($course->title, $course->id)) {
                            $fluentCommunityCourses[$course->title] = (object) [
                                'id'    => $course->id,
                                'title' => $course->title
                            ];
                        } else {
                            $attributes = $course->getAttributes();
                            if (isset($attributes['title'], $attributes['id'])) {
                                $fluentCommunityCourses[$attributes['title']] = (object) [
                                    'id'    => $attributes['id'],
                                    'title' => $attributes['title']
                                ];
                            }
                        }
                    } elseif (\is_array($course) && isset($course['title'], $course['id'])) {
                        // Regular array format
                        $fluentCommunityCourses[$course['title']] = (object) [
                            'id'    => $course['id'],
                            'title' => $course['title']
                        ];
                    }
                }
            }
        }

        $response['fluentCommunityCourses'] = $fluentCommunityCourses;
        wp_send_json_success($response, 200);
    }

    public static function fluentCommunityUsers()
    {
        self::checkedExistsFluentCommunity();

        $fluentCommunityUsers = [];

        // Get WordPress users
        $users = get_users([
            'number'  => 100, // Limit to 100 users
            'orderby' => 'display_name',
            'order'   => 'ASC'
        ]);

        foreach ($users as $user) {
            $fluentCommunityUsers[$user->display_name] = (object) [
                'id'           => $user->ID,
                'display_name' => $user->display_name,
                'user_email'   => $user->user_email
            ];
        }

        $response['fluentCommunityUsers'] = $fluentCommunityUsers;
        wp_send_json_success($response, 200);
    }

    /**
     * Get user ID by email
     *
     * @param string $email User email
     *
     * @return int User ID
     */
    public static function getUserByEmail($email)
    {
        $user = get_user_by('email', $email);
        error_log('user: ' . $email . print_r($user, true));

        if ($user) {
            return $user->ID;
        }
    }

    /**
     * @return true Fluent community are exists
     */
    public static function fluentCommunityAuthorize()
    {
        if (self::checkedExistsFluentCommunity()) {
            wp_send_json_success(true);
        } else {
            wp_send_json_error(
                __(
                    'Please! Install Fluent Community',
                    'bit-integrations'
                ),
                400
            );
        }
    }

    public function execute($integrationData, $fieldValues)
    {
        $integrationDetails = $integrationData->flow_details;

        $fieldMap = $integrationDetails->field_map;
        $defaultDataConf = $integrationDetails->default;
        $list_id = isset($integrationDetails->list_id) ? $integrationDetails->list_id : null;
        $tags = $integrationDetails->tags;
        $actions = $integrationDetails->actions;
        $actionName = $integrationDetails->actionName;

        if (empty($fieldMap)) {
            return new WP_Error('REQ_FIELD_EMPTY', wp_sprintf(__('module, fields are required for %s api', 'bit-integrations'), 'Fluent CRM'));
        }

        $recordApiHelper = new RecordApiHelper($this->_integrationID);

        $fluentCommunityApiResponse = $recordApiHelper->execute(
            $fieldValues,
            $fieldMap,
            $actions,
            $list_id,
            $tags,
            $actionName
        );

        if (is_wp_error($fluentCommunityApiResponse)) {
            return $fluentCommunityApiResponse;
        }

        return $fluentCommunityApiResponse;
    }
}
