<?php
namespace BitCode\FI\Flow;

use BitCode\FI\Core\Database\FlowModel;
use BitCode\FI\Log\LogHandler as Log;
use BitCode\FI\Core\Util\IpTool;

final class FlowController
{
    private static $_integrationModel;

    /**
     * Constructor of FlowController
     *
     * @return void
     */
    public function __construct()
    {
        static::$_integrationModel = new FlowModel();
    }

    /**
     * Retrieved flows from DB based on conditions
     *
     * @param Array $conditions Conditions to retrieve flows
     * @param Array $columns    Columns to select
     *
     * @return Array|WP_Error
     */
    public function get($conditions = [], $columns = [])
    {
        if (empty($columns)) {
            $columns = [
                'id',
                'name',
                'triggered_entity',
                'triggered_entity_id',
                'flow_details',
                'status',
                'user_id',
                'user_ip',
                'created_at',
                'updated_at'

            ];
        }
        return static::$_integrationModel->get(
            $columns,
            $conditions,
            null,
            null,
            'created_at',
            'DESC'
        );
    }

    /**
     * Save Flows to DB
     *
     * @param String  $name                Name of the flow
     * @param String  $triggered_entity    Triggered form name
     * @param Integer $triggered_entity_id ID of the triggered form
     * @param Object  $flow_details        Path of the flow it will go through after triggered
     * @param Boolean $status              Status of the flow. Disabled or Enabled.
     *
     * @return Integer|WP_Error
     */
    public function save($name, $triggered_entity, $triggered_entity_id, $flow_details, $status = null)
    {
        if ($status == null) {
            $status = 1;
        }
        $user_details = IpTool::getUserDetail();
        return static::$_integrationModel->insert(
            [
                'name' => $name,
                'triggered_entity' => $triggered_entity,
                'triggered_entity_id' => $triggered_entity_id,
                'flow_details' => is_string($flow_details) ? $flow_details : wp_json_encode($flow_details),
                'status' => $status,
                'user_id' => $user_details['id'],
                'user_ip' => $user_details['ip'],
                'created_at' => $user_details['time'],
                'updated_at' => $user_details['time']
            ]
        );
    }

    /**
     * Update Flows to DB
     *
     * @param Integer $id   ID of the flow to update
     * @param Array   $data Data to update
     *
     * @return Integer|WP_Error
     */
    public function update(
        $id,
        $data
    ) {
        $user_details = IpTool::getUserDetail();
        $columnToUpdate = [
            'user_id' => $user_details['id'],
            'user_ip' => $user_details['ip'],
            'updated_at' => $user_details['time']
        ];
        if (isset($data['name'])) {
            $columnToUpdate['name'] = $data['name'];
        }
        if (isset($data['triggered_entity'])) {
            $columnToUpdate['triggered_entity'] = $data['triggered_entity'];
        }
        if (isset($data['triggered_entity_id'])) {
            $columnToUpdate['triggered_entity_id'] = $data['triggered_entity_id'];
        }
        if (isset($data['flow_details'])) {
            $columnToUpdate['flow_details'] = $data['flow_details'];
        }
        return static::$_integrationModel->update(
            $columnToUpdate,
            ['id' => $id]
        );
    }

    /**
     * Updates Flow status to DB
     *
     * @param Integer $id     ID of the flow to update
     * @param Boolean $status Status of the flow. Disabled or Enabled.
     *
     * @return Integer|WP_Error
     */
    public function updateStatus($id, $status)
    {
        $user_details = IpTool::getUserDetail();
        return static::$_integrationModel->update(
            [
                'status' => $status,
                'user_id' => $user_details['id'],
                'user_ip' => $user_details['ip'],
                'updated_at' => $user_details['time']
            ],
            [
                'id' => $id
            ]
        );
    }

    /**
     * Deletes Flow from DB
     *
     * @param Integer $flowID ID of the flow to delete.
     *
     * @return Boolean|WP_Error
     */
    public function delete($flowID)
    {
        $delStatus = static::$_integrationModel->delete(
            [
                'id' => $flowID
            ]
        );
        if (is_wp_error($delStatus)) {
            return $delStatus;
        }
        Log::delete((object)['flow_id' => $flowID]);
        return $delStatus;
    }

    public function bulkDelete($flowID)
    {
        $delStatus = static::$_integrationModel->bulkDelete(
            [
                'id' => $flowID,
            ]
        );
        if (is_wp_error($delStatus)) {
            return $delStatus;
        }
        Log::delete((object) ['flow_id' => $flowID]);
        return $delStatus;
    }
}
