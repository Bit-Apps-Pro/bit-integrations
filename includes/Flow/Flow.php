<?php

/**
 *
 * @package bit-integrations
 */

namespace BitCode\FI\Flow;

use WP_Error;
use BitCode\FI\Plugin;
use BitCode\FI\Log\LogHandler;
use BitCode\FI\Core\Util\Common;
use BitCode\FI\Core\Util\IpTool;
use BitCode\FI\Core\Util\SmartTags;
use BitCode\FI\Core\Util\StoreInCache;
use BitCode\FI\Triggers\TriggerController;
use BitCode\FI\Core\Util\CustomFuncValidator;

/**
 * Provides details of available integration and helps to
 * execute available flows
 */

final class Flow
{
    /**
     * Checks a Integration Action Exists or not
     *
     * @param  String $name Name of Action
     * @return boolean
     */
    protected static function isActionExists($name)
    {
        if (class_exists("BitCode\\FI\\Actions\\{$name}\\{$name}Controller")) {
            return "BitCode\\FI\\Actions\\{$name}\\{$name}Controller";
        } else {
            return false;
        }
    }

    /**
     * Checks a Integration Trigger Exists or not
     *
     * @param String $name Name of Trigger
     *
     * @return boolean
     */
    protected static function isTriggerExists($name)
    {
        if (class_exists("BitCode\\FI\\Triggers\\{$name}\\{$name}Controller")) {
            return "BitCode\\FI\\Triggers\\{$name}\\{$name}Controller";
        } else {
            return false;
        }
    }

    public function triggers()
    {
        return TriggerController::triggerList();
    }

    public function triggerName($triggerName, $triggerId)
    {
        if ($triggerName == 'Post') {
            switch ($triggerId) {
                case 1:
                    return 'Create a new post';
                case 2:
                    return 'Updated a post';
                case 3:
                    return 'Delete a post';
                case 4:
                    return 'User views a post';
                case 5:
                    return 'User comments on a post';
                case 6:
                    return 'Change post status';
                default:
                    return $triggerName;
            }
        }
        return $triggerName;
    }

    public function flowList()
    {
        $integrationHandler = new FlowController();
        $triggers = $this->triggers();
        $integrations = $integrationHandler->get(
            [],
            [
                'id',
                'name',
                'triggered_entity_id',
                'triggered_entity',
                'status',
                'created_at',
            ]
        );
        if (is_wp_error($integrations)) {
            wp_send_json_error($integrations->get_error_message());
        }
        foreach ($integrations as $integration) {
            if (isset($triggers[$integration->triggered_entity])) {
                $entity = $integration->triggered_entity;
                $integration->triggered_entity = $this->triggerName($triggers[$entity]['name'], $integration->triggered_entity_id);
                $integration->isCorrupted = $triggers[$entity]['is_active'];
            }
        }
        wp_send_json_success(['integrations' => $integrations]);
    }

    public function get($data)
    {
        $missing_field = null;
        if (!property_exists($data, 'id')) {
            $missing_field = 'Integration ID';
        }
        if (!is_null($missing_field)) {
            wp_send_json_error(sprintf(__('%s can\'t be empty', 'bit-integrations'), $missing_field));
        }
        $integrationHandler = new FlowController();
        $integrations = $integrationHandler->get(
            ['id' => $data->id],
            [
                'id',
                'name',
                'triggered_entity',
                'triggered_entity_id',
                'flow_details',
            ]
        );
        if (is_wp_error($integrations)) {
            wp_send_json_error($integrations->get_error_message());
        }
        $integration = $integrations[0];
        if (!($trigger = self::isTriggerExists($integration->triggered_entity))) {
            wp_send_json_error('Trigger does not exists');
        }
        if (is_string($integration->flow_details)) {
            $integration->flow_details = json_decode($integration->flow_details);
        }
        if (is_object($integration->flow_details) && !property_exists($integration->flow_details, 'fields') && method_exists($trigger, 'fields')) {
            if ($integration->triggered_entity == 'Elementor' || $integration->triggered_entity == 'Divi' || $integration->triggered_entity == 'Bricks' || $integration->triggered_entity == 'Brizy' || $integration->triggered_entity == 'Breakdance' || $integration->triggered_entity == 'CartFlow') {
                $data = (object) [
                    'id' => $integration->triggered_entity_id,
                    'postId' => $integration->flow_details->postId,
                ];
                $integration->fields = $trigger::fields($data);
            } else {
                $integration->fields = $trigger::fields($integration->triggered_entity_id);
            }
        }
        if (property_exists($integration->flow_details, 'fields')) {
            $integration->fields = $integration->flow_details->fields;
        }
        wp_send_json_success(['integration' => $integration]);
    }

