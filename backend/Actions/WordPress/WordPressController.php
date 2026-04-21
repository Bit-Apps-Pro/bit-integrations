<?php

namespace BitApps\Integrations\Actions\WordPress;

use WP_Roles;

class WordPressController
{
    public static function wordPressAuthorize()
    {
        wp_send_json_success(true);
    }

    public function execute($integrationData, $fieldValues)
    {
        $integrationDetails = $integrationData->flow_details;
        $integId            = $integrationData->id;
        $fieldMap           = isset($integrationDetails->field_map) ? $integrationDetails->field_map : [];

        $recordApiHelper   = new RecordApiHelper($integrationDetails, $integId);
        $wordPressResponse = $recordApiHelper->execute($fieldValues, $fieldMap, $integrationDetails);

        return $wordPressResponse;
    }

    public function getUsers()
    {
        $users = get_users(['fields' => ['ID', 'user_login', 'user_email', 'display_name']]);

        $result = array_map(function ($user) {
            return [
                'id'    => $user->ID,
                'label' => $user->display_name . ' (' . $user->user_email . ')',
                'value' => $user->ID,
            ];
        }, $users);

        wp_send_json_success($result);
    }

    public function getUserRoles()
    {
        global $wp_roles;

        if (!isset($wp_roles)) {
            $wp_roles = new WP_Roles();
        }

        $roles = [];

        foreach ($wp_roles->roles as $key => $role) {
            $roles[] = [
                'label' => $role['name'],
                'value' => $key,
            ];
        }

        wp_send_json_success($roles);
    }

    public function getPostTypes()
    {
        $postTypes = get_post_types(['public' => true], 'objects');

        $result = [];

        foreach ($postTypes as $postType) {
            $result[] = [
                'label' => $postType->label,
                'value' => $postType->name,
            ];
        }

        wp_send_json_success($result);
    }

    public function getPosts($data = null)
    {
        $postType = isset($data->postType) ? sanitize_text_field($data->postType) : null;

        $args = [
            'posts_per_page' => -1,
            'post_status'    => 'any',
        ];

        if ($postType) {
            $args['post_type'] = $postType;
        }

        $posts = get_posts($args);

        $result = array_map(function ($post) {
            return [
                'label' => $post->post_title,
                'value' => $post->ID,
            ];
        }, $posts);

        wp_send_json_success($result);
    }

    public function getPostTags()
    {
        wp_send_json_success($this->getTermsBy('post_tag'));
    }

    public function getTaxonomies()
    {
        $taxonomies = get_taxonomies([], 'objects');

        $result = array_values(array_map(function ($taxonomy) {
            return [
                'label' => $taxonomy->label,
                'value' => $taxonomy->name,
            ];
        }, $taxonomies));

        wp_send_json_success($result);
    }

    public function getPostCategory()
    {
        wp_send_json_success($this->getTermsBy('category'));
    }

    public function getTermsByTaxonomy($data = null)
    {
        $taxonomy = isset($data->taxonomy) ? sanitize_text_field($data->taxonomy) : '';

        if (!taxonomy_exists($taxonomy)) {
            wp_send_json_error(__('Invalid taxonomy.', 'bit-integrations'));
        }

        wp_send_json_success($this->getTermsBy($taxonomy, 'term_id', false, 'slug'));
    }

    private function getTermsBy($taxonomy, $orderby = 'term_id', $hideEmpty = false, $valueKey = 'term_id')
    {
        $terms = get_terms([
            'taxonomy'   => $taxonomy,
            'orderby'    => $orderby,
            'hide_empty' => $hideEmpty,
        ]);

        if (is_wp_error($terms)) {
            return [];
        }

        return array_map(function ($term) use ($valueKey) {
            return [
                'label' => $term->name,
                'value' => $term->{$valueKey},
            ];
        }, $terms);
    }
}
