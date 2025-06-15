<?php

namespace BitCode\FI\Actions\PCloud;

use BitCode\FI\Log\LogHandler;
use CURLFile;

class RecordApiHelper
{
    protected $token;
    protected $errorApiResponse   = [];
    protected $successApiResponse = [];

    public function __construct($token)
    {
        $this->token = $token;
    }

    public function uploadFile($folder, $filePath)
    {
        if ($filePath === '') return false;

        $curl = curl_init();

        curl_setopt_array($curl, array(
            CURLOPT_URL            => 'https://api.pcloud.com/uploadfile?folderid=' . $folder,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING       => '',
            CURLOPT_MAXREDIRS      => 10,
            CURLOPT_TIMEOUT        => 0,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_HTTP_VERSION   => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST  => 'POST',
            CURLOPT_POSTFIELDS     => array('filename' => new CURLFile($filePath)),
            CURLOPT_HTTPHEADER     => array(
                'Authorization: Bearer ' . $this->token
            ),
        ));

        $response = curl_exec($curl);

        curl_close($curl);

        return json_decode($response);
    }

    public function handleAllFiles($folderWithFiles, $actions)
    {
        foreach ($folderWithFiles as $folderWithFile) {
            if ($folderWithFile == '') continue;
            foreach ($folderWithFile as $folder => $singleFilePath) {
                if ($singleFilePath == '') continue;
                $response = $this->uploadFile($folder, $singleFilePath[0]);
                $this->storeInState($response);
                $this->deleteFile($singleFilePath[0], $actions);
            }
        }
    }

    protected function storeInState($response)
    {
        if (isset($response->metadata[0]->id)) {
            $this->successApiResponse[] = $response;
        } else {
            $this->errorApiResponse[] =  $response;
        }
    }

    public function deleteFile($filePath, $actions)
    {
        if (isset($actions->delete_from_wp) && $actions->delete_from_wp) {
            if (file_exists($filePath)) {
                unlink($filePath);
            }
        }
    }

    public function executeRecordApi($integrationId, $fieldValues, $fieldMap, $actions)
    {
        foreach ($fieldMap as $value) {
            if (!is_null($fieldValues[$value->formField])) {
                $folderWithFiles[] = [$value->pCloudFormField => $fieldValues[$value->formField]];
            }
        }

        $this->handleAllFiles($folderWithFiles, $actions);

        if (count($this->successApiResponse) > 0) {
            LogHandler::save($integrationId, wp_json_encode(['type' => 'PCloud', 'type_name' => "file_upload"]), 'success', 'All Files Uploaded. ' . json_encode($this->successApiResponse));
        }
        if (count($this->errorApiResponse) > 0) {
            LogHandler::save($integrationId, wp_json_encode(['type' => 'PCloud', 'type_name' => "file_upload"]), 'error', 'Some Files Can\'t Upload. ' . json_encode($this->errorApiResponse));
        }
        return;
    }
}
