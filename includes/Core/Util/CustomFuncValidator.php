<?php

namespace BitCode\FI\Core\Util;

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
        $temp_file = tmpfile();
        fwrite($temp_file, $fileContent);
        $filePath = stream_get_meta_data($temp_file)['uri'];
        $response = exec(escapeshellcmd("php -l {$filePath}"), $output, $return);
        if (str_contains($response, 'No syntax errors detected') || empty($response)) {
            fclose($temp_file);

            return true;
        }
        fclose($temp_file);

        return false;
    }
}
