<?php

/**
 * Telegram Files Api
 */

namespace BitCode\FI\Actions\Telegram;

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
        $this->_defaultHeader['Content-Type'] = "multipart/form-data; boundary=" . $this->_payloadBoundary;
    }

    /**
     * Helps to execute upload files api
     *
     * @param String $apiEndPoint Telegram API base URL
     * @param Array  $data        Data to pass to API
     *
     * @return Array $uploadResponse Telegram API response
     */
    public function uploadFiles($apiEndPoint, $data)
    {
        $mimeType = mime_content_type("{$data['photo']}");
        $fileType = \explode("/", $mimeType);

        switch ($fileType[0]) {
            case 'image':
                $apiMethod = '/sendPhoto';
                $param = 'photo';
                break;

            case 'audio':
                $apiMethod = '/sendAudio';
                $param = 'audio';
                break;
            case 'video':
                $apiMethod = '/sendVideo';
                $param = 'video';
                break;

            default:
                $apiMethod = '/sendDocument';
                $param = 'document';
                break;
        }
        $uploadFileEndpoint = $apiEndPoint . $apiMethod;

        $data[$param] = new \CURLFILE("{$data['photo']}");

        if ($param != 'photo') {
            unset($data['photo']);
        }
        $curl = curl_init();
        curl_setopt_array(
            $curl,
            array(
                CURLOPT_URL => $uploadFileEndpoint,
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_ENCODING => '',
                CURLOPT_MAXREDIRS => 10,
                CURLOPT_TIMEOUT => 0,
                CURLOPT_FOLLOWLOCATION => true,
                CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
                CURLOPT_CUSTOMREQUEST => 'POST',
                CURLOPT_POSTFIELDS => $data,
            )
        );

        $uploadResponse = curl_exec($curl);

        curl_close($curl);

        return $uploadResponse;
    }
    public function uploadMultipleFiles($apiEndPoint, $data)
    {
        $param =  'media';
        $uploadMultipleFileEndpoint = $apiEndPoint . '/sendMediaGroup';
        $postFields = [
            'chat_id' => $data['chat_id'],
            'caption' => $data['caption'],
        ];

        foreach ($data['media'] as $key => $value) {
            $mimeType = mime_content_type("{$value}");
            $fileType = \explode("/", $mimeType);
            unset($data['media'][$key]);

            if ($fileType[0] == 'image') {
                $type = 'photo';
            } elseif ($fileType[0] == 'application' || $fileType[0] == 'text') {
                $type = 'document';
            } elseif ($fileType[0] == 'application') {
                $type = 'document';
            } else {
                $type = empty($fileType[0]) ? 'photo' : $fileType[0];
            }

            $media[] = [
                'type' => $type,
                'media' => "attach://{$key}.path",
                'caption' => $data['caption'],
                'parse_mode' => 'HTML'
            ];
            $nameK = "{$key}.path";
            $postFields[$nameK] = new \CURLFILE(empty(realpath($value)) ? "{$value}" : realpath($value));
        }
        $postFields['media'] = json_encode($media);

        if ($param != 'media') {
            unset($data['media']);
        }

        $curl = curl_init();
        curl_setopt_array(
            $curl,
            array(
                CURLOPT_URL => $uploadMultipleFileEndpoint,
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_ENCODING => '',
                CURLOPT_MAXREDIRS => 10,
                CURLOPT_TIMEOUT => 0,
                CURLOPT_FOLLOWLOCATION => true,
                CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
                CURLOPT_CUSTOMREQUEST => 'POST',
                CURLOPT_POSTFIELDS => $postFields,
                CURLOPT_HTTPHEADER => array(
                    'Content-Type: multipart/form-data'
                ),
            )
        );

        $uploadResponse = curl_exec($curl);
        curl_close($curl);
        return $uploadResponse;
    }
}