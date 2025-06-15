<?php

namespace BitCode\FI\Triggers\LearnDash;

use BitCode\FI\Flow\Flow;

final class LearnDashController
{
    public static function info()
    {
        $plugin_path = self::pluginActive('get_name');
        return [
            'name' => 'LearnDash LMS',
            'title' => 'LearnDash LMS - eLearning and online course solution',
            'slug' => $plugin_path,
            'pro' => $plugin_path,
            'type' => 'form',
            'is_active' => is_plugin_active($plugin_path),
            'activation_url' => wp_nonce_url(self_admin_url('plugins.php?action=activate&amp;plugin=' . $plugin_path . '&amp;plugin_status=all&amp;paged=1&amp;s'), 'activate-plugin_' . $plugin_path),
            'install_url' => wp_nonce_url(self_admin_url('update.php?action=install-plugin&plugin=' . $plugin_path), 'install-plugin_' . $plugin_path),
            'list' => [
                'action' => 'learndash/get',
                'method' => 'get',
            ],
            'fields' => [
                'action' => 'learndash/get/form',
                'method' => 'post',
                'data' => ['id']
            ],
        ];
    }

    public static function pluginActive($option = null)
    {
        if (is_plugin_active('learndash-propanel/learndash_propanel.php')) {
            return $option === 'get_name' ? 'learndash-propanel/learndash_propanel.php' : true;
        } elseif (is_plugin_active('learndash/learndash.php')) {
            return $option === 'get_name' ? 'learndash/learndash.php' : true;
        } elseif (is_plugin_active('sfwd-lms/sfwd_lms.php')) {
            return $option === 'get_name' ? 'sfwd-lms/sfwd_lms.php' : true;
        } else {
            return false;
        }
    }

    public function getAll()
    {
        if (!self::pluginActive()) {
            wp_send_json_error(__('LearnDash LMS is not installed or activated', 'bit-integrations'));
        }

        $types = ['A user is enrolled in a course', 'A user is unenrolled from a course', 'User completed a course',
            'User completes a lesson', 'User completes a topic', 'User attempts(pass/fail) a quiz',
            'A user fails a quiz', 'A user passes a quiz', 'A user is added to a group', 'A user is removed from a group',
            'A user submits an assignments for a lesson'
        ];
        $learndash_action = [];
        foreach ($types as $index => $type) {
            $learndash_action[] = (object)[
                'id' => $index + 1,
                'title' => $type,
            ];
        }
        wp_send_json_success($learndash_action);
    }

    public function getLessonsByCourse($queryParams)
    {
        $id = $queryParams->course_id;
        if ($id === 'any') {
            $lessons[] = [
                'lesson_id' => 'any',
                'lesson_title' => 'Any Lesson',
            ];
        } else {
            $lessonList = learndash_get_lesson_list($id, ['num' => 0]);
            $lessons = [];

            foreach ($lessonList as $key => $val) {
                $lessons[] = [
                    'lesson_id' => $val->ID,
                    'lesson_title' => $val->post_title,
                ];
            }
        }
        wp_send_json_success($lessons);
    }

