<?php

namespace BitCode\FI\Triggers\Post;

use BitCode\FI\Flow\Flow;
use BitCode\FI\Triggers\Post\PostHelper;

final class PostController
{
    public static function info()
    {
        return [
            'name' => 'Post',
            'title' => 'Post',
            'type' => 'form',
            'trigger' => 'Post',
            'is_active' => true,
            'list' => [
                'action' => 'post/get',
                'method' => 'get',
            ],
            'fields' => [
                'action' => 'post/get/form',
                'method' => 'post',
                'data' => ['id'],
            ],
            'isPro' => false,
        ];
    }

    public static function fields($id)
    {
        $triggerIdList = [1, 2, 3, 4, 6, 9];

        if (in_array($id, $triggerIdList)) {
            $fields = PostHelper::postFields();
        }

        if ($id == 5 || $id == 7 || $id == 8) {
            $fields = PostHelper::commentFields();
        }

        return $fields;
    }

    public function getAll()
    {
        $triggers = [
            ['id' => 1, 'title' => 'Create a new post'],
            ['id' => 2, 'title' => 'Updated a post'],
            ['id' => 3, 'title' => 'Delete a post'],
            ['id' => 4, 'title' => 'User views a post'],
            ['id' => 5, 'title' => 'User comments on a post'],
            ['id' => 6, 'title' => 'Change post status'],
            ['id' => 7, 'title' => 'Comment deleted on a post'],
            ['id' => 8, 'title' => 'Comment updated on a post'],
            ['id' => 9, 'title' => 'Post trashed']
        ];

        wp_send_json_success($triggers);
    }

    public function get_a_form($data)
    {
        $responseData = [];
        $missing_field = null;

        if (!property_exists($data, 'id')) {
            $missing_field = 'Form ID';
        }

        if (!is_null($missing_field)) {
            wp_send_json_error(sprintf(__('%s can\'t be empty', 'bit-integrations'), $missing_field));
        }

        $ids = [1, 2, 3, 6];

        if (in_array($data->id, $ids)) {
            $responseData['types'] = array_values(PostHelper::getPostTypes());
            array_unshift($responseData['types'], ['id' => 'any-post-type', 'title' => 'Any Post Type']);
        }
        $postTitleIds = [4, 5, 7, 8, 9];
        if (in_array($data->id, $postTitleIds)) {
            $responseData['posts'] = PostHelper::getPostTitles();
            array_unshift($responseData['posts'], ['id' => 'any-post', 'title' => 'Any Post']);
        }

        $responseData['fields'] = self::fields($data->id);

        if (count($responseData['fields']) <= 0) {
            wp_send_json_error(__('Form fields doesn\'t exists', 'bit-integrations'));
        }

        wp_send_json_success($responseData);
    }

    public static function createPost($postId, $newPostData, $update, $beforePostData)
    {
        if ('publish' !== $newPostData->post_status || 'revision' === $newPostData->post_type || (!empty($beforePostData->post_status) && 'publish' === $beforePostData->post_status)) {
            return false;
        }

        $postCreateFlow = Flow::exists('Post', 1);

        if ($postCreateFlow) {
            $flowDetails = $postCreateFlow[0]->flow_details;

            if (is_string($postCreateFlow[0]->flow_details)) {
                $flowDetails = json_decode($postCreateFlow[0]->flow_details);
            }

            if (isset($newPostData->post_content)) {
                $newPostData->post_content = trim(strip_tags($newPostData->post_content));
                $newPostData->post_permalink = get_permalink($newPostData);
            }

            if (isset($flowDetails->selectedPostType) && ($flowDetails->selectedPostType == 'any-post-type' || $flowDetails->selectedPostType == $newPostData->post_type)) {
                if (has_post_thumbnail($postId)) {
                    $featured_image_url = get_the_post_thumbnail_url($postId, 'full');
                    $newPostData->featured_image = $featured_image_url;
                }
                if (!$update) {
                    Flow::execute('Post', 1, (array) $newPostData, $postCreateFlow);
                } else {
                    Flow::execute('Post', 1, (array) $newPostData, $postCreateFlow);
                }
            }
        }
    }

    public static function postComment($cmntId, $status, $cmntData)
    {
        $cmntTrigger = Flow::exists('Post', 5);

        if ($cmntTrigger) {
            $flowDetails = $cmntTrigger[0]->flow_details;

            if (is_string($cmntTrigger[0]->flow_details)) {
                $flowDetails = json_decode($cmntTrigger[0]->flow_details);
            }

            if (isset($flowDetails->selectedPostId) && $flowDetails->selectedPostId == 'any-post' || $flowDetails->selectedPostId == $cmntData['comment_post_ID']) {
                $cmntData['comment_id'] = $cmntId;

                Flow::execute('Post', 5, (array) $cmntData, $cmntTrigger);
            }
        }
    }

    public static function deletePost($postId, $deletedPost)
    {
        $postDeleteTrigger = Flow::exists('Post', 3);

        if ($postDeleteTrigger) {
            $flowDetails = $postDeleteTrigger[0]->flow_details;

            if (is_string($postDeleteTrigger[0]->flow_details)) {
                $flowDetails = json_decode($postDeleteTrigger[0]->flow_details);
            }

            if (isset($deletedPost->post_content)) {
                $deletedPost->post_content = trim(strip_tags($deletedPost->post_content));
                $deletedPost->post_permalink = get_permalink($deletedPost);
            }

            if (isset($flowDetails->selectedPostType) && $flowDetails->selectedPostType == 'any-post-type' || $flowDetails->selectedPostType == $deletedPost->post_type) {
                Flow::execute('Post', 5, (array) $deletedPost, $postDeleteTrigger);
            }
        }
    }

