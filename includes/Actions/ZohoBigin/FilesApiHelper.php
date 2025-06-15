<?php

/**
 * ZohoBigin Files Api
 */

namespace BitCode\FI\Actions\ZohoBigin;

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
     * Constructor for File API helper. Sets api token details 
     * 
     * @param Object $tokenDetails Api token details
     */
    public function __construct($tokenDetails)
    {
        $this->_payloadBoundary = wp_generate_password(24);
        $this->_defaultHeader['Authorization'] = "Zoho-oauthtoken {$tokenDetails->access_token}";
        $this->_defaultHeader['content-type'] = "multipart/form; boundary=" . $this->_payloadBoundary;
        $this->_apiDomain = \urldecode($tokenDetails->api_domain);
    }

    /**
     * Helps to execute upload files api
     *
     * @param Mixed  $files     Files path
     * @param Mixed  $recordID  Record id
     * @param String $zohoField zoho bigin upload fieldname
     *
     * @return Array $uploadedFiles ID's of uploaded file in Zoho Bigin
     */
    public function uploadFiles($files, $module, $recordID, $isPhoto = null)
    {
        $uploadFileEndpoint = '';

        if ($isPhoto) {
            $uploadFileEndpoint = "{$this->_apiDomain}/bigin/v1/{$module}/{$recordID}/photo";
        } else {
            $uploadFileEndpoint = "{$this->_apiDomain}/bigin/v1/{$module}/{$recordID}/Attachments";
        }

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
                }
            }
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
