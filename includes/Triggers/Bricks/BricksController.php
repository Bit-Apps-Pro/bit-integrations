<?php

namespace BitCode\FI\Triggers\Bricks;

use BitCode\FI\Flow\Flow;

final class BricksController
{
    public static function info()
    {
        $plugin_path = 'bricks/index.php';
        return [
            'name' => 'Bricks',
            'title' => 'Build With Confidence',
            'slug' => $plugin_path,
            'pro' => $plugin_path,
            'type' => 'form',
            'is_active' => self::is_bricks_active(),
            'activation_url' => wp_nonce_url(self_admin_url('plugins.php?action=activate&amp;plugin=' . $plugin_path . '&amp;plugin_status=all&amp;paged=1&amp;s'), 'activate-plugin_' . $plugin_path),
            'install_url' => wp_nonce_url(self_admin_url('update.php?action=install-plugin&plugin=' . $plugin_path), 'install-plugin_' . $plugin_path),
            'list' => [
                'action' => 'bricks/get',
                'method' => 'get',
            ],
            'fields' => [
                'action' => 'bricks/get/form',
                'method' => 'post',
                'data' => ['id']
            ],
            'note' => '<p>' . __('Select <b>"Custom"</b> as a form submit actions from your Bricks Builder sidebar.', 'bit-integrations') . '</p>',
        ];
    }

    public static function is_bricks_active()
    {
        return wp_get_theme()->get_template() === 'bricks';
    }

    public static function handle_bricks_submit($form)
    {
        $fields = $form->get_fields();
        $formId = $fields['formId'];
        $files = $form->get_uploaded_files();

        $flows = Flow::exists('Bricks', $formId);
        if (!$flows) {
            return;
        }

        $data = [];
        foreach ($fields as $key => $value) {
            $fieldId = str_replace('form-field-', '', $key);
            $data[$fieldId] = (is_array($value) && count($value) == 1) ? $value[0] : $value;
        }
        foreach ($files as $key => $item) {
            $fieldId = str_replace('form-field-', '', $key);

            if (is_array($item)) {
                foreach ($item as $file) {
                    if (!isset($file['file'])) {
                        continue;
                    }
                    $data[$fieldId][] = $file['file'];
                }
            } else {
                if (!isset($item['file'])) {
                    continue;
                }
                $data[$fieldId] = $item['file'];
            }
        }

        Flow::execute('Bricks', $formId, $data, $flows);
    }

    public function getAllForms()
    {
        if (!self::is_bricks_active()) {
            wp_send_json_error(__('Bricks is not installed or activated', 'bit-integrations'));
        }

        $posts = self::getBricksPosts();

        $all_forms = [];
        if (!empty($posts) && is_array($posts)) {
            foreach ($posts as $post) {
                $postMeta = self::getBricksPostMeta($post->ID);
                if (!isset($postMeta) || !is_array($postMeta)) {
                    continue;
                }
                foreach ($postMeta as $form) {
                    if ($form['name'] == 'form') {
                        $all_forms[] = (object) [
                            'id' => $form['id'],
                            'title' => !empty($form['label']) ? $form['label'] : 'Untitled form ' . $form['id'],
                            'post_id' => $post->ID,
                        ];
                    }
                }
            }
        }
        wp_send_json_success($all_forms);
    }

    public function getFormFields($data)
    {
        if (!self::is_bricks_active()) {
            wp_send_json_error(__('Bricks is not installed or activated', 'bit-integrations'));
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

        $postMeta = self::getBricksPostMeta($data->postId);
        if (!isset($postMeta) || !is_array($postMeta)) {
            return [];
        }
        $postDetails = array_filter($postMeta, function ($form) use ($data) {
            return $form['name'] == 'form' && $form['id'] == $data->id;
        });
        if (empty($postDetails)) {
            return $postDetails;
        }

        $fields = [];
        $postDetails = array_pop($postDetails);
        if (!isset($postDetails['settings']['fields']) || !is_array($postDetails['settings']['fields'])) {
            return $fields;
        }
        foreach ($postDetails['settings']['fields'] as $field) {
            $type = isset($field['type']) ? $field['type'] : 'text';

            if ($type === 'upload') {
                $type = 'file';
            }

            $fields[] = [
                'name' => $field['id'],
                'type' => $type,
                'label' => $field['label'],
            ];
        }
        return $fields;
    }

    private static function getBricksPosts()
    {
        global $wpdb;
        return $wpdb->get_results(
            $wpdb->prepare(
                "SELECT ID, post_title FROM $wpdb->posts
                LEFT JOIN $wpdb->postmeta ON ($wpdb->posts.ID = $wpdb->postmeta.post_id)
                 WHERE $wpdb->posts.post_status = 'publish' 
                    AND ($wpdb->posts.post_type = 'post' 
                        OR $wpdb->posts.post_type = 'page' 
                        OR $wpdb->posts.post_type = 'bricks_template' ) 
                    AND ($wpdb->postmeta.meta_key = '_bricks_page_content_2' 
                        OR $wpdb->postmeta.meta_key = '_bricks_page_footer_2' 
                        OR $wpdb->postmeta.meta_key = '_bricks_page_header_2')"
            )
        );
    }

    private static function getBricksPostMeta(int $form_id)
    {
        global $wpdb;
        $postMeta = $wpdb->get_results(
            $wpdb->prepare(
                "SELECT meta_value FROM $wpdb->postmeta 
                    WHERE post_id = %d 
                        AND (meta_key='_bricks_page_content_2' 
                            OR meta_key = '_bricks_page_footer_2' 
                            OR meta_key = '_bricks_page_header_2') 
                        LIMIT 1",
                $form_id
            )
        );
        return maybe_unserialize($postMeta[0]->meta_value);
    }
}
