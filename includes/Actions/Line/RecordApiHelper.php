<?php

namespace BitCode\FI\Actions\Line;

use BitCode\FI\Core\Util\Common;
use BitCode\FI\Core\Util\HttpHelper;
use BitCode\FI\Log\LogHandler;

class RecordApiHelper
{
    private string $accessToken;

    private string $apiEndPoint;

    private int $integrationID;

    public function __construct($apiEndPoint, $accessToken, $integrationID)
    {
        $this->apiEndPoint = $apiEndPoint;
        $this->accessToken = $accessToken;
        $this->integrationID = $integrationID;
    }

    public function execute($integrationDetails, $fieldValues)
    {
        $messages = $this->buildMessages($integrationDetails, $fieldValues);

        if (empty($messages)) {
            return ['error' => 'No valid message generated.'];
        }

        $data = ['messages' => $messages];
        $type = $integrationDetails->messageType ?? 'sendPushMessage';

        switch ($type) {
            case 'sendReplyMessage':
                $data['replyToken'] = $integrationDetails->replyToken ?? '';
                $response = $this->sendReplyMessage(json_encode($data));

                break;

            case 'sendBroadcastMessage':
                $response = $this->sendBroadcastMessage(json_encode($data));

                break;

            default:
                $data['to'] = $integrationDetails->recipientId ?? '';
                $response = $this->sendPushMessage(json_encode($data));
                $response = HttpHelper::$responseCode === 200 ? 'Push message sent successfully' : 'Failed';
        }

        $status = HttpHelper::$responseCode == 200 ? 'success' : 'error';

        LogHandler::save($this->integrationID, ['type' => 'record', 'type_name' => $type], $status, $response);

        return $response;
    }

    private function buildMessages($details, $values)
    {
        $messages = [];

        $text = $this->buildTextMessage($details, $values);
        if ($text) {
            $messages[] = $text;
        }

        if (!empty($details->sendSticker) && !empty($details->sticker_field_map)) {
            $stickerRequiredFields = ['sticker_id', 'package_id'];
            $stickers = $this->processGrouped(
                $values,
                $details->sticker_field_map,
                $stickerRequiredFields,
                [$this, 'transformSticker']
            );
            $messages = array_merge($messages, $stickers);
        }

        if (!empty($details->sendImage) && !empty($details->image_field_map)) {
            $imageRequiredFields = ['originalContentUrl'];
            $images = $this->processGrouped(
                $values,
                $details->image_field_map,
                $imageRequiredFields,
                [$this, 'transformImage']
            );
            $messages = array_merge($messages, $images);
        }

        if (!empty($details->sendAudio) && !empty($details->audio_field_map)) {
            $audioFields = array_filter($details->audio_field_map, function ($field) {
                return $field->fieldType === 'audio';
            });
            if (\count($audioFields) > 0) {
                $audioRequiredFields = ['originalContentUrl'];
                $audios = $this->processGrouped(
                    $values,
                    $audioFields,
                    $audioRequiredFields,
                    [$this, 'transformAudio']
                );
                $audios = array_filter($audios);
                $messages = array_merge($messages, $audios);
            }
        }

        if (!empty($details->sendVideo) && !empty($details->video_field_map)) {
            $videoRequiredFields = ['originalContentUrl'];
            $videos = $this->processGrouped(
                $values,
                $details->video_field_map,
                $videoRequiredFields,
                [$this, 'transformVideo']
            );
            $messages = array_merge($messages, $videos);
        }

        if (!empty($details->sendLocation) && !empty($details->location_field_map)) {
            $locationRequiredFields = ['title', 'address', 'latitude', 'longitude'];
            $locations = $this->processGrouped(
                $values,
                $details->location_field_map,
                $locationRequiredFields,
                [$this, 'transformLocation']
            );
            $messages = array_merge($messages, $locations);
        }

        return array_values(array_filter($messages));
    }

