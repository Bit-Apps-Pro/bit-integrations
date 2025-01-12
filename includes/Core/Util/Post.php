<?php

namespace BitCode\FI\Core\Util;

use WP_Post;

final class Post
{
    public static function get($id)
    {
        return (array) WP_Post::get_instance($id);
    }

    public static function getMeta($id)
    {
        return get_metadata('post', $id);
    }

    public static function all(array $args = [])
    {
        $default = [
            'post_type'      => 'post',
            'orderby'        => 'title',
            'order'          => 'ASC',
            'post_status'    => 'any',
            'posts_per_page' => -1
        ];

        $parsedArgs = wp_parse_args($args, $default);

        return get_posts($parsedArgs);
    }

    public static function getCategories($id)
    {
        $categories = [];
        $PostCategories = get_the_category($id);

        foreach ($PostCategories as $category) {
            $categories[] = $category->name;
        }

        return $categories;
    }
}
