<?php

namespace BitCode\FI\Triggers\Brizy;

use BitCode\FI\Flow\Flow;
use BitCode\FI\Log\LogHandler;
use BitCode\FI\Core\Util\Common;

final class BrizyController
{
    public static function info()
    {
        $plugin_path = 'brizy/brizy.php';
        return [
            'name' => 'Brizy',
            'title' => 'Brizy is the platform web creators choose to build professional WordPress websites, grow their skills, and build their business. Start for free today!',
            'slug' => $plugin_path,
            'pro' => $plugin_path,
            'type' => 'form',
            'is_active' => is_plugin_active($plugin_path),
            'activation_url' => wp_nonce_url(self_admin_url('plugins.php?action=activate&amp;plugin=' . $plugin_path . '&amp;plugin_status=all&amp;paged=1&amp;s'), 'activate-plugin_' . $plugin_path),
            'install_url' => wp_nonce_url(self_admin_url('update.php?action=install-plugin&plugin=' . $plugin_path), 'install-plugin_' . $plugin_path),
            'list' => [
                'action' => 'brizy/get',
                'method' => 'get',
            ],
            'fields' => [
                'action' => 'brizy/get/form',
                'method' => 'post',
                'data' => ['id']
            ],
        ];
    }

    public static function handle_brizy_submit($fields, $form)
    {
        if (!method_exists($form, 'getId')) {
            return $fields;
        }
        $form_id = $form->getId();
        $flows = Flow::exists('Brizy', $form_id);
        try {
            if (!$flows) {
                return $fields;
            }
            $data = [];
            $AllFields = $fields;
            foreach ($AllFields as $element) {
                if ($element->type == 'FileUpload' && !empty($element->value)) {
                    $upDir = wp_upload_dir();
                    $files = $element->value;
                    $value = [];
                    $newFileLink = Common::filePath($files);
                    $data[$element->name] = $newFileLink;
                } elseif ($element->type == 'checkbox') {
                    $value = explode(',', $element->value);
                    $data[$element->name] = $value;
                } else {
                    $data[$element->name] = $element->value;
                }
            }
            Flow::execute('Brizy', $form_id, $data, $flows);
        } catch (\Exception $e) {
            foreach ($flows as $flowData) {
                $integrationId = $flowData->id;
                $msg = $e->getMessage();

                LogHandler::save($integrationId, json_encode(['type' => 'error', 'type_name' => 'error']), 'error', json_encode($msg));
            }
        }
        return $fields;
    }

    public function getAllForms()
    {
        if (!is_plugin_active('brizy/brizy.php')) {
            wp_send_json_error(__('Brizy Pro is not installed or activated', 'bit-integrations'));
        }
        //Brizy get form list
        $posts      = self::getBrizyPosts();
        $all_forms  = [];

        foreach ($posts as $post) {
            $index          = 0;
            $post_meta      = get_post_meta($post->ID, 'brizy');
            // $tamplate_form  = json_decode(base64_decode($post_meta[0]['brizy-post']['editor_data']));
            $form_content   = base64_decode($post_meta[0]['brizy-post']['compiled_html']);

            // if (!isset($tamplate_form->items) && !empty($tamplate_form->items)) {
            //     foreach ($tamplate_form->items as $form) {
            //         self::get_tamplate_form_id($form->value->items, $all_forms, $post->ID, $post->post_title, $index);
            //     }
            // } else {
            //     $forms = self::parseContentGetForms($form_content, $post->post_title);

            //     foreach ($forms as $form) {
            //         $all_forms[] = (object)[
            //             'id' => $form->uniqueId,
            //             'title' => $form->title,
            //             'post_id' => $post->ID,
            //         ];
            //     }
            // }
            self::parseContentGetForms($form_content, $post->post_title, $post->ID, $all_forms);
        }
        wp_send_json_success(array_values($all_forms));
    }

