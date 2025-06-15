<?php

namespace BitCode\FI\Triggers\Breakdance;

use BitCode\FI\Flow\Flow;
use BitCode\FI\Core\Util\Helper;
use Breakdance\Forms\Actions\Action;

if (class_exists('Breakdance\Forms\Actions\Action')) {
    class BreakdanceAction extends Action
    {
        public static function name()
        {
            return 'Bit Integrations';
        }

        /**
         * @return string
         */
        public static function slug()
        {
            return 'bit-integrations-pro';
        }

        /**
         * @param FormData     $form
         * @param FormSettings $settings
         * @param FormExtra    $extra
         *
         * @return ActionSuccess|ActionError|array<array-key, ActionSuccess|ActionError>
         */
        public function run($form, $settings, $extra)
        {
            if (\function_exists('btcbi_pro_activate_plugin')) {
                return;
            }

            $reOrganizeId = "{$extra['formId']}-{$extra['postId']}";
            $formData = BreakdanceHelper::setFields($extra, $form);

            if (get_option('btcbi_breakdance_test') !== false) {
                update_option('btcbi_breakdance_test', [
                    'formData'   => $formData,
                    'primaryKey' => [(object) ['key' => 'formId', 'value' => $extra['formId']]]
                ]);
            }

            global $wpdb;
            $flows = $wpdb->get_results($wpdb->prepare(
                "SELECT * FROM {$wpdb->prefix}btcbi_flow 
                    WHERE status = true 
                    AND triggered_entity = 'Breakdance' 
                    AND (triggered_entity_id = 'BreakdanceHook' OR triggered_entity_id = %s)",
                $reOrganizeId
            ));

            if (!$flows) {
                return;
            }

            foreach ($flows as $flow) {
                $flowDetails = json_decode($flow->flow_details);

                if (!isset($flowDetails->primaryKey) && $flow->triggered_entity_id == $reOrganizeId) {
                    Flow::execute('Breakdance', $reOrganizeId, $extra['fields'], [$flow]);

                    continue;
                }

                if (!\is_array($flowDetails->primaryKey)) {
                    continue;
                }

                $isPrimaryKeysMatch = true;
                foreach ($flowDetails->primaryKey as $primaryKey) {
                    $primaryKeyValue = Helper::extractValueFromPath($extra, $primaryKey->key, 'Breakdance');

                    if ($primaryKey->value != $primaryKeyValue) {
                        $isPrimaryKeysMatch = false;

                        break;
                    }
                }

                if ($isPrimaryKeysMatch) {
                    $data = array_column($formData, 'value', 'name');
                    Flow::execute('Breakdance', 'BreakdanceHook', $data, [$flow]);
                }
            }

            return ['type' => 'success'];
        }
    }
}
