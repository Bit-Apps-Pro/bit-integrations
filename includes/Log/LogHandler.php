<?php

namespace BitCode\FI\Log;

use BitCode\FI\Core\Database\LogModel;

final class LogHandler
{
    public function __construct()
    {
        //
    }

    public function get($data)
    {
        if (!isset($data->id)) {
            wp_send_json_error('Integration Id cann\'t be empty');
        }
        $logModel = new LogModel();
        $countResult = $logModel->count(['flow_id' => $data->id]);
        if (is_wp_error($countResult)) {
            wp_send_json_success(
                [
                    'count' => 0,
                    'data' => [],
                ]
            );
        }
        $count = $countResult[0]->count;
        if ($count < 1) {
            wp_send_json_success(
                [
                    'count' => 0,
                    'data' => [],
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
                    'data' => [],
                ]
            );
        }
        wp_send_json_success(
            [
                'count' => intval($count),
                'data' => $result,
            ]
        );
    }

    public static function save($flow_id, $api_type, $response_type, $response_obj)
    {
        $logModel = new LogModel();
        $logModel->insert(
            [
                'flow_id' => $flow_id,
                'api_type' => is_string($api_type) ? $api_type : json_encode($api_type),
                'response_type' => is_string($response_type) ? $response_type : json_encode($response_type),
                'response_obj' => is_string($response_obj) ? $response_obj : json_encode($response_obj),
                'created_at' => current_time("mysql")
            ]
        );
    }

    public static function deleteLog($data)
    {
        if (empty($data->id) && empty($data->flow_id)) {
            wp_send_json_error('Integration Id or Log Id required');
        }
        $deleteStatus = self::delete($data);
        if (is_wp_error($deleteStatus)) {
            wp_send_json_error($deleteStatus->get_error_code());
        }
        wp_send_json_success(__('Log deleted successfully', 'bit-integrations'));
    }

    public static function delete($data)
    {
        $condition = null;
        if (!empty($data->id)) {
            if (is_array($data->id)) {
                $condition = [
                    'id' =>  $data->id
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
        $condition = "DATE_ADD(date(created_at), INTERVAL $intervalDate DAY) < CURRENT_DATE";
        $logModel = new LogModel();
        return $logModel->autoLogDelete($condition);
    }
}
