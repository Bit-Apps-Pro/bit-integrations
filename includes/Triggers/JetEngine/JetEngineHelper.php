<?php
namespace BitCode\FI\Triggers\JetEngine;

use WP_Query;

final class JetEngineHelper
{
    public static function commentFields()
    {
        $commentFields = [
            [
                'name' => 'comment_id',
                'type' => 'text',
                'label' => 'Comment ID',
            ],
            [
                'name' => 'comment_post_ID',
                'type' => 'text',
                'label' => 'Comment Post ID',
            ],
            [
                'name' => 'user_id',
                'type' => 'text',
                'label' => 'Comment Author ID',
            ],
            [
                'name' => 'comment_author',
                'type' => 'text',
                'label' => 'Comment Author Name',
            ],
            [
                'name' => 'comment_author_email',
                'type' => 'text',
                'label' => 'Comment Author Email',
            ],
            [
                'name' => 'comment_author_IP',
                'type' => 'text',
                'label' => 'Comment Author IP',
            ],
            [
                'name' => 'comment_agent',
                'type' => 'text',
                'label' => 'Comment Author Agent',
            ],
            [
                'name' => 'comment_author_url',
                'type' => 'text',
                'label' => 'Comment Author URL',
            ],
            [
                'name' => 'comment_content',
                'type' => 'text',
                'label' => 'Comment Content',
            ],
            [
                'name' => 'comment_type',
                'type' => 'text',
                'label' => 'Comment Type',
            ],
            [
                'name' => 'comment_parent',
                'type' => 'text',
                'label' => 'Comment Parent ID',
            ],
            [
                'name' => 'comment_date',
                'type' => 'text',
                'label' => 'Comment Date',
            ],
            [
                'name' => 'comment_date_gmt',
                'type' => 'text',
                'label' => 'Comment Date Time',
            ],

        ];
        return $commentFields;
    }

    public static function postFields()
    {
        $postFields = [
            [
                'name' => 'ID',
                'type' => 'text',
                'label' => 'Post ID',
            ],
            [
                'name' => 'post_title',
                'type' => 'text',
                'label' => 'Post Title',
            ],
            [
                'name' => 'post_content',
                'type' => 'text',
                'label' => 'Post Content',
            ],
            [
                'name' => 'post_excerpt',
                'type' => 'text',
                'label' => 'Post Excerpt',
            ],
            [
                'name' => 'guid',
                'type' => 'text',
                'label' => 'Post URL',
            ],
            [
                'name' => 'post_type',
                'type' => 'text',
                'label' => 'Post Type',
            ],
            [
                'name' => 'post_author',
                'type' => 'text',
                'label' => 'Post Author ID',
            ],
            [
                'name' => 'comment_status',
                'type' => 'text',
                'label' => 'Post Comment Status',
            ],
            [
                'name' => 'comment_count',
                'type' => 'text',
                'label' => 'Post Comment Count',
            ],
            [
                'name' => 'post_status',
                'type' => 'text',
                'label' => 'Post Status',
            ],
            [
                'name' => 'post_date',
                'type' => 'text',
                'label' => 'Post Created Date',
            ],
            [
                'name' => 'post_modified',
                'type' => 'text',
                'label' => 'Post Modified Date',
            ],
            [
                'name' => 'meta_key',
                'type' => 'text',
                'label' => 'Meta Key',
            ],
            [
                'name' => 'meta_value',
                'type' => 'text',
                'label' => 'Meta Value',
            ]
        ];
        return $postFields;
    }

    public static function getPostTypes()
    {
        $cptArguments = [
            'public' => true,
            'capability_type' => 'post',
        ];

        $types = get_post_types($cptArguments, 'object');

        $lists = [];

        foreach ($types as $key => $type) {
            $lists[$key]['id'] = $type->name;
            $lists[$key]['title'] = $type->label;
        }
        return $lists;
    }

    public static function getPostTitles()
    {
        $query = new WP_Query([
            'post_type' => 'post',
            'nopaging' => true,
        ]);

        $posts = $query->get_posts();

        $postTitles = [];

        foreach ($posts as $key => $post) {
            $postTitles[$key]['id'] = $post->ID;
            $postTitles[$key]['title'] = $post->post_title;
        }

        return $postTitles;
    }
}
