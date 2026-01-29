<?php

namespace BitCode\FI\Log;

use BitCode\FI\Core\Database\LogModel;
use BitCode\FI\Core\Integration\IntegrationHandler;
use BitCode\FI\Core\Util\Capabilities;
use BitCode\FI\Core\Util\EmailNotification;
use BitCode\FI\Flow\Flow;
use BitCode\FI\Flow\FlowController;
use Exception;
use WP_Error;

final class LogHandler
{
    public function __construct()
    {
        //
    }

    public function get($data)
    {
        if (!(Capabilities::Check('manage_options') || Capabilities::Check('bit_integrations_manage_integrations'))) {
            wp_send_json_error(__('User don\'t have permission to access this page', 'bit-integrations'));
        }

        if (!isset($data->id)) {
            wp_send_json_error(__('Integration Id can\'t be empty', 'bit-integrations'));
        }
        $logModel = new LogModel();
        $countResult = $logModel->count(['flow_id' => $data->id]);
        if (is_wp_error($countResult)) {
            wp_send_json_success(
                [
                    'count' => 0,
                    'data'  => [],
                ]
            );
        }
        $count = $countResult[0]->count;
        if ($count < 1) {
            wp_send_json_success(
                [
                    'count' => 0,
                    'data'  => [],
                ]
            );
        }
        $offset = 0;
        $limit = 10;
        if (isset($data->offset)) {
            $offset = $data->offset;
        }
        if (isset($data->pageSize)) {
            $limit = $data->pageSize;
        }
        if (isset($data->limit)) {
            $limit = $data->limit;
        }

        $result = $logModel->get('*', ['flow_id' => $data->id], $limit, $offset, 'id', 'desc');
        if (is_wp_error($result)) {
            wp_send_json_success(
                [
                    'count' => 0,
                    'data'  => [],
                ]
            );
        }
        wp_send_json_success(
            [
                'count' => \intval($count),
                'data'  => $result,
            ]
        );
    }

    public static function save($flow_id, $api_type, $response_type, $response_obj, $field_data = null)
    {
        if (empty($flow_id)) {
            return;
        }

        $flow = new Flow();
        $flow->authorizationStatusChange($flow_id, $response_type == 'success' ? true : false);

        // If field_data not provided, try to get from global storage
        if (empty($field_data)) {
            $field_data = IntegrationHandler::getFieldValues($flow_id);
        }

        $logData = [
            'flow_id'       => $flow_id,
            'api_type'      => \is_string($api_type) ? $api_type : wp_json_encode($api_type),
            'response_type' => \is_string($response_type) ? $response_type : wp_json_encode($response_type),
            'response_obj'  => \is_string($response_obj) ? $response_obj : wp_json_encode($response_obj),
            'created_at'    => current_time('mysql')
        ];

        // Store field data for all integrations to enable reexecution
        if (!empty($field_data)) {
            $logData['field_data'] = \is_string($field_data) ? $field_data : wp_json_encode($field_data);
        }

        $logModel = new LogModel();
        $logModel->insert($logData);

        $appConfig = get_option('btcbi_app_conf');
        if (\in_array($response_type, ['error', 'validation']) && !empty($appConfig->enable_failure_email)) {
            self::sendFailureEmail($flow_id, $api_type, $response_obj);
        }
    }

    /**
     * Helper method to save logs with field data for reexecution
     *
     * @param int    $flow_id       Integration flow ID
     * @param mixed  $api_type      API type/integration name
     * @param string $response_type Response type (success, error, or validation)
     * @param mixed  $response_obj  Response object
     * @param mixed  $field_values  Original field values for reexecution
     *
     * @return void
     */
    public static function saveError($flow_id, $api_type, $response_type, $response_obj, $field_values = null)
    {
        self::save($flow_id, $api_type, $response_type, $response_obj, $field_values);
    }

    public static function deleteLog($data)
    {
        if (empty($data->id) && empty($data->flow_id)) {
            wp_send_json_error(__('Integration Id or Log Id required', 'bit-integrations'));
        }
        $deleteStatus = self::delete($data);
        if (is_wp_error($deleteStatus)) {
            wp_send_json_error($deleteStatus->get_error_code());
        }
        wp_send_json_success(__('Log deleted successfully', 'bit-integrations'));
    }

    public static function delete($data)
    {
        if (!(Capabilities::Check('manage_options') || Capabilities::Check('bit_integrations_manage_integrations'))) {
            wp_send_json_error(__('User don\'t have permission to access this page', 'bit-integrations'));
        }
        $condition = null;
        if (!empty($data->id)) {
            if (\is_array($data->id)) {
                $condition = [
                    'id' => $data->id
                ];
            } else {
                $condition = [
                    'id' => $data->id
                ];
            }
        }
        if (!empty($data->flow_id)) {
            $condition = [
                'flow_id' => $data->flow_id
            ];
        }
        $logModel = new LogModel();

        return $logModel->bulkDelete($condition);
    }