    private function buildTextMessage($details, $values): ?array
    {
        $messageText = '';

        if (!empty($details->message_field_map)) {
            $mappedMessage = $this->mapFields($values, $details->message_field_map);
            if (!empty($mappedMessage['message'])) {
                $messageText = $mappedMessage['message'];
            }
        }

        if (empty($messageText) && !empty($details->message)) {
            $messageText = $details->message;
        }

        if (empty($messageText)) {
            return null;
        }

        $message = ['type' => 'text', 'text' => $messageText];

        if (!empty($details->sendEmojis) && !empty($details->emojis_field_map)) {
            $emojis = [];
            $groups = $this->organizeFieldsByGroup($details->emojis_field_map);
            foreach ($groups as $groupId => $groupFields) {
                $emoji = $this->mapFields($values, $groupFields);
                if (isset($emoji['emojis_id'], $emoji['product_id']) && !empty($emoji['index'])) {
                    $emojis[] = [
                        'index'     => (int) $emoji['index'],
                        'productId' => $emoji['product_id'],
                        'emojiId'   => $emoji['emojis_id'],
                    ];
                }
            }
            if (!empty($emojis)) {
                $message['emojis'] = $emojis;
            }
        }

        return $message;
    }

    private function organizeFieldsByGroup(array $fieldMap): array
    {
        $grouped = [];
        foreach ($fieldMap as $field) {
            $groupId = $field->groupId ?? 'default';
            if (!isset($grouped[$groupId])) {
                $grouped[$groupId] = [];
            }
            $grouped[$groupId][] = $field;
        }

        return $grouped;
    }

    private function processGrouped(array $values, array $fieldMap, array $requiredKeys, callable $builder): array
    {
        $results = [];
        $groups = $this->organizeFieldsByGroup($fieldMap);
        foreach ($groups as $groupId => $groupFields) {
            $data = $this->mapFields($values, $groupFields);

            $allPresent = true;
            foreach ($requiredKeys as $key) {
                if (empty($data[$key])) {
                    $allPresent = false;

                    break;
                }
            }

            if ($allPresent) {
                $results[] = $builder($data);
            }
        }

        return $results;
    }

    private function mapFields(array $data, array $fieldMap): array
    {
        $result = [];

        foreach ($fieldMap as $index => $field) {
            $key = $field->lineFormField;

            if ($field->formField === 'custom' && (isset($field->customValue) && $field->customValue !== '')) {
                $result[$key] = Common::replaceFieldWithValue($field->customValue, $data);
            } elseif (isset($data[$field->formField])) {
                $result[$key] = $data[$field->formField];
            }
        }

        return $result;
    }

    private function handleFilterResponse($response)
    {
        if (empty($response)) {
            return (object) ['error' => \wp_sprintf(\__('%s plugin is not installed or activated', 'bit-integrations'), 'Bit Integrations Pro')];
        }

        return $response;
    }

    private function setHeaders(): array
    {
        return [
            'Authorization' => 'Bearer ' . $this->accessToken,
            'Content-Type'  => 'application/json'
        ];
    }

    private function sendPushMessage($data)
    {
        return HttpHelper::post($this->apiEndPoint . '/message/push', $data, $this->setHeaders());
    }

    private function sendReplyMessage($data)
    {
        $response = \apply_filters('btcbi_line_reply_message', false, $data, $this->setHeaders(), $this->apiEndPoint);

        return static::handleFilterResponse($response);
    }

    private function sendBroadcastMessage($data)
    {
        $response = \apply_filters('btcbi_line_broadcast_message', false, $data, $this->setHeaders(), $this->apiEndPoint);

        return static::handleFilterResponse($response);
    }

    private function transformSticker(array $data): array
    {
        return [
            'type'      => 'sticker',
            'packageId' => $data['package_id'],
            'stickerId' => $data['sticker_id'],
        ];
    }

    private function transformImage(array $data): array
    {
        return array_filter([
            'type'               => 'image',
            'originalContentUrl' => $data['originalContentUrl'],
            'previewImageUrl'    => $data['previewImageUrl'] ?? null
        ]);
    }

    private function transformAudio(array $data): ?array
    {
        if (empty($data['duration'])) {
            return null;
        }

        return [
            'type'               => 'audio',
            'originalContentUrl' => $data['originalContentUrl'],
            'duration'           => $data['duration']
        ];
    }

    private function transformVideo(array $data): array
    {
        return array_filter([
            'type'               => 'video',
            'originalContentUrl' => $data['originalContentUrl'],
            'previewImageUrl'    => $data['previewImageUrl'] ?? null
        ]);
    }

    private function transformLocation(array $data): array
    {
        return [
            'type'      => 'location',
            'title'     => $data['title'],
            'address'   => $data['address'],
            'latitude'  => (float) $data['latitude'],
            'longitude' => (float) $data['longitude'],
        ];
    }
}
