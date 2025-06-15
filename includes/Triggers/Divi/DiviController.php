<?php

namespace BitCode\FI\Triggers\Divi;

use BitCode\FI\Flow\Flow;

final class DiviController
{
    public static function info()
    {
        $plugin_path = 'Divi/index.php';
        return [
            'name' => 'Divi',
            'title' => 'Divi isn\'t just a WordPress theme, it\'s a complete design framework that allows you to design and customize every part of your website from the ground up.',
            'slug' => $plugin_path,
            'pro' => $plugin_path,
            'type' => 'form',
            'is_active' => self::is_divi_active(),
            'activation_url' => wp_nonce_url(self_admin_url('plugins.php?action=activate&amp;plugin=' . $plugin_path . '&amp;plugin_status=all&amp;paged=1&amp;s'), 'activate-plugin_' . $plugin_path),
            'install_url' => wp_nonce_url(self_admin_url('update.php?action=install-plugin&plugin=' . $plugin_path), 'install-plugin_' . $plugin_path),
            'list' => [
                'action' => 'divi/get',
                'method' => 'get',
            ],
            'fields' => [
                'action' => 'divi/get/form',
                'method' => 'post',
                'data' => ['id']
            ],
            'note' => '<p>Tested version: 4.14.8.</p>'
        ];
    }

    public static function is_divi_active()
    {
        $diviThemes = [
            'divi',
            'extra',
            'bloom',
            'monarch',
        ];
        return in_array(strtolower(wp_get_theme()->get_template()), $diviThemes);
    }

    public static function handle_divi_submit($et_pb_contact_form_submit, $et_contact_error, $contact_form_info)
    {
        $form_id = $contact_form_info['contact_form_unique_id'] . '_' . $contact_form_info['contact_form_number'];
        $flows = Flow::exists('Divi', $form_id);
        if (!$flows || $et_contact_error) {
            return;
        }

        $data = [];
        $fields = $et_pb_contact_form_submit;
        foreach ($fields as $key => $field) {
            $data[$key] = $field['value'];
        }

        Flow::execute('Divi', $form_id, $data, $flows);
    }

    public static function parseContentGetForms($content)
    {
        $forms = [];
        $contentArray = explode('][', $content);
        foreach ($contentArray as $line) {
            $lineArray = explode(' ', $line);
            if ($lineArray[0] == 'et_pb_contact_form') {
                $regularExpressionUniqueId = '/unique_id\s*=\s*"([^"]+)"/';
                preg_match($regularExpressionUniqueId, $line, $uniqueId);

                $regularExpressionTitle = '/title\s*=\s*"([^"]+)"/';
                preg_match($regularExpressionTitle, $line, $title);

                if (empty($uniqueId[1])) {
                    continue;
                }
                $forms[] = (object)[
                    'uniqueId' => $uniqueId[1],
                    'title' => !empty($title[1]) ? $title[1] : 'Untitled (' . $uniqueId[1] . ')',
                ];
            }
        }
        return $forms;
    }

    public function getAllForms()
    {
        if (!self::is_divi_active()) {
            wp_send_json_error(__('Divi is not installed or activated', 'bit-integrations'));
        }

        $posts = self::getDiviPosts();

        $all_forms = [];
        if (!empty($posts) && is_array($posts)) {
            foreach ($posts as $post) {
                $forms = self::parseContentGetForms($post->post_content);
                $formPostfix = 0;

                foreach ($forms as $form) {
                    $all_forms[] = (object)[
                        'id' => $form->uniqueId . '_' . $formPostfix,
                        'title' => $form->title,
                        'post_id' => $post->ID,
                    ];
                    $formPostfix += 1;
                }
            }
        }
        wp_send_json_success($all_forms);
    }

    public function getFormFields($data)
    {
        if (!self::is_divi_active()) {
            wp_send_json_error(__('Divi is not installed or activated', 'bit-integrations'));
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

    public static function parseContentGetFormFields($content, $formUniqueId)
    {
        $formStart = 0;
        $formFields = [];
        $countdown = 0;
        $contentArray = explode('][', $content);
        foreach ($contentArray as $line) {
            $lineArray = explode(' ', $line);
            if ($lineArray[0] == 'et_pb_contact_form') {
                $regularExpressionUniqueId = '/unique_id\s*=\s*"([^"]+)"/';
                preg_match($regularExpressionUniqueId, $line, $uniqueId);
            }

            if ($lineArray[0] == 'et_pb_contact_field') {
                $regularExpressionUniqueId = '/field_id\s*=\s*"([^"]+)"/';
                preg_match($regularExpressionUniqueId, $line, $fieldId);
                $regularExpressionUniqueId = '/field_type\s*=\s*"([^"]+)"/';
                preg_match($regularExpressionUniqueId, $line, $fieldType);
                $regularExpressionUniqueId = '/field_title\s*=\s*"([^"]+)"/';
                preg_match($regularExpressionUniqueId, $line, $fieldTitle);
                $formFields["$uniqueId[1]" . '_' . $countdown][] = (object)[
                    'field_id' => strtolower($fieldId[1]),
                    'field_type' => strtolower(isset($fieldType[1]) ? $fieldType[1] : 'text'),
                    'field_title' => isset($fieldTitle[1]) ? $fieldTitle[1] : $fieldId[1],
                ];
            }

            if ($lineArray[0] == '/et_pb_contact_form') {
                $countdown += 1;
            }
        }
        foreach ($formFields as $key => $formField) {
            if ($key == $formUniqueId) {
                return $formField;
            }
        }
    }

    public static function fields($data)
    {
        if (!isset($data->postId)) {
            return;
        }

        $postContent = get_post_field('post_content', $data->postId);
        if (empty($postContent)) {
            return;
        }
        $formFields = self::parseContentGetFormFields($postContent, $data->id);

        $fields = [];
        foreach ($formFields as $field) {
            $type = $field->field_type;
            if ($type === 'upload') {
                $type = 'file';
            }

            $fields[] = [
                'name' => $field->field_id,
                'type' => $type,
                'label' => $field->field_title,
            ];
        }
        return $fields;
    }

    private static function getDiviPosts()
    {
        global $wpdb;

        return $wpdb->get_results(
            $wpdb->prepare(
                "SELECT ID, post_title, post_content FROM $wpdb->posts
                    LEFT JOIN $wpdb->postmeta ON ($wpdb->posts.ID = $wpdb->postmeta.post_id)
                        WHERE $wpdb->posts.post_status = 'publish' AND ($wpdb->posts.post_type = 'post' OR $wpdb->posts.post_type = 'page' OR $wpdb->posts.post_type = 'et_footer_layout' OR $wpdb->posts.post_type = 'et_header_layout' OR $wpdb->posts.post_type ='et_body_layout') AND $wpdb->postmeta.meta_key = '_et_pb_ab_current_shortcode'"
            )
        );
    }
}
