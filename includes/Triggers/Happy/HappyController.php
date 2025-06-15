<?php
namespace BitCode\FI\Triggers\Happy;

use BitCode\FI\Core\Util\Common;
use BitCode\FI\Flow\Flow;
use DateTime;

final class HappyController
{
    public static function info()
    {
        $plugin_path = 'happy/happy.php';
        return [
            'name' => 'Happy Forms',
            'title' => 'Happy Forms - Contact Form, Payment Form & Custom Form Builder',
            'slug' => $plugin_path,
            'pro' => 'happyforms-upgrade/happyforms-upgrade.php',
            'type' => 'form',
            'is_active' => function_exists('HappyForms'),
            'activation_url' => wp_nonce_url(self_admin_url('plugins.php?action=activate&amp;plugin=' . $plugin_path . '&amp;plugin_status=all&amp;paged=1&amp;s'), 'activate-plugin_' . $plugin_path),
            'install_url' => wp_nonce_url(self_admin_url('update.php?action=install-plugin&plugin=' . $plugin_path), 'install-plugin_' . $plugin_path),
            'list' => [
                'action' => 'happy/get',
                'method' => 'get',
            ],
            'fields' => [
                'action' => 'happy/get/form',
                'method' => 'post',
                'data' => ['id']
            ],
        ];
    }

    public function getAll()
    {
        if (!function_exists('HappyForms')) {
            wp_send_json_error(__('Happy Form is not installed or activated', 'bit-integrations'));
        }

        $forms = happyforms_get_form_controller()->get();

        $all_forms = [];
        if ($forms) {
            foreach ($forms as $form) {
                $all_forms[] = (object)[
                    'id' => $form['ID'],
                    'title' => $form['post_title'],
                ];
            }
        }
        wp_send_json_success($all_forms);
    }

    public function get_a_form($data)
    {
        if (!function_exists('HappyForms')) {
            wp_send_json_error(__('Happy Form is not installed or activated', 'bit-integrations'));
        }
        if (empty($data->id)) {
            wp_send_json_error(__('Form doesn\'t exists', 'bit-integrations'));
        }
        $fields = self::fields($data->id);
        if (empty($fields)) {
            wp_send_json_error(__('Form doesn\'t exists any field', 'bit-integrations'));
        }

        $responseData['fields'] = $fields;
        wp_send_json_success($responseData);
    }

    public static function fields($form_id)
    {
        $form = happyforms_get_form_controller()->get($form_id);
        if (!(is_array($form) && array_key_exists('parts', $form))) {
            return [];
        }
        $fieldDetails = $form['parts'];
        if (empty($fieldDetails)) {
            return $fieldDetails;
        }

        $fields = [];
        foreach ($fieldDetails as $field) {
            $withoutText = ['radio', 'checkbox', 'select', 'date', 'time', 'attachment', 'email', 'poll', 'signature'];
            $type = $field['type'];
            if ($type === 'attachment' || $type === 'signature') {
                $type = 'file';
            } elseif (!in_array($type, $withoutText)) {
                $type = 'text';
            }
            $fields[] = [
                'name' => $field['id'],
                'type' => $type,
                'label' => $field['label'],
            ];
        }
        return $fields;
    }

    public static function save_image($base64_img, $title)
    {
        // Upload dir.
        $upload = wp_upload_dir();
        $upload_dir = $upload['basedir'];
        $upload_dir = $upload_dir . '/bihappy';
        if (!is_dir($upload_dir)) {
            mkdir($upload_dir, 0700);
        }
        $upload_path = $upload_dir;

        $img = str_replace('data:image/png;base64,', '', $base64_img);
        $img = str_replace(' ', '+', $img);
        $decoded = base64_decode($img);
        $filename = $title . '.png';
        $file_type = 'image/png';
        $hashed_filename = md5($filename . microtime()) . '_' . $filename;

        //Save the image in the uploads directory.
        $upload_file = file_put_contents($upload_path . '/' . $hashed_filename, $decoded);
        if ($upload_file) {
            $path = $upload_path . '/' . $hashed_filename;
            return $path;
        }
        return $base64_img;
    }

    public static function get_path($val)
    {
        $img = maybe_unserialize($val);
        $hash_ids = array_filter(array_values($img));
        $attachments = happyforms_get_attachment_controller()->get([
            'hash_id' => $hash_ids,
        ]);

        $attachment_ids = wp_list_pluck($attachments, 'ID');
        $links = array_map('wp_get_attachment_url', $attachment_ids);
        $value = implode(', ', $links);
        return $value;
    }

    public static function handle_happy_submit($submission, $form, $a)
    {
        $post_id = url_to_postid($_SERVER['HTTP_REFERER']);
        $form_id = $form['ID'];
        if (!empty($form_id)) {
            $data = [];
            if ($post_id) {
                $data['post_id'] = $post_id;
            }
            $form_data = $submission;

            foreach ($form_data as $key => $val) {
                if (str_contains($key, 'signature')) {
                    $baseUrl = maybe_unserialize($val)['signature_raster_data'];
                    $path = self::save_image($baseUrl, 'sign');
                    $form_data[$key] = $path;
                } elseif (str_contains($key, 'date')) {
                    if (strtotime($val)) {
                        $dateTmp = new DateTime($val);
                        $dateFinal = date_format($dateTmp, 'Y-m-d');
                        $form_data[$key] = $dateFinal;
                    }
                } elseif (str_contains($key, 'attachment')) {
                    $image = self::get_path($val);
                    $form_data[$key] = Common::filePath($image);
                }
            }
            if (!empty($form_id) && $flows = Flow::exists('Happy', $form_id)) {
                Flow::execute('Happy', $form_id, $form_data, $flows);
            }
        }
    }
}
