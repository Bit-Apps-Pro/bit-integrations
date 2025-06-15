<?php

/**
 * ZohoCrm Files Api
 */

namespace BitCode\FI\Actions\ZohoCRM;

use BitCode\FI\Log\LogHandler;
use BitCode\FI\Core\Util\HttpHelper;

/**
 * Provide functionality for Upload files
 */
final class FilesApiHelper
{
    private $_defaultHeader;
    private $_apiDomain;
    private $_payloadBoundary;

    /**
     *
     * @param Object  $tokenDetails Api token details
     * @param Integer $integId      ID of the flow to execute
     */
    public function __construct($tokenDetails, $integId)
    {
        $this->_integId = $integId;
        $this->_payloadBoundary = wp_generate_password(24);
        $this->_defaultHeader['Authorization'] = "Zoho-oauthtoken {$tokenDetails->access_token}";
        $this->_defaultHeader['content-type'] = "multipart/form; boundary=" . $this->_payloadBoundary;
        $this->_apiDomain = \urldecode($tokenDetails->api_domain);
    }

    /**
     * Helps to execute upload files api
     *
     * @param Mixed  $files        Files path
     * @param String $uploadType   Type of upload field. CRM has two type of
     *                             upload field: fileupload | imageupload
     * @param Bool   $isAttachment Check upload type
     * @param Mixed  $module       Attachment Module name
     * @param Mixed  $recordID     Record id
     *
     * @return Array $uploadedFiles ID's of uploaded file in Zoho CRM
     */
    public function uploadFiles($files, $uploadType, $isAttachment = false, $module = '', $recordID = 0)
    {
        $uploadFileEndpoint = $isAttachment ?
            "{$this->_apiDomain}/crm/v6/{$module}/{$recordID}/Attachments"
            : "{$this->_apiDomain}/crm/v6/files";
        $payload = '';
        if (is_array($files)) {
            foreach ($files as $fileIndex => $file) {
                $payload .= $this->preparePayload($file);
            }
        } else {
            $payload .= $this->preparePayload($files);
        }
        if (empty($payload)) {
            return false;
        }
        $payload .= '--' . $this->_payloadBoundary . '--';
        $uploadResponse = HttpHelper::post($uploadFileEndpoint, $payload, $this->_defaultHeader);
        if (!$isAttachment) {
            $uploadedFiles = [];
            if (!empty($uploadResponse->data) && \is_array($uploadResponse->data)) {
                foreach ($uploadResponse->data as $singleFileResponse) {
                    if (!empty($singleFileResponse->code) && $singleFileResponse->code === 'SUCCESS') {
                        $uploadedFiles[] = $this->setIdByUploadType($singleFileResponse->details->id, $uploadType);
                    }
                }
            }
            if (isset($uploadResponse->status) &&  $uploadResponse->status === 'error') {
                LogHandler::save($this->_integId, wp_json_encode(['type' => 'upload', 'type_name' => 'file']), 'error', wp_json_encode($uploadResponse));
            } else {
                LogHandler::save($this->_integId, wp_json_encode(['type' => 'upload', 'type_name' => 'file']), 'success', wp_json_encode($uploadResponse));
            }
            return $uploadedFiles;
        }
        return $uploadResponse;
    }

    /**
     * Prepares payload for file upload
     *
     * @param $file File path
     *
     * @return String
     */
    public function preparePayload($file)
    {
        $payload = '';
        if ((is_readable("{$file}") && !is_dir("{$file}"))  || filter_var($file, FILTER_VALIDATE_URL)) {
            $payload .= '--' . $this->_payloadBoundary;
            $payload .= "\r\n";
            $payload .= 'Content-Disposition: form-data; name="' . 'file' .
                '"; filename="' . basename("{$file}") . '"' . "\r\n";
            $payload .= "\r\n";
            $payload .= file_get_contents("{$file}");
            $payload .= "\r\n";
        }

        return $payload;
    }


    /**
     * Sets file id by file upload type
     *
     * @param String $id         ID received from Files API
     * @param String $uploadType Type of upload field. CRM has two type of
     *                           upload field: fileupload | imageupload
     *
     * @return Object
     */
    public function setIdByUploadType($id, $uploadType)
    {
        if ($uploadType === 'imageupload') {
            return (object) ['Encrypted_Id' => $id];
        } else {
            return (object) ['file_id' => $id];
        }
    }
}