    public function getTopicsByLesson($queryParams)
    {
        $course_id = $queryParams->course_id;
        $lesson_id = $queryParams->lesson_id;
        if ($lesson_id === 'any') {
            $topics[] = [
                'topic_id' => 'any',
                'topic_title' => 'Any Topic',
            ];
        } else {
            $topic_list = learndash_get_topic_list($lesson_id, $course_id);
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

    public static function getTopics()
    {
        $topics = [];

        $topic_query_args = [
            'post_type' => 'sfwd-topic',
            'post_status' => 'publish',
            'orderby' => 'post_title',
            'order' => 'ASC',
            'posts_per_page' => -1,
        ];

        $topicList = get_posts($topic_query_args);
        $topics[] = [
            'topic_id' => 'any',
            'topic_title' => 'Any Topic',
        ];

        foreach ($topicList as $key => $val) {
            $topics[] = [
                'topic_id' => $val->ID,
                'topic_title' => $val->post_title,
            ];
        }
        return $topics;
    }

    public static function getCourses()
    {
        $courses = [];

        $course_query_args = [
            'post_type' => 'sfwd-courses',
            'post_status' => 'publish',
            'orderby' => 'post_title',
            'order' => 'ASC',
            'posts_per_page' => -1,
        ];

        $courseList = get_posts($course_query_args);
        $courses[] = [
            'course_id' => 'any',
            'course_title' => 'Any Course',
        ];

        foreach ($courseList as $key => $val) {
            $courses[] = [
                'course_id' => $val->ID,
                'course_title' => $val->post_title,
            ];
        }
        return $courses;
    }

    public static function getLessons()
    {
        $lessons = [];

        $lesson_query_args = [
            'post_type' => 'sfwd-lessons',
            'post_status' => 'publish',
            'orderby' => 'post_title',
            'order' => 'ASC',
            'posts_per_page' => -1,
        ];

        $lessonList = get_posts($lesson_query_args);
        $lessons[] = [
            'lesson_id' => 'any',
            'lesson_title' => 'Any Lesson',
        ];

        foreach ($lessonList as $key => $val) {
            $lessons[] = [
                'lesson_id' => $val->ID,
                'lesson_title' => $val->post_title,
            ];
        }
        return $lessons;
    }

    public static function getQuizes()
    {
        $quizes = [];

        $quiz_query_args = [
            'post_type' => 'sfwd-quiz',
            'post_status' => 'publish',
            'orderby' => 'post_title',
            'order' => 'ASC',
            'posts_per_page' => -1,
        ];

        $quizList = get_posts($quiz_query_args);
        $quizes[] = [
            'quiz_id' => 'any',
            'quiz_title' => 'Any quiz',
        ];

        foreach ($quizList as $key => $val) {
            $quizes[] = [
                'quiz_id' => $val->ID,
                'quiz_title' => $val->post_title,
            ];
        }
        return $quizes;
    }

    public static function getGroups()
    {
        $groups = [];

        $groups_query_args = [
            'post_type' => 'groups',
            'post_status' => 'publish',
            'orderby' => 'post_title',
            'order' => 'ASC',
            'posts_per_page' => -1,
        ];

        $groupList = get_posts($groups_query_args);
        $groups[] = [
            'group_id' => 'any',
            'group_title' => 'Any group',
        ];

        foreach ($groupList as $key => $val) {
            $groups[] = [
                'group_id' => $val->ID,
                'group_title' => $val->post_title,
            ];
        }
        return $groups;
    }

    public function get_a_form($data)
    {
        if (!self::pluginActive()) {
            wp_send_json_error(__('LearnDash LMS is not installed or activated', 'bit-integrations'));
        }
        if (empty($data->id)) {
            wp_send_json_error(__('Trigger type doesn\'t exists', 'bit-integrations'));
        }
        $fields = self::fields($data->id);

        if (empty($fields)) {
            wp_send_json_error(__('Trigger doesn\'t exists any field', 'bit-integrations'));
        }
        $id = $data->id;
        if ($id == 1 || $id == 2 || $id == 3) {
            $courses = self::getCourses();
            $responseData['courses'] = $courses;
        } elseif ($id == 4 || $id == 11) {
            $courses = self::getCourses();
            $responseData['courses'] = $courses;
        } elseif ($id == 5) {
            $courses = self::getCourses();
            $responseData['courses'] = $courses;
        } elseif ($id == 6 || $id == 7 || $id == 8) {
            $quizes = self::getQuizes();
            $responseData['quizes'] = $quizes;
        } elseif ($id == 9 || $id == 10) {
            $groups = self::getGroups();
            $responseData['groups'] = $groups;
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
        if ($id == 1 || $id == 2 || $id == 3) {
            $fields = [
                'Course ID' => (object) [
                    'fieldKey' => 'course_id',
                    'fieldName' => 'Course ID'
                ],
                'Course Title' => (object) [
                    'fieldKey' => 'course_title',
                    'fieldName' => 'Course Title',
                ],
                'Course URL' => (object) [
                    'fieldKey' => 'course_url',
                    'fieldName' => 'Course URL',
                ],
                'First Name' => (object) [
                    'fieldKey' => 'first_name',
                    'fieldName' => 'First Name'
                ],
                'Last Name' => (object) [
                    'fieldKey' => 'last_name',
                    'fieldName' => 'Last Name'
                ],
                'Email' => (object) [
                    'fieldKey' => 'user_email',
                    'fieldName' => 'Email',
                ],
                'Username' => (object) [
                    'fieldKey' => 'user_login',
                    'fieldName' => 'Username',
                ],
                'Password' => (object) [
                    'fieldKey' => 'user_pass',
                    'fieldName' => 'Password'
                ],
                'Display Name' => (object) [
                    'fieldKey' => 'display_name',
                    'fieldName' => 'Display Name'
                ],
                'Nickname' => (object) [
                    'fieldKey' => 'nickname',
                    'fieldName' => 'Nickname'
                ],
                'Website' => (object) [
                    'fieldKey' => 'user_url',
                    'fieldName' => 'Website'
                ],
            ];
        } elseif ($id == 4) {
            $fields = [
                'Course ID' => (object) [
                    'fieldKey' => 'course_id',
                    'fieldName' => 'Course ID'
                ],
                'Course Title' => (object) [
                    'fieldKey' => 'course_title',
                    'fieldName' => 'Course Title',
                ],
                'Course URL' => (object) [
                    'fieldKey' => 'course_url',
                    'fieldName' => 'Course URL',
                ],
                'Lesson ID' => (object) [
                    'fieldKey' => 'lesson_id',
                    'fieldName' => 'Lesson ID'
                ],
                'Lesson Title' => (object) [
                    'fieldKey' => 'lesson_title',
                    'fieldName' => 'Lesson Title',
                ],
                'Lesson URL' => (object) [
                    'fieldKey' => 'lesson_url',
                    'fieldName' => 'Lesson URL',
                ],
                'First Name' => (object) [
                    'fieldKey' => 'first_name',
                    'fieldName' => 'First Name'
                ],
                'Last Name' => (object) [
                    'fieldKey' => 'last_name',
                    'fieldName' => 'Last Name'
                ],
                'Email' => (object) [
                    'fieldKey' => 'user_email',
                    'fieldName' => 'Email',
                ],
                'Username' => (object) [
                    'fieldKey' => 'user_login',
                    'fieldName' => 'Username',
                ],
                'Password' => (object) [
                    'fieldKey' => 'user_pass',
                    'fieldName' => 'Password'
                ],
                'Display Name' => (object) [
                    'fieldKey' => 'display_name',
                    'fieldName' => 'Display Name'
                ],
                'Nickname' => (object) [
                    'fieldKey' => 'nickname',
                    'fieldName' => 'Nickname'
                ],
                'Website' => (object) [
                    'fieldKey' => 'user_url',
                    'fieldName' => 'Website'
                ],
            ];
        } elseif ($id == 5) {
            $fields = [
                'Course ID' => (object) [
                    'fieldKey' => 'course_id',
                    'fieldName' => 'Course ID'
                ],
                'Course Title' => (object) [
                    'fieldKey' => 'course_title',
                    'fieldName' => 'Course Title',
                ],
                'Course URL' => (object) [
                    'fieldKey' => 'course_url',
                    'fieldName' => 'Course URL',
                ],
                'Lesson ID' => (object) [
                    'fieldKey' => 'lesson_id',
                    'fieldName' => 'Lesson ID'
                ],
                'Lesson Title' => (object) [
                    'fieldKey' => 'lesson_title',
                    'fieldName' => 'Lesson Title',
                ],
                'Lesson URL' => (object) [
                    'fieldKey' => 'lesson_url',
                    'fieldName' => 'Lesson URL',
                ],
                'Topic ID' => (object) [
                    'fieldKey' => 'topic_id',
                    'fieldName' => 'Topic ID'
                ],
                'Topic Title' => (object) [
                    'fieldKey' => 'topic_title',
                    'fieldName' => 'Topic Title',
                ],
                'Topic URL' => (object) [
                    'fieldKey' => 'topic_url',
                    'fieldName' => 'Topic URL',
                ],
                'First Name' => (object) [
                    'fieldKey' => 'first_name',
                    'fieldName' => 'First Name'
                ],
                'Last Name' => (object) [
                    'fieldKey' => 'last_name',
                    'fieldName' => 'Last Name'
                ],
                'Email' => (object) [
                    'fieldKey' => 'user_email',
                    'fieldName' => 'Email',
                ],
                'Username' => (object) [
                    'fieldKey' => 'user_login',
                    'fieldName' => 'Username',
                ],
                'Password' => (object) [
                    'fieldKey' => 'user_pass',
                    'fieldName' => 'Password'
                ],
                'Display Name' => (object) [
                    'fieldKey' => 'display_name',
                    'fieldName' => 'Display Name'
                ],
                'Nickname' => (object) [
                    'fieldKey' => 'nickname',
                    'fieldName' => 'Nickname'
                ],
                'Website' => (object) [
                    'fieldKey' => 'user_url',
                    'fieldName' => 'Website'
                ],
            ];
        } elseif ($id == 6) {
            $fields = [
                'Course ID' => (object) [
                    'fieldKey' => 'course_id',
                    'fieldName' => 'Course ID'
                ],
                'Course Title' => (object) [
                    'fieldKey' => 'course_title',
                    'fieldName' => 'Course Title',
                ],
                'Course URL' => (object) [
                    'fieldKey' => 'course_url',
                    'fieldName' => 'Course URL',
                ],
                'Lesson ID' => (object) [
                    'fieldKey' => 'lesson_id',
                    'fieldName' => 'Lesson ID'
                ],
                'Lesson Title' => (object) [
                    'fieldKey' => 'lesson_title',
                    'fieldName' => 'Lesson Title',
                ],
                'Lesson URL' => (object) [
                    'fieldKey' => 'lesson_url',
                    'fieldName' => 'Lesson URL',
                ],
                'Quiz ID' => (object) [
                    'fieldKey' => 'quiz_id',
                    'fieldName' => 'Quiz ID'
                ],
                'Quiz Title' => (object) [
                    'fieldKey' => 'quiz_title',
                    'fieldName' => 'Quiz Title',
                ],
                'Quiz URL' => (object) [
                    'fieldKey' => 'quiz_url',
                    'fieldName' => 'Quiz URL',
                ],
                'Score' => (object) [
                    'fieldKey' => 'score',
                    'fieldName' => 'Score',
                ],
                'Pass' => (object) [
                    'fieldKey' => 'pass',
                    'fieldName' => 'Pass',
                ],
                'Points' => (object) [
                    'fieldKey' => 'points',
                    'fieldName' => 'Points',
                ],
                'Total Points' => (object) [
                    'fieldKey' => 'total_points',
                    'fieldName' => 'Total Points',
                ],
                'Percentage' => (object) [
                    'fieldKey' => 'percentage',
                    'fieldName' => 'Percentage',
                ],
                'First Name' => (object) [
                    'fieldKey' => 'first_name',
                    'fieldName' => 'First Name'
                ],
                'Last Name' => (object) [
                    'fieldKey' => 'last_name',
                    'fieldName' => 'Last Name'
                ],
                'Email' => (object) [
                    'fieldKey' => 'user_email',
                    'fieldName' => 'Email',
                ],
                'Username' => (object) [
                    'fieldKey' => 'user_login',
                    'fieldName' => 'Username',
                ],
                'Password' => (object) [
                    'fieldKey' => 'user_pass',
                    'fieldName' => 'Password'
                ],
                'Display Name' => (object) [
                    'fieldKey' => 'display_name',
                    'fieldName' => 'Display Name'
                ],
                'Nickname' => (object) [
                    'fieldKey' => 'nickname',
                    'fieldName' => 'Nickname'
                ],
                'Website' => (object) [
                    'fieldKey' => 'user_url',
                    'fieldName' => 'Website'
                ],
            ];
        } elseif ($id == 7 || $id == 8) {
            $fields = [
                'Course ID' => (object) [
                    'fieldKey' => 'course_id',
                    'fieldName' => 'Course ID'
                ],
                'Course Title' => (object) [
                    'fieldKey' => 'course_title',
                    'fieldName' => 'Course Title',
                ],
                'Course URL' => (object) [
                    'fieldKey' => 'course_url',
                    'fieldName' => 'Course URL',
                ],
                'Lesson ID' => (object) [
                    'fieldKey' => 'lesson_id',
                    'fieldName' => 'Lesson ID'
                ],
                'Lesson Title' => (object) [
                    'fieldKey' => 'lesson_title',
                    'fieldName' => 'Lesson Title',
                ],
                'Lesson URL' => (object) [
                    'fieldKey' => 'lesson_url',
                    'fieldName' => 'Lesson URL',
                ],
                'Quiz ID' => (object) [
                    'fieldKey' => 'quiz_id',
                    'fieldName' => 'Quiz ID'
                ],
                'Quiz Title' => (object) [
                    'fieldKey' => 'quiz_title',
                    'fieldName' => 'Quiz Title',
                ],
                'Quiz URL' => (object) [
                    'fieldKey' => 'quiz_url',
                    'fieldName' => 'Quiz URL',
                ],
                'Score' => (object) [
                    'fieldKey' => 'score',
                    'fieldName' => 'Score',
                ],
                'Points' => (object) [
                    'fieldKey' => 'points',
                    'fieldName' => 'Points',
                ],
                'Total Points' => (object) [
                    'fieldKey' => 'total_points',
                    'fieldName' => 'Total Points',
                ],
                'Percentage' => (object) [
                    'fieldKey' => 'percentage',
                    'fieldName' => 'Percentage',
                ],
                'First Name' => (object) [
                    'fieldKey' => 'first_name',
                    'fieldName' => 'First Name'
                ],
                'Last Name' => (object) [
                    'fieldKey' => 'last_name',
                    'fieldName' => 'Last Name'
                ],
                'Email' => (object) [
                    'fieldKey' => 'user_email',
                    'fieldName' => 'Email',
                ],
                'Username' => (object) [
                    'fieldKey' => 'user_login',
                    'fieldName' => 'Username',
                ],
                'Password' => (object) [
                    'fieldKey' => 'user_pass',
                    'fieldName' => 'Password'
                ],
                'Display Name' => (object) [
                    'fieldKey' => 'display_name',
                    'fieldName' => 'Display Name'
                ],
                'Nickname' => (object) [
                    'fieldKey' => 'nickname',
                    'fieldName' => 'Nickname'
                ],
                'Website' => (object) [
                    'fieldKey' => 'user_url',
                    'fieldName' => 'Website'
                ],
            ];
        } elseif ($id == 9) {
            $fields = [
                'Group ID' => (object) [
                    'fieldKey' => 'group_id',
                    'fieldName' => 'Group ID'
                ],
                'Group Title' => (object) [
                    'fieldKey' => 'group_title',
                    'fieldName' => 'Group Title',
                ],
                'Group URL' => (object) [
                    'fieldKey' => 'group_url',
                    'fieldName' => 'Group URL',
                ],
                'First Name(Added User)' => (object) [
                    'fieldKey' => 'first_name',
                    'fieldName' => 'First Name (Added User)'
                ],
                'Last Name (Added User)' => (object) [
                    'fieldKey' => 'last_name',
                    'fieldName' => 'Last Name (Added User)'
                ],
                'Email (Added User)' => (object) [
                    'fieldKey' => 'user_email',
                    'fieldName' => 'Email (Added User)',
                ],
                'Username (Added User)' => (object) [
                    'fieldKey' => 'user_login',
                    'fieldName' => 'Username (Added User)',
                ],
                'Password (Added User)' => (object) [
                    'fieldKey' => 'user_pass',
                    'fieldName' => 'Password (Added User)'
                ],
                'Display Name (Added User)' => (object) [
                    'fieldKey' => 'display_name',
                    'fieldName' => 'Display Name (Added User)'
                ],
                'Nickname (Added User)' => (object) [
                    'fieldKey' => 'nickname',
                    'fieldName' => 'Nickname (Added User)'
                ],
                'Website (Added User)' => (object) [
                    'fieldKey' => 'user_url',
                    'fieldName' => 'Website (Added User)'
                ],
            ];
        } elseif ($id == 10) {
            $fields = [
                'Group ID' => (object) [
                    'fieldKey' => 'group_id',
                    'fieldName' => 'Group ID'
                ],
                'Group Title' => (object) [
                    'fieldKey' => 'group_title',
                    'fieldName' => 'Group Title',
                ],
                'Group URL' => (object) [
                    'fieldKey' => 'group_url',
                    'fieldName' => 'Group URL',
                ],
                'First Name(Removed User)' => (object) [
                    'fieldKey' => 'first_name',
                    'fieldName' => 'First Name (Removed User)'
                ],
                'Last Name (Removed User)' => (object) [
                    'fieldKey' => 'last_name',
                    'fieldName' => 'Last Name (Removed User)'
                ],
                'Email (Removed User)' => (object) [
                    'fieldKey' => 'user_email',
                    'fieldName' => 'Email (Removed User)',
                ],
                'Username (Removed User)' => (object) [
                    'fieldKey' => 'user_login',
                    'fieldName' => 'Username (Removed User)',
                ],
                'Password (Removed User)' => (object) [
                    'fieldKey' => 'user_pass',
                    'fieldName' => 'Password (Removed User)'
                ],
                'Display Name (Removed User)' => (object) [
                    'fieldKey' => 'display_name',
                    'fieldName' => 'Display Name (Removed User)'
                ],
                'Nickname (Removed User)' => (object) [
                    'fieldKey' => 'nickname',
                    'fieldName' => 'Nickname (Removed User)'
                ],
                'Website (Removed User)' => (object) [
                    'fieldKey' => 'user_url',
                    'fieldName' => 'Website (Removed User)'
                ],
            ];
        } elseif ($id == 11) {
            $fields = [
                'Course ID' => (object) [
                    'fieldKey' => 'course_id',
                    'fieldName' => 'Course ID'
                ],
                'Course Title' => (object) [
                    'fieldKey' => 'course_title',
                    'fieldName' => 'Course Title',
                ],
                'Course URL' => (object) [
                    'fieldKey' => 'course_url',
                    'fieldName' => 'Course URL',
                ],
                'Lesson ID' => (object) [
                    'fieldKey' => 'lesson_id',
                    'fieldName' => 'Lesson ID'
                ],
                'Lesson Title' => (object) [
                    'fieldKey' => 'lesson_title',
                    'fieldName' => 'Lesson Title',
                ],
                'Lesson URL' => (object) [
                    'fieldKey' => 'lesson_url',
                    'fieldName' => 'Lesson URL',
                ],
                'File Name' => (object) [
                    'fieldKey' => 'file_name',
                    'fieldName' => 'File Name'
                ],
                'File Path' => (object) [
                    'fieldKey' => 'file_path',
                    'fieldName' => 'File Path',
                ],
                'File Link' => (object) [
                    'fieldKey' => 'file_link',
                    'fieldName' => 'File Link',
                ],
                'First Name' => (object) [
                    'fieldKey' => 'first_name',
                    'fieldName' => 'First Name'
                ],
                'Last Name' => (object) [
                    'fieldKey' => 'last_name',
                    'fieldName' => 'Last Name'
                ],
                'Email' => (object) [
                    'fieldKey' => 'user_email',
                    'fieldName' => 'Email',
                ],
                'Username' => (object) [
                    'fieldKey' => 'user_login',
                    'fieldName' => 'Username',
                ],
                'Password' => (object) [
                    'fieldKey' => 'user_pass',
                    'fieldName' => 'Password'
                ],
                'Display Name' => (object) [
                    'fieldKey' => 'display_name',
                    'fieldName' => 'Display Name'
                ],
                'Nickname' => (object) [
                    'fieldKey' => 'nickname',
                    'fieldName' => 'Nickname'
                ],
                'Website' => (object) [
                    'fieldKey' => 'user_url',
                    'fieldName' => 'Website'
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
                'user_login' => $userData->user_login,
                'user_email' => $userData->user_email,
                'user_url' => $userData->user_url,
                'display_name' => $userData->display_name,
                'nickname' => $userData->user_nicename,
                'user_pass' => $userData->user_pass,
            ];
        }
        return $user;
    }

    public static function handle_course_enroll($user_id, $course_id, $access_list, $remove)
    {
        if (!empty($remove)) {
            $flows = Flow::exists('LearnDash', 2);
            $flows = self::flowFilter($flows, 'unenrollCourse', $course_id);
        } else {
            $flows = Flow::exists('LearnDash', 1);
            $flows = self::flowFilter($flows, 'selectedCourse', $course_id);
        }
        if (!$flows) {
            return;
        }

        $course = get_post($course_id);
        $course_url = get_permalink($course_id);
        $result_course = [
            'course_id' => $course->ID,
            'course_title' => $course->post_title,
            'course_url' => $course_url,
        ];
        $user = self::getUserInfo($user_id);

        $result = $result_course + $user;

        Flow::execute('LearnDash', 1, $result, $flows);
    }

    public static function handle_lesson_completed($data)
    {
        $user = $data['user']->data;
        $course = $data['course'];
        $lesson = $data['lesson'];
        if ($course && $user) {
            $course_id = $course->ID;
            $lesson_id = $lesson->ID;
            $user_id = $user->ID;
        }
        $flows = Flow::exists('LearnDash', 4);
        $flows = self::flowFilter($flows, 'selectedLesson', $lesson_id);

        if (!$flows) {
            return;
        }

        $course_url = get_permalink($course_id);
        $result_course = [
            'course_id' => $course->ID,
            'course_title' => $course->post_title,
            'course_url' => $course_url,
        ];

        $lesson_url = get_permalink($lesson_id);
        $result_lesson = [
            'lesson_id' => $lesson->ID,
            'lesson_title' => $lesson->post_title,
            'lesson_url' => $lesson_url,
        ];

        $user = self::getUserInfo($user_id);

        $lessonDataFinal = $result_course + $result_lesson + $user;
        Flow::execute('LearnDash', 4, $lessonDataFinal, $flows);
    }

    public static function handle_quiz_attempt($data, $user)
    {
        $user = $user->data;
        $course = $data['course'];
        $lesson = $data['lesson'];
        if ($course && $user) {
            $course_id = $course->ID;
            $lesson_id = $lesson->ID;
            $user_id = $user->ID;
            $quiz_id = $data['quiz'];
            $score = $data['score'];
            $pass = $data['pass'];
            $total_points = $data['total_points'];
            $points = $data['points'];
            $percentage = $data['percentage'];
        }
        for ($i = 6; $i < 9; $i++) {
            $flows = Flow::exists('LearnDash', $i);
            $flows = self::flowFilter($flows, 'selectedQuiz', $quiz_id);

            if (!$flows) {
                continue;
            }
            if ($i == 7 && $pass) {
                continue;
            }
            if ($i == 8 && !$pass) {
                continue;
            }
            $course_url = get_permalink($course_id);
            $result_course = [
                'course_id' => $course->ID,
                'course_title' => $course->post_title,
                'course_url' => $course_url,
            ];

            $lesson_url = get_permalink($lesson_id);
            $result_lesson = [
                'lesson_id' => $lesson->ID,
                'lesson_title' => $lesson->post_title,
                'lesson_url' => $lesson_url,
            ];

            $quiz_url = get_permalink($quiz_id);

            $quiz_query_args = [
                'post_type' => 'sfwd-quiz',
                'post_status' => 'publish',
                'orderby' => 'post_title',
                'order' => 'ASC',
                'posts_per_page' => 1,
                'ID' => $quiz_id,
            ];

            $quizList = get_posts($quiz_query_args);

            $result_quiz = [
                'quiz_id' => $quiz_id,
                'quiz_title' => $quizList[0]->post_title,
                'quiz_url' => $quiz_url,
                'score' => $score,
                'pass' => $pass,
                'total_points' => $total_points,
                'points' => $points,
                'percentage' => $percentage,
            ];

            $user = self::getUserInfo($user_id);

            $quizAttemptDataFinal = $result_course + $result_lesson + $result_quiz + $user;
            Flow::execute('LearnDash', $i, $quizAttemptDataFinal, $flows);
        }
    }

    public static function handle_topic_completed($data)
    {
        if (empty($data)) {
            return;
        }
        $user = $data['user']->data;
        $course = $data['course'];
        $lesson = $data['lesson'];
        $topic = $data['topic'];
        if ($course && $user && $topic) {
            $course_id = $course->ID;
            $lesson_id = $lesson->ID;
            $user_id = $user->ID;
            $topic_id = $topic->ID;
        }
        $flows = Flow::exists('LearnDash', 5);
        $flows = self::flowFilter($flows, 'selectedTopic', $topic_id);

        if (!$flows) {
            return;
        }

        $course_url = get_permalink($course_id);
        $result_course = [
            'course_id' => $course->ID,
            'course_title' => $course->post_title,
            'course_url' => $course_url,
        ];

        $lesson_url = get_permalink($lesson_id);
        $result_lesson = [
            'lesson_id' => $lesson->ID,
            'lesson_title' => $lesson->post_title,
            'lesson_url' => $lesson_url,
        ];

        $topic_url = get_permalink($topic_id);
        $result_topic = [
            'topic_id' => $topic->ID,
            'topic_title' => $topic->post_title,
            'topic_url' => $topic_url,
        ];

        $user = self::getUserInfo($user_id);

        $topicDataFinal = $result_course + $result_lesson + $result_topic + $user;
        Flow::execute('LearnDash', 5, $topicDataFinal, $flows);
    }

    public static function handle_course_completed($data)
    {
        $user = $data['user']->data;
        $course = $data['course'];
        if ($course && $user) {
            $course_id = $course->ID;
            $user_id = $user->ID;
        }
        $flows = Flow::exists('LearnDash', 3);
        $flows = self::flowFilter($flows, 'completeCourse', $course_id);
        if (!$flows) {
            return;
        }

        $course_url = get_permalink($course_id);
        $result_course = [
            'course_id' => $course->ID,
            'course_title' => $course->post_title,
            'course_url' => $course_url,
        ];
        $user = self::getUserInfo($user_id);
        $result = $result_course + $user;
        Flow::execute('LearnDash', 3, $result, $flows);
    }

    public static function handle_added_group($user_id, $group_id)
    {
        if (!$group_id || !$user_id) {
            return;
        }
        $flows = Flow::exists('LearnDash', 9);
        $flows = self::flowFilter($flows, 'selectedGroup', $group_id);

        if (!$flows) {
            return;
        }
        $group = get_post($group_id);
        $group_url = get_permalink($group_id);
        $result_group = [
            'group_id' => $group->ID,
            'group_title' => $group->post_title,
            'group_url' => $group_url,
        ];

        $user = self::getUserInfo($user_id);

        $groupDataFinal = $result_group + $user;
        Flow::execute('LearnDash', 9, $groupDataFinal, $flows);
    }

    public static function handle_removed_group($user_id, $group_id)
    {
        if (!$group_id || !$user_id) {
            return;
        }
        $flows = Flow::exists('LearnDash', 10);
        $flows = self::flowFilter($flows, 'selectedGroup', $group_id);

        if (!$flows) {
            return;
        }
        $group = get_post($group_id);
        $group_url = get_permalink($group_id);
        $result_group = [
            'group_id' => $group->ID,
            'group_title' => $group->post_title,
            'group_url' => $group_url,
        ];

        $user = self::getUserInfo($user_id);

        $groupDataFinal = $result_group + $user;
        Flow::execute('LearnDash', 10, $groupDataFinal, $flows);
    }

    public static function handle_assignment_submit($assignment_post_id, $assignment_meta)
    {
        if (!$assignment_post_id || !$assignment_meta) {
            return;
        }
        $file_name = $assignment_meta['file_name'];
        $file_link = $assignment_meta['file_link'];
        $file_path = $assignment_meta['file_path'];
        $user_id = $assignment_meta['user_id'];
        $lesson_id = $assignment_meta['lesson_id'];
        $course_id = $assignment_meta['course_id'];
        $assignment_id = $assignment_post_id;

        $flows = Flow::exists('LearnDash', 11);
        $flows = self::flowFilter($flows, 'selectedGroup', $lesson_id);

        if (!$flows) {
            return;
        }
        $course = get_post($course_id);
        $course_url = get_permalink($course_id);
        $result_course = [
            'course_id' => $course->ID,
            'course_title' => $course->post_title,
            'course_url' => $course_url,
        ];

        $lesson = get_post($lesson_id);
        $lesson_url = get_permalink($lesson_id);
        $result_lesson = [
            'lesson_id' => $lesson->ID,
            'lesson_title' => $lesson->post_title,
            'lesson_url' => $lesson_url,
        ];

        $result_assignment = [
            'assignment_id' => $assignment_id,
            'file_name' => $file_name,
            'file_link' => $file_link,
            'file_path' => $file_path,
        ];

        $user = self::getUserInfo($user_id);

        $assignmentDataFinal = $result_course + $result_lesson + $result_assignment + $user;
        Flow::execute('LearnDash', 11, $assignmentDataFinal, $flows);
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
}

// hello