    public function getFormFields($data)
    {
        if (!is_plugin_active('brizy/brizy.php')) {
            wp_send_json_error(__('Brizy Pro is not installed or activated', 'bit-integrations'));
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

        $post_meta      = get_post_meta($data->postId, 'brizy');
        // $tamplate_form  = json_decode(base64_decode($post_meta[0]['brizy-post']['editor_data']));
        // $formData       = self::get_tamplate_form_data_by_id($tamplate_form->items, $data->id);
        // $formFields     = self::get_tamplate_form_data($formData);

        $form_content   = base64_decode($post_meta[0]['brizy-post']['compiled_html']);
        $formFields     = self::parseContentGetFormFields($form_content, $data->id);
        $fields         = [];
        foreach ($formFields as $field) {
            $type = $field->field_type;
            if ($type === 'upload') {
                $type = 'file';
            }

            $fields[] = [
                'name'  => $field->field_id,
                'type'  => $type,
                'label' => $field->field_title,
            ];
        }
        return $fields;
    }

    public static function get_tamplate_form_id($items, &$all_forms, $post_id, $post_title, &$index)
    {
        if (is_array($items)) {
            foreach ($items as $item) {
                self::get_form_id($item, $all_forms, $post_id, $post_title, $index);
            }
        } else {
            self::get_form_id($items, $all_forms, $post_id, $post_title, $index);
        }
    }

    public static function get_form_id($item, &$all_forms, $post_id, $post_title, &$index)
    {
        if (
            isset($item->type)
            && $item->type !== "Form2"
            && isset($item->value->items)
            && is_array($item->value->items)
        ) {
            self::get_tamplate_form_id($item->value->items, $all_forms, $post_id, $post_title, $index);
        } elseif (isset($item->type) && $item->type == "Form2") {
            $index++;
            $all_forms[] = (object)[
                'id'        => $item->value->_id,
                'title'     => $post_title . '->' . $index,
                'post_id'   => $post_id,
            ];
        }
    }

    public static function get_tamplate_form_data_by_id($items, $form_id)
    {
        if (is_array($items)) {
            foreach ($items as $item) {
                $data = self::get_form_data($item, $form_id);
                if (!empty($data)) {
                    return $data;
                }
            }
        } else {
            $data = self::get_form_data($items, $form_id);
            if (!empty($data)) {
                return $data;
            }
        }
    }

    public static function get_form_data($item, $form_id)
    {
        if (isset($item->type) && $item->type !== "Form2" && isset($item->value->items) && is_array($item->value->items)) {
            $data =  self::get_tamplate_form_data_by_id($item->value->items, $form_id);
            if (!empty($data)) {
                return $data;
            }
        } else {
            if ($item->value->_id == $form_id) {
                return $item;
            }
        }
    }

    public static function get_tamplate_form_data($items)
    {
        $field_data = [];
        if (is_array($items)) {
            foreach ($items as $item) {
                if (isset($item->value->items)) {
                    return self::get_tamplate_form_data($item->value->items);
                } else {
                    $field_data[] = (object) [
                        "field_id"      => $item->value->_id,
                        "field_type"    => strtolower($item->value->type),
                        "field_title"   => $item->value->label,
                    ];
                }
            }
        } else {
            if (isset($items->value->items)) {
                return self::get_tamplate_form_data($items->value->items);
            } else {
                $field_data[] = (object) [
                    "field_id"      => $items->value->_id,
                    "field_type"    => strtolower($items->value->type),
                    "field_title"   => $items->value->label,
                ];
            }
        }
        return $field_data;
    }

    private static function getBrizyPosts()
    {
        global $wpdb;

        return $wpdb->get_results(
            $wpdb->prepare(
                "SELECT ID, post_title, post_content, post_type FROM $wpdb->posts
                    LEFT JOIN $wpdb->postmeta ON ($wpdb->posts.ID = $wpdb->postmeta.post_id)
                        WHERE $wpdb->posts.post_status = 'publish' 
                            AND ($wpdb->posts.post_type = 'page' 
                                OR $wpdb->posts.post_type = 'post' 
                                OR $wpdb->posts.post_type = 'editor-template') 
                            AND $wpdb->postmeta.meta_key = 'brizy'"
            )
        );
    }

    public static function parseContentGetForms($content, $post_title, $post_id, &$all_forms)
    {
        $number = 0;
        $contentArray = explode('><', $content);
        foreach ($contentArray as $line) {
            $lineArray = explode(' ', $line);
            if ($lineArray[0] == 'form') {
                $regularExpressionUniqueId = '/data-form-id\s*=\s*"([^"]+)"/';
                preg_match($regularExpressionUniqueId, $line, $uniqueId);

                // $regularExpressionTitle = '/title\s*=\s*"([^"]+)"/';
                // preg_match($regularExpressionTitle, $line, $title);

                $number += 1;

                if (empty($uniqueId[1])) {
                    $regularExpressionUniqueId = '/data-brz-form-id\s*=\s*"([^"]+)"/';
                    preg_match($regularExpressionUniqueId, $line, $uniqueId);

                    if (empty($uniqueId[1])) {
                        continue;
                    }
                    if (isset($all_forms[$uniqueId[1]]->title)) {
                        // check if title is starts with global form to concat
                        if (str_starts_with($all_forms[$uniqueId[1]]->title, 'Global Form:')) {
                            $title = strlen($all_forms[$uniqueId[1]]->title) > 40 ? substr($all_forms[$uniqueId[1]]->title, 0, 40) . '...' : "{$all_forms[$uniqueId[1]]->title}, {$post_title}->{$number}";
                        } else {
                            $title = 'Global Form: ';
                            $title .= strlen($all_forms[$uniqueId[1]]->title) > 40 ? substr($all_forms[$uniqueId[1]]->title, 0, 40) . '...' : "{$all_forms[$uniqueId[1]]->title}, {$post_title}->{$number}";
                        }
                    } else {
                        $title = $post_title . '->' . $number;
                    }

                    $all_forms[$uniqueId[1]] = (object)[
                        'id' => $uniqueId[1],
                        'title' => $title,
                        'post_id' => $post_id,
                    ];
                    continue;
                }
                if (isset($all_forms[$uniqueId[1]]->title)) {
                    // check if title is starts with global form to concat
                    if (str_starts_with($all_forms[$uniqueId[1]]->title, 'Global Form:')) {
                        $title = strlen($all_forms[$uniqueId[1]]->title) > 40 ? substr($all_forms[$uniqueId[1]]->title, 0, 40) . '...' : "{$all_forms[$uniqueId[1]]->title}, {$post_title}->{$number}";
                    } else {
                        $title = 'Global Form: ';
                        $title .= strlen($all_forms[$uniqueId[1]]->title) > 40 ? substr($all_forms[$uniqueId[1]]->title, 0, 40) . '...' : "{$all_forms[$uniqueId[1]]->title}, {$post_title}->{$number}";
                    }
                } else {
                    $title = $post_title . '->' . $number;
                }
                $all_forms[$uniqueId[1]] = (object)[
                    'id' => $uniqueId[1],
                    'title' => $title,
                    'post_id' => $post_id,
                ];
            }
        }
    }

    public static function parseContentGetFormFields($content, $formUniqueId)
    {
        $formStart = 0;
        $formFields = [];
        $contentArray = explode('><', $content);
        foreach ($contentArray as $line) {
            $lineArray = explode(' ', $line);

            if ($lineArray[0] == 'form') {
                $regularExpressionUniqueId = '/data-form-id\s*=\s*"([^"]+)"/';
                preg_match($regularExpressionUniqueId, $line, $uniqueId);
                if ($uniqueId[1] != $formUniqueId) {
                    $regularExpressionUniqueId = '/data-brz-form-id\s*=\s*"([^"]+)"/';
                    preg_match($regularExpressionUniqueId, $line, $uniqueId);

                    if ($uniqueId[1] != $formUniqueId) {
                        continue;
                    }
                }
                $formStart = 1;
            }

            if ($formStart && ($lineArray[0] == 'input' || $lineArray[0] == 'textarea' || $lineArray[0] == 'select' || $lineArray[0] == 'number' || $lineArray[0] == 'checkbox' || $lineArray[0] == 'radio' || $lineArray[0] == 'hidden' || $lineArray[0] == 'file' || $lineArray[0] == 'date' || $lineArray[0] == 'time' || $lineArray[0] == 'tel' || $lineArray[0] == 'password' || $lineArray[0] == 'url')) {
                $regularExpressionUniqueId = '/name\s*=\s*"([^"]+)"/';
                preg_match($regularExpressionUniqueId, $line, $fieldId);
                $regularExpressionUniqueId = '/type\s*=\s*"([^"]+)"/';
                preg_match($regularExpressionUniqueId, $line, $fieldType);
                $regularExpressionUniqueId = '/data-label\s*=\s*"([^"]+)"/';
                preg_match($regularExpressionUniqueId, $line, $fieldTitle);
                $formFields[] = (object)[
                    'field_id' => strtolower($fieldId[1]),
                    'field_type' => strtolower(isset($fieldType[1]) ? $fieldType[1] : 'text'),
                    'field_title' => isset($fieldTitle[1]) ? $fieldTitle[1] : $fieldId[1],
                ];
            }

            if ($lineArray[0] == '/form') {
                $formStart = 0;
            }
        }
        $uniqueArry = [];

        foreach ($formFields as $val) {
            if (!in_array($val, $uniqueArry)) {
                $uniqueArry[] = $val;
            }
        }

        return $uniqueArry;
    }
}