    public function save($data)
    {
        $missing_field = null;
        if (!property_exists($data, 'trigger')) {
            $missing_field = 'Trigger';
        }

        if (!property_exists($data, 'triggered_entity_id')) {
            $missing_field = (is_null($missing_field) ? null : ', ') . 'Triggered form ID';
        }

        if (!property_exists($data, 'flow_details')) {
            $missing_field = (is_null($missing_field) ? null : ', ') . 'Integration details';
        }
        if (!is_null($missing_field)) {
            wp_send_json_error(sprintf(__('%s can\'t be empty', 'bit-integrations'), $missing_field));
        }

        // custom action
        if ($data->flow_details->type === 'CustomAction') {
            CustomFuncValidator::functionValidateHandler($data);
        }

        $name = !empty($data->name) ? $data->name : '';
        $integrationHandler = new FlowController();
        $saveStatus = $integrationHandler->save($name, $data->trigger, $data->triggered_entity_id, $data->flow_details);

        if ($saveStatus) {
            $storeInCacheInstance = new StoreInCache();
            $activeFlowTrigger = $storeInCacheInstance::getActiveFlow();
            $storeInCacheInstance::setTransient('activeCurrentTrigger', $activeFlowTrigger, DAY_IN_SECONDS);
        }

        if (is_wp_error($saveStatus)) {
            wp_send_json_error($saveStatus->get_error_message());
        }

        wp_send_json_success(['id' => $saveStatus, 'msg' => __('Integration saved successfully', 'bit-integrations')]);
    }

    public function flowClone($data)
    {
        $missingId = null;
        $user_details = IpTool::getUserDetail();
        if (!property_exists($data, 'id')) {
            $missingId = 'Flow ID';
        }
        if (!is_null($missingId)) {
            wp_send_json_error(sprintf(__('%s can\'t be empty', 'bit-integrations'), $missingId));
        }
        $integrationHandler = new FlowController();
        $integrations = $integrationHandler->get(
            ['id' => $data->id],
            [
                'id',
                'name',
                'triggered_entity',
                'triggered_entity_id',
                'flow_details',
            ]
        );
        if (!is_wp_error($integrations) && count($integrations) > 0) {
            $newInteg = $integrations[0];
            $newInteg->name = 'duplicate of ' . $newInteg->name;
            $saveStatus = $integrationHandler->save($newInteg->name, $newInteg->triggered_entity, $newInteg->triggered_entity_id, $newInteg->flow_details);

            if (is_wp_error($saveStatus)) {
                wp_send_json_error($saveStatus->get_error_message());
            }
            wp_send_json_success(['id' => $saveStatus, 'created_at' => $user_details['time']]);
        } else {
            wp_send_json_error(__('Flow ID is not exists', 'bit-integrations'));
        }
    }

    public function update($data)
    {
        $missing_field = null;
        if (empty($data->id)) {
            $missing_field = 'Integration id';
        }
        if (empty($data->flow_details)) {
            $missing_field = 'Flow details';
        }
        if (!is_null($missing_field)) {
            wp_send_json_error(sprintf(__('%s can\'t be empty', 'bit-integrations'), $missing_field));
        }

        if ($data->flow_details->type === 'CustomAction') {
            CustomFuncValidator::functionValidateHandler($data);
        }

        $name = !empty($data->name) ? $data->name : '';
        $integrationHandler = new FlowController();
        $updateStatus = $integrationHandler->update(
            $data->id,
            [
                'name' => $name,
                'triggered_entity' => $data->trigger,
                'triggered_entity_id' => $data->triggered_entity_id,
                'flow_details' => is_string($data->flow_details) ? $data->flow_details : wp_json_encode($data->flow_details),
            ]
        );
        if (is_wp_error($updateStatus) && $updateStatus->get_error_code() !== 'result_empty') {
            wp_send_json_error($updateStatus->get_error_message());
        }
        wp_send_json_success(__('Integration updated successfully', 'bit-integrations'));
    }

    public function delete($data)
    {
        $missing_field = null;
        if (empty($data->id)) {
            $missing_field = 'Integration id';
        }
        if (!is_null($missing_field)) {
            wp_send_json_error(sprintf(__('%s cann\'t be empty', 'bit-integrations'), $missing_field));
        }
        $integrationHandler = new FlowController();
        $deleteStatus = $integrationHandler->delete($data->id);
        if (is_wp_error($deleteStatus)) {
            wp_send_json_error($deleteStatus->get_error_message());
        }
        wp_send_json_success(__('Integration deleted successfully', 'bit-integrations'));
    }

    public function bulkDelete($param)
    {
        if (!is_array($param->flowID) || $param->flowID === []) {
            wp_send_json_error(sprintf(__('%s cann\'t be empty', 'bit-integrations'), 'Integration id'));
        }

        $integrationHandler = new FlowController();
        $deleteStatus = $integrationHandler->bulkDelete($param->flowID);

        if (is_wp_error($deleteStatus)) {
            wp_send_json_error($deleteStatus->get_error_message());
        }
        wp_send_json_success(__('Integration deleted successfully', 'bit-integrations'));
    }

