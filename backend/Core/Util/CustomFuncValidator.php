<?php

namespace BitApps\Integrations\Core\Util;

class CustomFuncValidator
{
    public static function functionValidateHandler($data)
    {
        $fileContent = html_entity_decode($data->flow_details->value, ENT_QUOTES, 'UTF-8');
        $fileName = $data->flow_details->randomFileName;
        $checkingValue = "defined('ABSPATH')";
        $isExits = str_contains($fileContent, $checkingValue);
        $checkFuncIsValid = self::functionIsValid($fileContent);
        
        if ($isExits && $checkFuncIsValid) {
            global $wp_filesystem;

            if (empty($wp_filesystem)) {
                require_once ABSPATH . '/wp-admin/includes/file.php';
                WP_Filesystem();
            }

            $uploadDir = wp_upload_dir();
            $fileLocation = "{$uploadDir['basedir']}/{$fileName}.php";
            $data->flow_details->funcFileLocation = $fileLocation;
            $wp_filesystem->put_contents($fileLocation, $fileContent, FS_CHMOD_FILE);
        } else {
            wp_send_json_error('Your function is not valid, Failed to save file');
        }
    }

    public static function functionIsValid($fileContent)
    {
        $result = PhpSyntaxChecker::validate($fileContent);
        return $result['is_valid'];
    }
}