    public static function viewPost($content)
    {
        $postViewTrigger = Flow::exists('Post', 4);

        if (is_single() && !empty($GLOBALS['post'])) {
            if (isset($postViewTrigger[0]->selectedPostId) && $postViewTrigger[0]->selectedPostId == 'any-post' || $GLOBALS['post']->ID == get_the_ID()) {
                Flow::execute('Post', 5, (array) $GLOBALS['post'], $postViewTrigger);
            }
        }

        return $content;
    }

    public static function postUpdated($postId, $updatedPostData)
    {
        $postUpdateFlow = Flow::exists('Post', 2);
        if ($postUpdateFlow) {
            $flowDetails = $postUpdateFlow[0]->flow_details;
            if (is_string($postUpdateFlow[0]->flow_details)) {
                $flowDetails = json_decode($postUpdateFlow[0]->flow_details);
            }
            if (isset($updatedPostData->post_content)) {
                $updatedPostData->post_content = trim(strip_tags($updatedPostData->post_content));
                $updatedPostData->post_permalink = get_permalink($updatedPostData);
            }

            if (isset($flowDetails->selectedPostType) && $flowDetails->selectedPostType == 'any-post-type' || $flowDetails->selectedPostType == $updatedPostData->post_type) {
                if (has_post_thumbnail($postId)) {
                    $featured_image_url = get_the_post_thumbnail_url($postId, 'full');
                    $updatedPostData->featured_image = $featured_image_url;
                }
                Flow::execute('Post', 2, (array) $updatedPostData, $postUpdateFlow);
            }
        }
    }

    public static function changePostStatus($newStatus, $oldStatus, $post)
    {
        $statusChangeTrigger = Flow::exists('Post', 6);

        if ($statusChangeTrigger) {
            $flowDetails = $statusChangeTrigger[0]->flow_details;

            if (is_string($statusChangeTrigger[0]->flow_details)) {
                $flowDetails = json_decode($statusChangeTrigger[0]->flow_details);
            }

            if (isset($post->post_content)) {
                $post->post_content = trim(strip_tags($post->post_content));
                $post->post_permalink = get_permalink($post);
            }
            if (has_post_thumbnail($post->id)) {
                $post->featured_image = get_the_post_thumbnail_url($post->id, 'full');
            }

            if (isset($flowDetails->selectedPostType) && $flowDetails->selectedPostType == 'any-post-type' || $flowDetails->selectedPostType == $post->post_type && $newStatus != $oldStatus) {
                Flow::execute('Post', 6, (array) $post, $statusChangeTrigger);
            }
        }
    }

    public static function trashComment($cmntId, $cmntData)
    {
        $cmntTrigger = Flow::exists('Post', 7);
        if ($cmntTrigger) {
            $flowDetails = $cmntTrigger[0]->flow_details;

            if (is_string($cmntTrigger[0]->flow_details)) {
                $flowDetails = json_decode($cmntTrigger[0]->flow_details);
            }

            $cmntData = (array)$cmntData;
            if (isset($flowDetails->selectedPostId) && $flowDetails->selectedPostId == 'any-post' || $flowDetails->selectedPostId == $cmntData['comment_post_ID']) {
                $cmntData['comment_id'] = $cmntId;
                Flow::execute('Post', 7, (array) $cmntData, $cmntTrigger);
            }
        }
    }

    public static function updateComment($cmntId, $cmntData)
    {
        $cmntTrigger = Flow::exists('Post', 8);
        if ($cmntTrigger) {
            $flowDetails = $cmntTrigger[0]->flow_details;

            if (is_string($cmntTrigger[0]->flow_details)) {
                $flowDetails = json_decode($cmntTrigger[0]->flow_details);
            }

            $cmntData = (array)$cmntData;
            if (isset($flowDetails->selectedPostId) && $flowDetails->selectedPostId == 'any-post' || $flowDetails->selectedPostId == $cmntData['comment_post_ID']) {
                $cmntData['comment_id'] = $cmntId;
                Flow::execute('Post', 8, (array) $cmntData, $cmntTrigger);
            }
        }
    }

    public static function trashPost($trashPostId)
    {
        $postUpdateFlow = Flow::exists('Post', 9);
        $postData = get_post($trashPostId);
        $postData->post_permalink = get_permalink($postData);

        if ($postUpdateFlow) {
            $flowDetails = $postUpdateFlow[0]->flow_details;

            if (is_string($postUpdateFlow[0]->flow_details)) {
                $flowDetails = json_decode($postUpdateFlow[0]->flow_details);
            }
            $postData = (array)$postData;
            if (isset($flowDetails->selectedPostType) && $flowDetails->selectedPostType == 'any-post-type' || $flowDetails->selectedPostType == $postData['ID']) {
                Flow::execute('Post', 9, (array) $postData, $postUpdateFlow);
            }
        }
    }

    public static function getAllPostTypes()
    {
        $types = array_values(PostHelper::getPostTypes());
        array_unshift($types, ['id' => 'any-post-type', 'title' => 'Any Post Type']);
        wp_send_json_success($types);
    }

    public static function getAllPosts()
    {
        $posts = PostHelper::getPostTitles();
        array_unshift($posts, ['id' => 'any-post', 'title' => 'Any Post']);
        wp_send_json_success($posts);
    }
}
