<?php

namespace BitApps\Integrations\Actions\CustomAction;

use BitApps\Integrations\Core\Util\PhpSyntaxChecker;
use BitApps\Integrations\Log\LogHandler;
use Throwable;

class CustomActionController
{
    public static function functionValidateHandler($data)
    {
        $result = PhpSyntaxChecker::validate($data);

        if ($result['is_valid']) {
            wp_send_json_success(
                sprintf(
                    /* translators: %s: validation result message */
                    __('Congrats, %s', 'bit-integrations'),
                    $result['message']
                )
            );
        }

        wp_send_json_error($result['message']);
    }

    public function execute($integrationData, $fieldValues)
    {
        $funcFileLocation = $integrationData->flow_details->funcFileLocation;
        $integId = $integrationData->id;
        $isExits = file_exists($funcFileLocation);
        $isSuccessfullyRun = true;
        $additionalData = null;

        ob_start();
        if ($isExits) {
            $trigger = (array) $fieldValues;

            try {
                include "{$funcFileLocation}";
            } catch (Throwable $th) {
                $isSuccessfullyRun = false;
                LogHandler::save($integId, $th->getMessage(), 'error', __('Custom action Failed', 'bit-integrations'));
            }
            $additionalData = ob_get_clean();
        } else {
            LogHandler::save($integId, wp_json_encode(['type' => 'custom_action', 'type_name' => 'custom action']), 'error', wp_json_encode('Custom action file not found'));

            return;
        }
        if ($isSuccessfullyRun) {
            LogHandler::save($integId, wp_json_encode(['type' => 'custom_action', 'type_name' => 'custom action']), 'success', wp_json_encode('Custom action successfully run' . !empty($additionalData) ? wp_json_encode($additionalData) : ''));
        }

        return true;
    }
}