    public static function logAutoDelte($intervalDate)
    {
        $condition = "DATE_ADD(date(created_at), INTERVAL {$intervalDate} DAY) < CURRENT_DATE";
        $logModel = new LogModel();

        return $logModel->autoLogDelete($condition);
    }

    /**
     * Reexecute a failed integration
     *
     * @param object $data Contains log_id to reexecute
     *
     * @return void
     */
    public static function reexecute($data)
    {
        if (!(Capabilities::Check('manage_options') || Capabilities::Check('bit_integrations_manage_integrations'))) {
            wp_send_json_error(__('User don\'t have permission to access this page', 'bit-integrations'));
        }

        if (empty($data->log_id)) {
            wp_send_json_error(__('Log ID is required', 'bit-integrations'));
        }

        $logModel = new LogModel();
        $logEntry = $logModel->get('*', ['id' => $data->log_id]);

        if (empty($logEntry) || !isset($logEntry[0])) {
            wp_send_json_error(__('Log entry not found', 'bit-integrations'));
        }

        $log = $logEntry[0];

        // Check if field_data exists
        if (empty($log->field_data)) {
            wp_send_json_error(__('No field data available for re-execution. This log entry cannot be re-executed.', 'bit-integrations'));
        }

        // Get the flow details
        $flowController = new FlowController();
        $flows = $flowController->get(['id' => $log->flow_id]);

        if (is_wp_error($flows) || empty($flows)) {
            wp_send_json_error(__('Integration flow not found', 'bit-integrations'));
        }

        $flowData = $flows[0];

        if ($flowData->status != 1) {
            wp_send_json_error(__('Integration is not active', 'bit-integrations'));
        }

        // Decode field data
        $fieldData = json_decode($log->field_data, true);
        if (empty($fieldData)) {
            wp_send_json_error(__('Invalid field data', 'bit-integrations'));
        }

        // Extract trigger information from field data
        $triggered_entity = null;
        $triggered_entity_id = null;

        if (isset($fieldData['bit-integrator%trigger_data%'])) {
            $triggerData = $fieldData['bit-integrator%trigger_data%'];
            $triggered_entity = $triggerData['triggered_entity'] ?? null;
            $triggered_entity_id = $triggerData['triggered_entity_id'] ?? null;
        }

        // If trigger data not found in field data, try to get from flow details
        if (empty($triggered_entity)) {
            $triggered_entity = $flowData->triggered_entity ?? null;
            $triggered_entity_id = $flowData->triggered_entity_id ?? null;
        }

        // Validate required trigger information
        if (empty($triggered_entity)) {
            wp_send_json_error(__('Triggered entity is required for re-execution', 'bit-integrations'));
        }

        if (!isset($triggered_entity_id)) {
            wp_send_json_error(__('Triggered entity ID is required for re-execution', 'bit-integrations'));
        }

        try {
            // Re-execute through the full Flow::execute() path
            // This ensures all conditions, field mapping, and processing happen correctly
            Flow::execute($triggered_entity, $triggered_entity_id, $fieldData, [$flowData]);

            wp_send_json_success(__('Integration re-executed successfully', 'bit-integrations'));
        } catch (Exception $e) {
            wp_send_json_error(__('Re-execution error: ', 'bit-integrations') . $e->getMessage());
        }
    }

    /**
     * Send email notification for integration failure
     *
     * @param int   $flow_id      Integration flow ID
     * @param mixed $api_type     API type/integration name
     * @param mixed $response_obj Error response object
     *
     * @return void
     */
    private static function sendFailureEmail($flow_id, $api_type, $response_obj)
    {
        $integrationHandler = new FlowController();
        $integrations = $integrationHandler->get(
            ['id' => $flow_id],
            [
                'id',
                'name',
                'triggered_entity',
            ]
        );

        $action_name = 'Unknown';
        $trigger_name = 'Unknown';
        $record_type = wp_json_encode($api_type);

        if (!is_wp_error($integrations) && !empty($integrations) && isset($integrations[0])) {
            $action_name = $integrations[0]->name;
            $trigger_name = $integrations[0]->triggered_entity;
        }

        // Get error message
        $error_message = 'An error occurred during integration execution.';

        if (\is_string($response_obj)) {
            $error_message = $response_obj;
        } elseif (\is_array($response_obj)) {
            $error_message = isset($response_obj['message']) ? $response_obj['message'] : wp_json_encode($response_obj);
        } elseif (\is_object($response_obj)) {
            if ($response_obj instanceof WP_Error) {
                $error_message = $response_obj->get_error_message();
            } elseif (isset($response_obj->message)) {
                $error_message = $response_obj->message;
            } else {
                $error_message = wp_json_encode($response_obj);
            }
        }

        // Truncate long error messages
        $maxLength = 500;
        if (\strlen($error_message) > $maxLength) {
            $error_message = \substr($error_message, 0, $maxLength) . '...';
        }

        // Send the email notification
        EmailNotification::sendFailureNotification($flow_id, $action_name, $trigger_name, $record_type, $error_message);
    }
}
