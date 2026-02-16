<?php

namespace BitApps\BTCBI_FI\Core\Util;

class CustomFuncValidator
{
    public static function functionValidateHandler($data)
    {
        $fileContent = $data->flow_details->value;
        $fileName = $data->flow_details->randomFileName;
        $checkingValue = "defined('ABSPATH')";
        $isExits = str_contains($fileContent, $checkingValue);
        $checkFuncIsValid = self::functionIsValid($fileContent);

        if ($isExits && $checkFuncIsValid) {
            $filePath = wp_upload_dir();
            $fileLocation = "{$filePath['basedir']}/{$fileName}.php";
            $data->flow_details->funcFileLocation = $fileLocation;
            file_put_contents($fileLocation, $fileContent);
        } else {
            wp_send_json_error('Your function is not valid, Failed to save file');
        }
    }

    public static function functionIsValid($fileContent)
    {
        global $wp_filesystem;

        if (empty($wp_filesystem)) {
            require_once ABSPATH . '/wp-admin/includes/file.php';
            WP_Filesystem();
        }

        $upload_dir = wp_upload_dir();
        $temp_file_path = $upload_dir['basedir'] . '/temp_validation_' . wp_generate_password(12, false) . '.php';

        $wp_filesystem->put_contents($temp_file_path, $fileContent, FS_CHMOD_FILE);

        $response = exec(escapeshellcmd("php -l {$temp_file_path}"), $output, $return);

        $is_valid = str_contains($response, 'No syntax errors detected') || empty($response);

        $wp_filesystem->delete($temp_file_path);

        return $is_valid;
    }
}
