<?php

namespace BitCode\FI\Actions\MasterStudyLms;

class MasterStudyLmsHelper
{
    public static function getLessonByCourse($courseId)
    {
        global $wpdb;

        $lesson = $wpdb->get_results(
            $wpdb->prepare(
                "SELECT ID, post_title,post_content
                FROM {$wpdb->posts}
                WHERE FIND_IN_SET(
                    ID,
                    (SELECT meta_value FROM wp_postmeta WHERE post_id = %d AND meta_key = 'curriculum')
                )
                AND post_type = 'stm-lessons'
                ORDER BY post_title ASC
                ",
                absint($courseId)
            )
        );

        return $lesson;

        // if ($courseId == 'any') {
        //     $lesson = $wpdb->get_results(
        //         $wpdb->prepare(
        //             "SELECT ID, post_title,post_content
        //             FROM $wpdb->posts
        //             WHERE post_type = 'stm-lesson'
        //             ORDER BY post_title ASC
        //             "
        //         )
        //     );
        //     return $quizzes;
        // }
    }

    public static function getQuizByCourse($courseId)
    {
        global $wpdb;
        $quizzes = $wpdb->get_results(
            $wpdb->prepare(
                "SELECT ID, post_title,post_content
                FROM {$wpdb->posts}
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
}
