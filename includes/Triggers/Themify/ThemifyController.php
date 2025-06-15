<?php

namespace BitCode\FI\Triggers\Themify;

use BitCode\FI\Flow\Flow;

final class ThemifyController
{
    // public static function info()
    // {
    //     $plugin_path = self::pluginActive('get_name');
    //     return [
    //         'name' => 'Themify',
    //         'title' => 'Themify is the platform web creators choose to build professional WordPress websites, grow their skills, and build their business. Start for free today!',
    //         'icon_url' => 'https://themify.me/wp-content/themes/themify-v32/images/themify-logo.png',
    //         'slug' => $plugin_path,
    //         'pro' => $plugin_path,
    //         'type' => 'form',
    //         'is_active' => is_plugin_active($plugin_path),
    //         'activation_url' => wp_nonce_url(self_admin_url('plugins.php?action=activate&amp;plugin=' . $plugin_path . '&amp;plugin_status=all&amp;paged=1&amp;s'), 'activate-plugin_' . $plugin_path),
    //         'install_url' => wp_nonce_url(self_admin_url('update.php?action=install-plugin&plugin=' . $plugin_path), 'install-plugin_' . $plugin_path),
    //         'list' => [
    //             'action' => 'themify/get',
    //             'method' => 'get',
    //         ],
    //         'fields' => [
    //             'action' => 'themify/get/form',
    //             'method' => 'post',
    //             'data' => ['id']
    //         ],
    //     ];
    // }

    public static function pluginActive($option = null)
    {
        if (is_plugin_active('themify-builder/themify-builder.php')) {
            return $option === 'get_name' ? 'themify-builder/themify-builder.php' : true;
        } else {
            return false;
        }
    }

    public static function handle_themify_submit($record)
    {
        var_dump($record, '----------------');
        die;
    }

    public function getAllForms()
    {
        if (!self::pluginActive()) {
            wp_send_json_error(__('Themify is not installed or activated', 'bit-integrations'));
        }

        $posts = self::getThemifyPosts();

        $all_forms = [];
        if ($posts) {
            foreach ($posts as $post) {
                $postMeta = self::getThemifyPostMeta($post->ID);
                $form_type = $postMeta[0]->cols[0]->modules[0]->mod_name;

                if ($form_type === 'signup-form') {
                    $forms = self::getAllFormsFromPostMeta($postMeta);
                    foreach ($forms as $form) {
                        $all_forms[] = (object)[
                            'id' => $form->id,
                            'title' => $form->title,
                            'post_id' => $post->ID,
                            'fields' => $form->fields,
                        ];
                    }
                }
            }
        }
        wp_send_json_success($all_forms);
    }

    public function getFormFields($data)
    {
        if (!self::pluginActive()) {
            wp_send_json_error(__('Themify is not installed or activated', 'bit-integrations'));
        }
        if (empty($data->id) && empty($data->postId)) {
            wp_send_json_error(__('Form doesn\'t exists', 'bit-integrations'));
        }

        $fields = self::fields($data);
        if (empty($fields)) {
            wp_send_json_error(__('Form doesn\'t exists any field', 'bit-integrations'));
        }

        $responseData['fields'] = $fields;
        $responseData['postId'] = $data->postId;
        wp_send_json_success($responseData);
    }

    public static function fields($data)
    {
        if (!isset($data->postId)) {
            return;
        }
        $postMeta = self::getThemifyPostMeta($data->postId);
        $forms = self::getAllFormsFromPostMeta($postMeta);
        $postDetails = array_filter($forms, function ($form) use ($data) {
            return $form->id == $data->id;
        });
        if (empty($postDetails)) {
            return $postDetails;
        }

        $fields = [];
        $postDetails = array_pop($postDetails);
        foreach ($postDetails->fields as $key => $value) {
            if (substr($key, 0, 2) === 'l_') {
                $fields[] = [
                    'name' => $key,
                    'label' => $value,
                    'type' => 'text',
                ];
            }
        }
        return $fields;
    }

    public static function getAllFormsFromPostMeta($postMeta)
    {
        $forms = [];
        foreach ($postMeta as $widgets) {
            foreach ($widgets->cols as $singleWidget) {
                foreach ($singleWidget->modules as $element) {
                    foreach ($element->mod_settings as $key => $value) {
                        if ($key === 'mod_title') {
                            $forms[] = (object)[
                                'id' => $element->element_id,
                                'title' => $value,
                                'fields' => $element->mod_settings,
                            ];
                        }
                    }
                }
            }
        }
        return $forms;
    }

    private static function getThemifyPosts()
    {
        global $wpdb;


        return $wpdb->get_results(
            $wpdb->prepare(
                "SELECT ID, post_title FROM $wpdb->posts
        LEFT JOIN $wpdb->postmeta ON ($wpdb->posts.ID = $wpdb->postmeta.post_id)
        WHERE $wpdb->posts.post_status = 'publish' AND ($wpdb->posts.post_type = 'post' OR $wpdb->posts.post_type = 'page') AND $wpdb->postmeta.meta_key = '_themify_builder_settings_json'"
            )
        );
    }

    private static function getThemifyPostMeta(int $form_id)
    {
        global $wpdb;
        $postMeta = $wpdb->get_results("SELECT meta_value FROM $wpdb->postmeta WHERE post_id=$form_id AND meta_key='_themify_builder_settings_json' LIMIT 1");
        return json_decode($postMeta[0]->meta_value);
    }
}
