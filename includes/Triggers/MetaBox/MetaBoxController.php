<?php
namespace BitCode\FI\Triggers\MetaBox;

use BitCode\FI\Flow\Flow;

final class MetaBoxController
{
    public static function info()
    {
        $plugin_path = 'meta-box';
        return [
            'name' => 'MB Frontend Submission',
            'title' => 'Meta Box – WordPress Custom Fields Framework.',
            'slug' => $plugin_path,
            'type' => 'form',
            'trigger' => 'MetaBox',
            'is_active' => function_exists('rwmb_meta'),
            'activation_url' => wp_nonce_url(self_admin_url('plugins.php?action=activate&amp;plugin=' . $plugin_path . '&amp;plugin_status=all&amp;paged=1&amp;s'), 'activate-plugin_' . $plugin_path),
            'install_url' => wp_nonce_url(self_admin_url('update.php?action=install-plugin&plugin=' . $plugin_path), 'install-plugin_' . $plugin_path),
            'list' => [
                'action' => 'metabox/get',
                'method' => 'get',
            ],
            'fields' => [
                'action' => 'metabox/get/form',
                'method' => 'post',
                'data' => ['id'],
            ],
            'isPro' => false
        ];
    }

    public function getAll()
    {
        if (!function_exists('rwmb_meta')) {
            wp_send_json_error(__('Meta Box is not installed or activated', 'bit-integrations'));
        }
        if (!function_exists('mb_frontend_submission_load')) {
            wp_send_json_error(__('MB Frontend Submission is not installed or activated', 'bit-integrations'));
        }

        if (function_exists('rwmb_meta')) {
            $meta_box_registry = rwmb_get_registry('meta_box');
            $forms = array_values($meta_box_registry->all());

            $all_forms = [];
            foreach ($forms as $index => $form) {
                $all_forms[] = (object) [
                    'id' => $form->meta_box['id'],
                    'title' => $form->meta_box['title'],
                ];
            }

            wp_send_json_success($all_forms);
        }
    }

    public function postFields()
    {
        $postFields = [
            [
                'name' => 'post_title',
                'type' => 'text',
                'label' => 'Post Title'
            ],
            [
                'name' => 'post_name',
                'type' => 'text',
                'label' => 'Post Name'
            ],
            [
                'name' => 'post_content',
                'type' => 'text',
                'label' => 'Post Content'
            ],
            [
                'name' => 'post_excerpt',
                'type' => 'text',
                'label' => 'Post Excerpt'
            ]
        ];
        return $postFields;
    }

    public function get_a_form($data)
    {
        $fields = self::fields($data->id);
        $missing_field = null;
        if (!property_exists($data, 'id')) {
            $missing_field = 'Form ID';
        }
        if (!is_null($missing_field)) {
            wp_send_json_error(sprintf(__('%s can\'t be empty', 'bit-integrations'), $missing_field));
        }
        if (empty($fields)) {
            wp_send_json_error(__('Metabox doesn\'t exists any Field Group', 'bit-integrations'));
        }

        $responseData['fields'] = array_merge($this->postFields(), $fields);
        wp_send_json_success($responseData);
    }

    public static function fields($form_id)
    {
        if (function_exists('rwmb_meta')) {
            $meta_box_registry = rwmb_get_registry('meta_box');
            $fileUploadTypes = ['file_upload', 'single_image', 'file'];
            $form = $meta_box_registry->get($form_id);
            $fieldDetails = $form->meta_box['fields'];
            $fields = [];
            foreach ($fieldDetails as $field) {
                if (!empty($field['id']) && $field['type'] !== 'submit') {
                    $fields[] = [
                        'name' => $field['id'],
                        'type' => in_array($field['type'], $fileUploadTypes) ? 'file' : $field['type'],
                        'label' => $field['name'],
                    ];
                }
            }
            return $fields;
        }
    }

    public static function handle_metabox_submit($object)
    {
        $formId = $object->config['id'];
        $fields = self::fields($formId);
        $postId = $object->post_id;
        $metaBoxFieldValues = [];

        foreach ($fields as $index => $field) {
            $fieldValues = rwmb_meta($field['name'], $args = [], $postId);
            if (isset($fieldValues)) {
                if ($field['type'] !== 'file') {
                    $metaBoxFieldValues[$field['name']] = $fieldValues;
                } elseif ($field['type'] === 'file') {
                    if (isset($fieldValues['path'])) {
                        $metaBoxFieldValues[$field['name']] = $fieldValues['path'];
                    } elseif (gettype($fieldValues) === 'array') {
                        foreach (array_values($fieldValues) as $index => $file) {
                            if (isset($file['path'])) {
                                $metaBoxFieldValues[$field['name']][$index] = $file['path'];
                            }
                        }
                    }
                }
            }
        }

        $postFieldValues = (array) get_post($object->post_id);

        $data = array_merge($postFieldValues, $metaBoxFieldValues);

        if (!empty($formId) && $flows = Flow::exists('MetaBox', $formId)) {
            Flow::execute('MetaBox', $formId, $data, $flows);
        }
    }
}
