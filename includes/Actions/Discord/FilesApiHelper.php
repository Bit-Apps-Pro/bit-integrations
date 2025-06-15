<?php

/**
 * Discord Files Api
 */

namespace BitCode\FI\Actions\Discord;

/**
 * Provide functionality for Upload files
 */
final class FilesApiHelper
{
    private $_defaultHeader;
    private $_payloadBoundary;

    public function __construct()
    {
        $this->_payloadBoundary = wp_generate_password(24);
        $this->_defaultHeader['Content-Type'] = 'multipart/form-data; boundary=' . $this->_payloadBoundary;
    }

    /**
     * Helps to execute upload files api
     *
     * @param String $apiEndPoint discord API base URL
     * @param Array  $data        Data to pass to API
     *
     * @return Array $uploadResponse discord API response
     */
    public function uploadFiles($apiEndPoint, $data, $_accessToken, $channel_id)
    {
        $uploadFileEndpoint = $apiEndPoint . '/channels/' . $channel_id . '/messages';
        $data['file'] = new \CURLFILE("{$data['file'][0]}");
        $curl = curl_init();
        curl_setopt_array(
            $curl,
            [
                CURLOPT_URL => $uploadFileEndpoint,
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_ENCODING => '',
                CURLOPT_MAXREDIRS => 10,
                CURLOPT_TIMEOUT => 0,
                CURLOPT_FOLLOWLOCATION => true,
                CURLOPT_FAILONERROR => true,
                CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
                CURLOPT_SSL_VERIFYPEER => false,
                CURLOPT_SSL_VERIFYHOST => false,
                CURLOPT_CUSTOMREQUEST => 'POST',
                CURLOPT_POSTFIELDS => $data,
                CURLOPT_HTTPHEADER => [
                    'Content-Type: multipart/form-data',
                    "Authorization: Bot {$_accessToken}"
                ]

            ]
        );

        $uploadResponse = curl_exec($curl);

        curl_close($curl);
        return $uploadResponse;
    }
}
