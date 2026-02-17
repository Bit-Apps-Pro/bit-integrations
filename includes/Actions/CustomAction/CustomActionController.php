<?php

namespace BitApps\Integrations\Actions\CustomAction;

use BitApps\Integrations\Log\LogHandler;
use Throwable;

class CustomActionController
{
    public static function functionValidateHandler($data)
    {
        global $wp_filesystem;

        if (empty($wp_filesystem)) {
            require_once ABSPATH . '/wp-admin/includes/file.php';
            WP_Filesystem();
        }

        $upload_dir = wp_upload_dir();
        $filePath = $upload_dir['basedir'] . '/temp_validation_' . wp_generate_password(12, false) . '.php';

        $wp_filesystem->put_contents($filePath, $data, FS_CHMOD_FILE);

        if (\function_exists('exec') === false) {
            $wp_filesystem->delete($filePath);
            wp_send_json_success(__('Exec function not found in your server, So we can\'t validate your function. But you can run your custom action.', 'bit-integrations'));
        }
        $response = exec(escapeshellcmd("php -l {$filePath}"), $output, $return);
        if (empty($response)) {
            $wp_filesystem->delete($filePath);
            wp_send_json_success(__('Exec function not found in your server, So we can\'t validate your function. But you can run your custom action.', 'bit-integrations'));
        }

        $msg = str_replace($filePath, 'your function', $response);
        $wp_filesystem->delete($filePath);
        if (str_contains($response, 'No syntax errors detected')) {
            wp_send_json_success("Congrats, {$msg}");
        }

        wp_send_json_error($msg);
    }

    public function execute($integrationData, $fieldValues)
    {
        $funcFileLocation = $integrationData->flow_details->funcFileLocation;
        $integId = $integrationData->id;
        $isExits = file_exists($funcFileLocation);
        $isSuccessfullyRun = true;
        $additionalData = null;

        ob_start();
        if ($isExits) {
            $trigger = (array) $fieldValues;

            try {
                include "{$funcFileLocation}";
            } catch (Throwable $th) {
                $isSuccessfullyRun = false;
                LogHandler::save($integId, $th->getMessage(), 'error', __('Custom action Failed', 'bit-integrations'));
            }
            $additionalData = ob_get_clean();
        } else {
            LogHandler::save($integId, wp_json_encode(['type' => 'custom_action', 'type_name' => 'custom action']), 'error', wp_json_encode('Custom action file not found'));

            return;
        }
        if ($isSuccessfullyRun) {
            LogHandler::save($integId, wp_json_encode(['type' => 'custom_action', 'type_name' => 'custom action']), 'success', wp_json_encode('Custom action successfully run' . !empty($additionalData) ? wp_json_encode($additionalData) : ''));
        }

        return true;
    }
}
