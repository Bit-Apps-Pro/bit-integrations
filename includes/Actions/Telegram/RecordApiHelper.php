<?php

/**
 * Telegram Record Api
 */

namespace BitCode\FI\Actions\Telegram;

use BitCode\FI\Log\LogHandler;
use BitCode\FI\Core\Util\Common;
use BitCode\FI\Core\Util\HttpHelper;

/**
 * Provide functionality for Record insert, upsert
 */
class RecordApiHelper
{
    private $_defaultHeader;

    private $_integrationID;

    private $_apiEndPoint;

    public function __construct($apiEndPoint, $integId)
    {
        $this->_defaultHeader['Content-Type'] = 'multipart/form-data';
        $this->_integrationID = $integId;
        $this->_apiEndPoint = $apiEndPoint;
    }

    public function sendMessages($data)
    {
        $insertRecordEndpoint = $this->_apiEndPoint . '/sendMessage';

        return HttpHelper::get($insertRecordEndpoint, $data, $this->_defaultHeader);
    }

    public function execute($integrationDetails, $fieldValues)
    {
        $msg = Common::replaceFieldWithValue($integrationDetails->body, $fieldValues);
        $messagesBody = wp_strip_all_tags(static::htmlToMarkdown($msg));

        if (!empty($integrationDetails->actions->attachments)) {
            foreach ($fieldValues as $fieldKey => $fieldValue) {
                if ($integrationDetails->actions->attachments == $fieldKey) {
                    $file = $fieldValue;
                }
            }

            $file = self::getFiles($file);
            if (!empty($file) && \is_array($file) && \count($file) > 1) {
                $data = [
                    'chat_id' => $integrationDetails->chat_id,
                    'caption' => $messagesBody,
                    'media'   => $file
                ];

                $sendPhotoApiHelper = new FilesApiHelper();
                $recordApiResponse = $sendPhotoApiHelper->uploadMultipleFiles($this->_apiEndPoint, $data);
                $recordApiResponse = \is_string($recordApiResponse) ? json_decode($recordApiResponse) : $recordApiResponse;

                if ($recordApiResponse && $recordApiResponse->ok) {
                    $data = [
                        'chat_id'    => $integrationDetails->chat_id,
                        'text'       => $messagesBody,
                        'parse_mode' => $integrationDetails->parse_mode
                    ];
                    $recordApiResponse = $this->sendMessages($data);
                }
            } elseif (!empty($file)) {
                $data = [
                    'chat_id'    => $integrationDetails->chat_id,
                    'caption'    => $messagesBody,
                    'parse_mode' => $integrationDetails->parse_mode,
                    'photo'      => \is_array($file) ? $file[0] : $file
                ];

                $sendPhotoApiHelper = new FilesApiHelper();
                $recordApiResponse = $sendPhotoApiHelper->uploadFiles($this->_apiEndPoint, $data);
            } else {
                $data = [
                    'chat_id'    => $integrationDetails->chat_id,
                    'text'       => $messagesBody,
                    'parse_mode' => $integrationDetails->parse_mode
                ];
                $recordApiResponse = $this->sendMessages($data);
            }

            $type = 'insert';
        } else {
            $data = [
                'chat_id'    => $integrationDetails->chat_id,
                'text'       => $messagesBody,
                'parse_mode' => 'Markdown',
            ];

            $recordApiResponse = $this->sendMessages($data);
            $type = 'insert';
        }
        $recordApiResponse = \is_string($recordApiResponse) ? json_decode($recordApiResponse) : $recordApiResponse;

        if (!empty($recordApiResponse) && isset($recordApiResponse->ok) && $recordApiResponse->ok == true) {
            LogHandler::save($this->_integrationID, ['type' => 'record', 'type_name' => $type], 'success', $recordApiResponse);
        } else {
            LogHandler::save($this->_integrationID, ['type' => 'record', 'type_name' => $type], 'error', $recordApiResponse);
        }

        return $recordApiResponse;
    }

    private static function htmlToMarkdown($html)
    {
        // Regular expressions for matching HTML elements and attributes
        $patterns = [
            '/<b>(.*?)<\/b>/s'                                                    => '*$1*', // Bold
            '/<strong>(.*?)<\/strong>/s'                                          => '*$1*', // Bold
            '/<i>(.*?)<\/i>/s'                                                    => '_$1_', // Italic
            '/<ul>(.*?)<\/ul>/s'                                                  => "\n $1\n", // Unordered list
            '/<ol>(.*?)<\/ol>/s'                                                  => "\n $1\n", // Ordered list
            '/<li>(.*?)<\/li>/s'                                                  => "• $1\n", // List item
            '/<a title="(.*)" href="(.*?)" target="(.*)" rel="(.*)">(.*?)<\/a>/s' => '[$1]($2)', // Links
            '/<a(.*)href="(.*?)"(.*)>(.*?)<\/a>/s'                                => '[$1]($2)', // Links
            '/<img(.*)src="(.*?)"(.*)alt="(.*?)"(.*)>/s'                          => '[$1]($2)', // Images
            '/<code>(.*?)<\/code>/s'                                              => "```\n$1\n```", // Code blocks
            '/<pre>(.*?)<\/pre>/s'                                                => "```\n$1\n```", // Preformatted text
            '/<h1>(.*?)<\/h1>/s'                                                  => "$1\n", // Heading 1
            '/<h2>(.*?)<\/h2>/s'                                                  => "$1\n", // Heading 2
            '/<h3>(.*?)<\/h3>/s'                                                  => "$1\n", // Heading 3
            '/<h4>(.*?)<\/h4>/s'                                                  => "$1\n", // Heading 4
            '/<h5>(.*?)<\/h5>/s'                                                  => "$1\n", // Heading 5
            '/<h6>(.*?)<\/h6>/s'                                                  => "$1\n", // Heading 6
            '/<p>(.*?)<\/p>/s'                                                    => "$1\n", // Paragraphs
            '/<br>(.*?)<\/br>/s'                                                  => "\n", // Line breaks
            '/<del>(.*?)<\/del>/s'                                                => '~$1~', // Strikethrough
            '/<s>(.*?)<\/s>/s'                                                    => '~$1~', // Strikethrough
        ];

        // Replace HTML elements with their Markdown equivalents
        $markdown = preg_replace(array_keys($patterns), array_values($patterns), $html);

        // Handle special characters
        return str_replace(['**', '\*', '\_', '\|', '\~'], ['*', '*', '_', '|', '~'], $markdown);
    }

    private static function getFiles($files)
    {
        $allFiles = [];
        if (\is_array($files)) {
            foreach ($files as $file) {
                if (\is_array($file)) {
                    $allFiles = self::getFiles($file);
                } else {
                    $allFiles[] = $file;
                }
            }
        } else {
            return $files;
        }

        return $allFiles;
    }
}
