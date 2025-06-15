<?php

namespace BitCode\FI\Actions\CustomAction;

use Throwable;
use BitCode\FI\Log\LogHandler;

class CustomActionController
{
    public static function functionValidateHandler($data)
    {
        $temp_file = tmpfile();
        fwrite($temp_file, $data);
        $filePath = stream_get_meta_data($temp_file)['uri'];
        if (\function_exists('exec') === false) {
            fclose($temp_file);
            wp_send_json_success(__('Exec function not found in your server, So we can\'t validate your function. But you can run your custom action.', 'bit-integrations'));
        }
        $response = exec(escapeshellcmd("php -l {$filePath}"), $output, $return);
        if (empty($response)) {
            fclose($temp_file);
            wp_send_json_success(__('Exec function not found in your server, So we can\'t validate your function. But you can run your custom action.', 'bit-integrations'));
        }

        $msg = str_replace($filePath, 'your function', $response);
        fclose($temp_file);
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