    public function toggle_status($data)
    {
        $missing_field = null;
        if (!property_exists($data, 'status')) {
            $missing_field = 'status';
        }
        if (empty($data->id)) {
            $missing_field = 'Integration id';
        }
        if (!is_null($missing_field)) {
            wp_send_json_error(sprintf(__('%s cann\'t be empty', 'bit-integrations'), $missing_field));
        }
        $integrationHandler = new FlowController();
        $toggleStatus = $integrationHandler->updateStatus($data->id, $data->status);
        if (is_wp_error($toggleStatus)) {
            wp_send_json_error($toggleStatus->get_error_message());
        }
        wp_send_json_success(__('Status changed successfully', 'bit-integrations'));
    }

    /**
     * This function helps to execute Integration
     *
     * @param String $triggered_entity    Trigger name.
     * @param String $triggered_entity_id Entity(form) ID of Triggered app.
     *
     * @return boolean | Array Returns existings flows or false
     */
    public static function exists($triggered_entity, $triggered_entity_id = '')
    {
        $flowController = new FlowController();

        $conditions = [
            'triggered_entity' => $triggered_entity,
            'status' => 1,
        ];

        if (!empty($triggered_entity_id)) {
            $conditions['triggered_entity_id'] = $triggered_entity_id;
        }

        $flows = $flowController->get(
            $conditions,
            [
                'id',
                'triggered_entity_id',
                'flow_details',
            ]
        );
        if (is_wp_error($flows)) {
            return false;
        }
        return $flows;
    }

    /**
     * This function helps to execute Integration
     *
     * @param String $triggered_entity    Trigger name.
     * @param String $triggered_entity_id Entity(form) ID of Triggered app.
     * @param Array  $data                Values of submitted fields
     * @param Array  $flows               Existing Flows
     *
     * @return Array                  Nothing to return
     */
    public static function specialTagMappingValue($fieldMap)
    {
        $specialTagFieldValue = [];
        foreach ($fieldMap as $value) {
            if (isset($value->formField)) {
                $triggerValue = $value->formField;
                $smartTagValue = SmartTags::getSmartTagValue($triggerValue, true);
                if (!empty($smartTagValue)) {
                    $specialTagFieldValue[$value->formField] = $smartTagValue;
                }
            }
        }
        return $specialTagFieldValue;
    }

    public static function execute($triggered_entity, $triggered_entity_id, $data, $flows = [])
    {
        if (!is_wp_error($flows) && !empty($flows)) {
            $data['bit-integrator%trigger_data%'] = [
                'triggered_entity' => $triggered_entity,
                'triggered_entity_id' => $triggered_entity_id,
            ];
            foreach ($flows as $flowData) {
                if (is_string($flowData->flow_details)) {
                    $flowData->flow_details = json_decode($flowData->flow_details);
                }
                if (
                    property_exists($flowData->flow_details, 'condition')
                    && property_exists($flowData->flow_details->condition, 'logics')
                    && property_exists($flowData->flow_details->condition, 'action_behavior')
                    && $flowData->flow_details->condition->action_behavior
                    && !Common::checkCondition($flowData->flow_details->condition->logics, $data)
                ) {
                    // echo "status: " . !Common::checkCondition($flowData->flow_details->condition->logics, $data) . "<br>";
                    // print_r(json_encode($flowData->flow_details->condition->logics));

                    $error = new WP_Error('Conditional Logic False', __('Conditional Logic not matched', 'bit-integrations'));
                    if (isset($flowData->id)) {
                        LogHandler::save($flowData->id, 'Conditional Logic', 'validation', $error);
                    }

                    continue;
                }
                $integrationName = is_null($flowData->flow_details->type) ? null : ucfirst(str_replace(' ', '', $flowData->flow_details->type));

                switch ($integrationName) {
                    case 'Brevo(Sendinblue)':
                        $integrationName = 'SendinBlue';
                        break;
                    case 'Make(Integromat)':
                        $integrationName = 'Integromat';
                        break;
                    case 'Sarbacane(Mailify)':
                        $integrationName = 'Mailify';
                        break;
                    case 'Zoho Marketing Automation(Zoho Marketing Hub)':
                    case 'ZohoMarketingAutomation(ZohoMarketingHub)':
                        $integrationName = 'ZohoMarketingHub';
                        break;

                    default:
                        $integrationName = $integrationName;
                        break;
                }

                if (!is_null($integrationName) && $integration = static::isActionExists($integrationName)) {
                    $handler = new $integration($flowData->id);
                    if (isset($flowData->flow_details->field_map)) {
                        $sptagData = self::specialTagMappingValue($flowData->flow_details->field_map);
                        // $data = array_merge($data, $sptagData);
                        $data = $data + $sptagData;
                    }
                    $handler->execute($flowData, $data);
                }
            }
        }
    }
}
