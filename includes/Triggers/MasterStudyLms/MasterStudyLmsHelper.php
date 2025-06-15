<?php

namespace BitCode\FI\Triggers\MasterStudyLms;

class MasterStudyLmsHelper
{
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

        $userFields = [
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

        if ($id == 1 || $id == 3) {
            $fields = [
                'Course Id' => (object) [
                    'fieldKey' => 'course_id',
                    'fieldName' => 'Course Id'
                ],
                'Course Title' => (object) [
                    'fieldKey' => 'course_title',
                    'fieldName' => 'Course Title'
                ],
                'Course Description' => (object) [
                    'fieldKey' => 'course_description',
                    'fieldName' => 'Course Description'
                ],
            ];

            $fields = array_merge($userFields, $fields);
        } elseif ($id == 4 || $id == 5) {
            $fields = [
                'Quiz Id' => (object) [
                    'fieldKey' => 'quiz_id',
                    'fieldName' => 'Quiz Id'
                ],
                'Quiz Title' => (object) [
                    'fieldKey' => 'quiz_title',
                    'fieldName' => 'Quiz Title'
                ],
                'Quiz Description' => (object) [
                    'fieldKey' => 'quiz_description',
                    'fieldName' => 'Quiz Description'
                ],
                'Course Id' => (object) [
                    'fieldKey' => 'course_id',
                    'fieldName' => 'Course Id'
                ],
                'Course Title' => (object) [
                    'fieldKey' => 'course_title',
                    'fieldName' => 'Course Title'
                ],
                'Course Description' => (object) [
                    'fieldKey' => 'course_description',
                    'fieldName' => 'Course Description'
                ],
            ];

            $fields = array_merge($userFields, $fields);
        } elseif ($id == 2) {
            $fields = [
                'Lesson Id' => (object) [
                    'fieldKey' => 'lesson_id',
                    'fieldName' => 'Lesson Id'
                ],
                'Lesson Title' => (object) [
                    'fieldKey' => 'lesson_title',
                    'fieldName' => 'Lesson Title'
                ],
                'Lesson Description' => (object) [
                    'fieldKey' => 'lesson_description',
                    'fieldName' => 'Lesson Description'
                ],
            ];

            $fields = array_merge($userFields, $fields);
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

    public static function getAllCourse()
    {
        $allCourse = [];
        $args = [
            'post_type' => 'stm-courses',
            'posts_per_page' => 999,
            'orderby' => 'title',
            'order' => 'ASC',
            'post_status' => 'publish',
        ];
        $courses = get_posts($args);
        foreach ($courses as $key => $value) {
            $allCourse[] = [
                'id' => $value->ID,
                'title' => $value->post_title,
            ];
        }
        return $allCourse;
    }

    public static function getAllQuiz($courseId)
    {
        global $wpdb;
        if ($courseId == 'any') {
            $quizzes = $wpdb->get_results(
                $wpdb->prepare(
                    "SELECT ID, post_title,post_content
                    FROM $wpdb->posts
                    WHERE post_type = 'stm-quizzes'
                    ORDER BY post_title ASC
                    "
                )
            );
            return $quizzes;
        }
        $quizzes = $wpdb->get_results(
            $wpdb->prepare(
                "SELECT ID, post_title,post_content
                FROM $wpdb->posts
                WHERE FIND_IN_SET(
                    ID,
                    (SELECT meta_value FROM wp_postmeta WHERE post_id = %d AND meta_key = 'curriculum')
                )
                AND post_type = 'stm-quizzes'
                ORDER BY post_title ASC
                ",
                absint($courseId)
            )
        );
        return $quizzes;
    }

    public static function getCourseDetail($courseId)
    {
        global $wpdb;

        return $wpdb->get_results(
            $wpdb->prepare(
                "SELECT ID, post_title,post_content FROM $wpdb->posts
                WHERE $wpdb->posts.post_status = 'publish' AND $wpdb->posts.post_type = 'stm-courses' AND $wpdb->posts.ID = %d",
                $courseId
            )
        );
    }

    public static function getQuizDetails($quiz_id)
    {
        global $wpdb;

        return $wpdb->get_results(
            $wpdb->prepare(
                "SELECT ID, post_title,post_content FROM $wpdb->posts
                 WHERE $wpdb->posts.post_status = 'publish' AND $wpdb->posts.post_type = 'stm-quizzes' AND $wpdb->posts.ID = %d",
                $quiz_id
            )
        );
    }

    public static function getLessonDetail($lessonId)
    {
        global $wpdb;

        return $wpdb->get_results(
            $wpdb->prepare(
                "SELECT ID, post_title,post_content FROM $wpdb->posts
        WHERE $wpdb->posts.post_status = 'publish' AND $wpdb->posts.post_type = 'stm-lessons' AND $wpdb->posts.ID = %d",
                $lessonId
            )
        );
    }

    public static function getAllLesson()
    {
        $allLesson = [];
        $args = [
            'post_type' => 'stm-lessons',
            'posts_per_page' => 999,
            'orderby' => 'title',
            'order' => 'ASC',
            'post_status' => 'publish',
        ];
        $lessons = get_posts($args);
        foreach ($lessons as $key => $value) {
            $allLesson[] = [
                'id' => $value->ID,
                'title' => $value->post_title,
            ];
        }
        return $allLesson;
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
                'nickname' => $userData->user_nicename,
                'avatar_url' => get_avatar_url($user_id),
            ];
        }
        return $user;
    }
}
