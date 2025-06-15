<?php

namespace BitCode\FI\Actions\GoogleDrive;

use BitCode\FI\Log\LogHandler;
use BitCode\FI\Core\Util\HttpHelper;

class RecordApiHelper
{
    protected $token;
    protected $errorApiResponse = [];
    protected $successApiResponse = [];

    public function __construct($token)
    {
        $this->token = $token;
    }

    public function uploadFile($folder, $filePath)
    {
        if ($filePath === '') return false;

        $apiEndpoint = 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart';
        $boundary = $this->getBoundary();
        $headers = [
            "Authorization" => 'Bearer ' . $this->token,
            "Content-Type"  => 'multipart/related; boundary="' . $boundary . '"',
        ];
        return HttpHelper::post($apiEndpoint, $this->getBody($folder, $filePath, $boundary), $headers);
    }

    protected function getBody($folder, $filePath, $boundary)
    {
        $body = "--" . $boundary . "\r\n";
        $body .= "Content-Type: application/json; charset=UTF-8\r\n\r\n";
        $body .= '{"name": "' . basename($filePath) . '", "parents": ["' . $folder . '"]}' . "\r\n";
        $body .= "--" . $boundary . "\r\n";
        $body .= "Content-Type: application/octet-stream\r\n\r\n";
        $body .= file_get_contents($filePath) . "\r\n";
        $body .= "--" . $boundary . "--\r\n";
        return $body;
    }

    protected function getBoundary()
    {
        return 'BITCODE_BI_' . md5(time());
    }

    public function handleAllFiles($folderWithFile, $actions, $folderKey = null)
    {
        foreach ($folderWithFile as $folder => $filePath) {
            $folder = $folderKey ? $folderKey : $folder;
            if ($filePath == '') continue;

            if (is_array($filePath)) {
                $this->handleAllFiles($filePath, $actions, $folder);
            } else {
                $response = $this->uploadFile($folder, $filePath);
                $this->storeInState($response);
                $this->deleteFile($filePath, $actions);
            }
        }
    }

    protected function storeInState($response)
    {
        if (isset($response->id)) {
            $this->successApiResponse[] = $response;
        } else {
            $this->errorApiResponse[] = $response;
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
        $folderWithFile = [];
        foreach ($fieldMap as $value) {
            if (!is_null($fieldValues[$value->formField])) {
                $folderWithFile[$value->googleDriveFormField][] = $fieldValues[$value->formField];
            }
        }
        $this->handleAllFiles($folderWithFile, $actions);

        if (count($this->successApiResponse) > 0) {
            LogHandler::save($integrationId, wp_json_encode(['type' => 'GoogleDrive', 'type_name' => "file_upload"]), 'success', 'All Files Uploaded. ' . json_encode($this->successApiResponse));
        }
        if (count($this->errorApiResponse) > 0) {
            LogHandler::save($integrationId, wp_json_encode(['type' => 'GoogleDrive', 'type_name' => "file_upload"]), 'error', 'Some Files Can\'t Upload. ' . json_encode($this->errorApiResponse));
        }
        return;
    }
}
