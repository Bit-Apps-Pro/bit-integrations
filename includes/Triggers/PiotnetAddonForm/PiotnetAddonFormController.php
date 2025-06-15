<?php

namespace BitCode\FI\Triggers\PiotnetAddonForm;

use BitCode\FI\Flow\Flow;

final class PiotnetAddonFormController
{
    public static function info()
    {
        $plugin_path = self::pluginActive('get_name');
        return [
            'name' => 'PiotnetAddonForm',
            'title' => 'PiotnetAddonForm is pioneeringly provides many advanced features for Elementor based websites!',
            'slug' => $plugin_path,
            'pro' => $plugin_path,
            'type' => 'form',
            'is_active' => is_plugin_active($plugin_path),
            'activation_url' => wp_nonce_url(self_admin_url('plugins.php?action=activate&amp;plugin=' . $plugin_path . '&amp;plugin_status=all&amp;paged=1&amp;s'), 'activate-plugin_' . $plugin_path),
            'install_url' => wp_nonce_url(self_admin_url('update.php?action=install-plugin&plugin=' . $plugin_path), 'install-plugin_' . $plugin_path),
            'list' => [
                'action' => 'piotnetaddonform/get',
                'method' => 'get',
            ],
            'fields' => [
                'action' => 'piotnetaddonform/get/form',
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


        $flows = Flow::exists('PiotnetAddonForm', $form_id);
        if (!$flows) {
            return;
        }

        $data = [];
        $fields = $form_submission['fields'];
        foreach ($fields as $key => $field) {
            $data[$key] = $field['value'];
        }

        Flow::execute('PiotnetAddonForm', $form_id, $data, $flows);
    }

    public function getAllForms()
    {
        if (!self::pluginActive()) {
            wp_send_json_error(__('Piotnet Addon is not installed or activated', 'bit-integrations'));
        }

        $posts = self::getElementorPosts();

        $piotnetForms = [];
        if ($posts) {
            foreach ($posts as $post) {
                $piotnetForms[] = (object)[
                    'id' => $post->ID,
                    'title' => $post->post_title,
                ];
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
        if (!isset($data->id)) {
            return;
        }
        $postMeta = self::getElementorPostMeta($data->id);
        $postDetails = self::getAllFieldsFromPostMeta($postMeta);
        $fields = [];
        // piotnet forms field start
        foreach ($postDetails as $singleField) {
            if ($singleField->widgetType == 'pafe-form-builder-field') {
                if ($singleField->settings->field_id) {

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

    public static function getAllFieldsFromPostMeta($postMeta)
    {
        $piotNetFields = [];
        foreach ($postMeta as $widget) {
            self::getFields($widget->elements, $piotNetFields);
        }
        return $piotNetFields;
    }

    private static function getFields($widget, &$piotNetFields)
    {
        foreach ($widget as $elements) {
            if (!empty($elements->elements)) {
                self::getFields($elements->elements, $piotNetFields);
            } elseif (isset($elements->widgetType) && $elements->widgetType == 'pafe-form-builder-field') {
                $piotNetFields[] =  $elements;
            }
        }
    }

    private static function getElementorPosts()
    {
        global $wpdb;


        return $wpdb->get_results(
            $wpdb->prepare(
                "SELECT ID, post_title FROM $wpdb->posts
                LEFT JOIN $wpdb->postmeta ON ($wpdb->posts.ID = $wpdb->postmeta.post_id)
                WHERE $wpdb->posts.post_status = 'publish' AND $wpdb->posts.post_type = 'pafe-forms' AND $wpdb->postmeta.meta_key = '_elementor_data'"
            )
        );
    }

    private static function getElementorPostMeta(int $form_id)
    {
        global $wpdb;
        $postMeta = $wpdb->get_results($wpdb->prepare("SELECT meta_value FROM $wpdb->postmeta WHERE post_id=%d AND meta_key='_elementor_data' LIMIT 1", $form_id));
        return json_decode($postMeta[0]->meta_value);
    }
}
