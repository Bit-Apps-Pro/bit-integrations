<?php

namespace BitCode\FI\Actions\OneDrive;

use BitCode\FI\Core\Util\HttpHelper;
use BitCode\FI\Log\LogHandler;

class RecordApiHelper
{
    protected $token;
    protected $errorApiResponse = [];
    protected $successApiResponse = [];

    public function __construct($token)
    {
        $this->token = $token;
    }

    public function uploadFile($folder, $filePath, $folderId, $parentId)
    {

        if (is_null($parentId)) {
            // $parentId = 'root';
            $parentId = $folderId;
        }
        $ids = explode('!', $folderId);
        if ($filePath === '') return false;
        $apiEndpoint = 'https://api.onedrive.com/v1.0/drives/' . $ids[0] . '/items/' . $parentId . ':/' . basename($filePath) . ':/content';

        $headers = [
            'Authorization: Bearer ' . $this->token,
            'Content-Type: application/octet-stream',
            'Content-Length: ' . filesize($filePath),
            'Prefer: respond-async',
            'X-HTTP-Method: PUT'
        ];

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $apiEndpoint);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, file_get_contents($filePath));
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        return $response;
    }

    public function handleAllFiles($folderWithFile, $actions, $folderId, $parentId)
    {
        foreach ($folderWithFile as $folder => $filePath) {
            if ($filePath == '') continue;
            if (is_array($filePath)) {
                foreach ($filePath as $singleFilePath) {
                    if ($singleFilePath == '') continue;
                    $response = $this->uploadFile($folder, $singleFilePath, $folderId, $parentId);
                    $this->storeInState($response);
                    $this->deleteFile($singleFilePath, $actions);
                }
            } else {
                $response = $this->uploadFile($folder, $filePath, $folderId, $parentId);
                $this->storeInState($response);
                $this->deleteFile($filePath, $actions);
            }
        }
    }

    protected function storeInState($response)
    {
        $response = json_decode($response);
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

    public function executeRecordApi($integrationId, $fieldValues, $fieldMap, $actions, $folderId, $parentId)
    {
        $folderWithFile = [];
        $actionsAttachments = explode(",", "$actions->attachments");
        if (is_array($actionsAttachments)) {
            foreach ($actionsAttachments as $actionAttachment) {
                if(is_array($fieldValues[$actionAttachment])){
                    foreach ($fieldValues[$actionAttachment] as $value) {
                        $folderWithFile = ["$actionsAttachments" => $value];
                    }
                    $this->handleAllFiles($folderWithFile, $actions, $folderId, $parentId);
                } else {
                    $folderWithFile = ["$actionsAttachments" => $fieldValues[$actionAttachment]];
                    $this->handleAllFiles($folderWithFile, $actions, $folderId, $parentId);
                }
            }
        }

        if (count($this->successApiResponse) > 0) {
            LogHandler::save($integrationId, wp_json_encode(['type' => 'OneDrive', 'type_name' => "file_upload"]), 'success', 'All Files Uploaded. ' . json_encode($this->successApiResponse));
        }
        if (count($this->errorApiResponse) > 0) {
            LogHandler::save($integrationId, wp_json_encode(['type' => 'OneDrive', 'type_name' => "file_upload"]), 'error', 'Some Files Can\'t Upload. ' . json_encode($this->errorApiResponse));
        }
        return;
    }
}
