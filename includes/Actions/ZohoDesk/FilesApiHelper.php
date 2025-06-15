<?php

/**
 * ZohoDesk Files Api
 */

namespace BitCode\FI\Actions\ZohoDesk;

use BitCode\FI\Core\Util\HttpHelper;

/**
 * Provide functionality for Upload files
 */
final class FilesApiHelper
{
    private $_defaultHeader;
    private $_apiDomain;
    private $_payloadBoundary;
    private $_basepath;

    /**
     *
     * @param Object  $tokenDetails Api token details
     * @param Integer $formID       ID of the form, for which integration is executing
     * @param Integer $entryID      Current submittion ID
     */
    public function __construct($tokenDetails, $orgId)
    {
        $this->_payloadBoundary = wp_generate_password(24);
        $this->_defaultHeader['Authorization'] = "Zoho-oauthtoken {$tokenDetails->access_token}";
        $this->_defaultHeader['orgId'] = $orgId;
        $this->_defaultHeader['content-type'] = "multipart/form-data; boundary=" . $this->_payloadBoundary;
        $this->_apiDomain = \urldecode($tokenDetails->api_domain);
    }

    /**
     * Helps to execute upload files api
     *
     * @param Mixed $files        Files path
     * @param Bool  $isAttachment Check upload type
     * @param Mixed $module       Attachment Module name
     * @param Mixed $recordID     Record id
     *
     * @return Array $uploadedFiles ID's of uploaded file in Zoho Desk
     */
    public function uploadFiles($files, $ticketId, $dataCenter)
    {
        $uploadFileEndpoint = "https://desk.{$dataCenter}/api/v1/tickets/{$ticketId}/attachments";
        $payload = '';
        if (is_array($files)) {
            foreach ($files as $fileIndex => $fileName) {
                if (file_exists("{$fileName}")) {
                    $payload .= '--' . $this->_payloadBoundary;
                    $payload .= "\r\n";
                    $payload .= 'Content-Disposition: form-data; name="' . 'file' .
                        '"; filename="' . basename("{$fileName}") . '"' . "\r\n";
                    $payload .= "\r\n";
                    $payload .= file_get_contents("{$fileName}");
                    $payload .= "\r\n";
                    $payload .= '--' . $this->_payloadBoundary . '--';
                }
                $uploadResponse =  HttpHelper::post($uploadFileEndpoint, $payload, $this->_defaultHeader);
            }
            return $uploadResponse;
        } elseif (file_exists("{$files}")) {
            $payload .= '--' . $this->_payloadBoundary;
            $payload .= "\r\n";
            $payload .= 'Content-Disposition: form-data; name="' . 'file' .
                '"; filename="' . basename("{$files}") . '"' . "\r\n";
            $payload .= "\r\n";
            $payload .= file_get_contents("{$files}");
            $payload .= "\r\n";
        }
        if (empty($payload)) {
            return false;
        }
        $payload .= '--' . $this->_payloadBoundary . '--';
        return HttpHelper::post($uploadFileEndpoint, $payload, $this->_defaultHeader);
    }
}
