<?php

namespace BitCode\FI\Triggers\PiotnetAddon;

use BitCode\FI\Flow\Flow;
use BitCode\FI\Core\Util\Common;

final class PiotnetAddonController
{
    public static function info()
    {
        $plugin_path = self::pluginActive('get_name');
        return [
            'name' => 'PiotnetAddon',
            'title' => 'PiotnetAddon is pioneeringly provides many advanced features for Elementor based websites!',
            'slug' => $plugin_path,
            'pro' => $plugin_path,
            'type' => 'form',
            'is_active' => is_plugin_active($plugin_path),
            'activation_url' => wp_nonce_url(self_admin_url('plugins.php?action=activate&amp;plugin=' . $plugin_path . '&amp;plugin_status=all&amp;paged=1&amp;s'), 'activate-plugin_' . $plugin_path),
            'install_url' => wp_nonce_url(self_admin_url('update.php?action=install-plugin&plugin=' . $plugin_path), 'install-plugin_' . $plugin_path),
            'list' => [
                'action' => 'piotnetaddon/get',
                'method' => 'get',
            ],
            'fields' => [
                'action' => 'piotnetaddon/get/form',
                'method' => 'post',
                'data' => ['id']
            ],
        ];
    }

    public static function pluginActive($option = null)
    {
        if (is_plugin_active('piotnet-addons-for-elementor-pro/piotnet-addons-for-elementor-pro.php')) {
            return $option === 'get_name' ? 'piotnet-addons-for-elementor-pro/piotnet-addons-for-elementor-pro.php' : true;
        } elseif (is_plugin_active('piotnet-addons-for-elementor/piotnet-addons-for-elementor.php')) {
            return $option === 'get_name' ? 'piotnet-addons-for-elementor/piotnet-addons-for-elementor.php' : true;
        } else {
            return false;
        }
    }


    public static function handle_piotnet_submit($form_submission)
    {

        $form_id = $form_submission['form']['id'];

        $flows = Flow::exists('PiotnetAddon', $form_id);
        if (!$flows) {
            return;
        }

        $data = [];
        $fields = $form_submission['fields'];
        foreach ($fields as $key => $field) {
            $data[$key] = $field['value'];
        }

        Flow::execute('PiotnetAddon', $form_id, $data, $flows);
    }

    public function getAllForms()
    {
        if (!self::pluginActive()) {
            wp_send_json_error(__('Piotnet Addon is not installed or activated', 'bit-integrations'));
        }

        $posts = self::getElementorPosts();

        $piotnetForms = [];
        $piotnetIds = [];
        if ($posts) {
            foreach ($posts as $post) {
                $postMeta = self::getElementorPostMeta($post->ID);
                $forms = self::getAllFormsFromPostMeta($postMeta);

                foreach ($forms as $form) {
                    // for piotnet addon field
                    if ($form->widgetType == 'pafe-form-builder-field') {
                        if (!in_array($form->settings->form_id, $piotnetIds)) {
                            $piotnetIds[] = $form->settings->form_id;
                            $piotnetForms[] = (object)[
                                'id' => $form->settings->form_id,
                                'title' => "Piotnet Forms - {$form->settings->form_id}",
                                'post_id' => $post->ID,
                            ];
                        }
                    }
                }
            }
        }
        wp_send_json_success($piotnetForms);
    }

    public function getFormFields($data)
    {
        if (!self::pluginActive()) {
            wp_send_json_error(__('Piotnet Addon is not installed or activated', 'bit-integrations'));
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
        $postMeta = self::getElementorPostMeta($data->postId);
        $postDetails = self::getAllFormsFromPostMeta($postMeta);
        $fields = [];
        // piotnet forms field start
        foreach ($postDetails as $singleField) {
            if ($singleField->widgetType == 'pafe-form-builder-field') {
                if ($singleField->settings->form_id === $data->id) {
                    $type = isset($singleField->settings->field_type) ? $singleField->settings->field_type : 'text';
                    if ($type === 'upload') {
                        $type = 'file';
                    }

                    if (!empty($singleField->settings->field_id)) {
                        $field_id = $singleField->settings->field_id;
                    } else {
                        $field_id = str_replace(['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'], ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'], $singleField->id);
                    }

                    $fields[] = [
                        'name' => $field_id,
                        'type' => $type,
                        'label' => $singleField->settings->field_label,
                    ];
                }
            }
        }
        return $fields;

        // piotnet forms field end
    }

    public static function getAllFormsFromPostMeta($postMeta)
    {
        $piotNetForms = [];
        foreach ($postMeta as $widget) {
            foreach ($widget->elements as $elements) {
                foreach ($elements->elements as $element) {
                    if (isset($element->widgetType) && $element->widgetType == 'pafe-form-builder-field') {
                        $piotNetForms[] =  $element;
                    }
                }
            }
        }
        return $piotNetForms;
    }

    private static function getElementorPosts()
    {
        global $wpdb;


        return $wpdb->get_results(
            $wpdb->prepare(
                "SELECT ID, post_title FROM $wpdb->posts
                LEFT JOIN $wpdb->postmeta ON ($wpdb->posts.ID = $wpdb->postmeta.post_id)
                WHERE $wpdb->posts.post_status = 'publish' AND ($wpdb->posts.post_type = 'post' OR $wpdb->posts.post_type = 'page' OR $wpdb->posts.post_type = 'elementor_library') AND $wpdb->postmeta.meta_key = '_elementor_data'"
            )
        );
    }

    private static function getElementorPostMeta(int $form_id)
    {
        global $wpdb;
        $postMeta = $wpdb->get_results("SELECT meta_value FROM $wpdb->postmeta WHERE post_id=$form_id AND meta_key='_elementor_data' LIMIT 1");
        return json_decode($postMeta[0]->meta_value);
    }
}
