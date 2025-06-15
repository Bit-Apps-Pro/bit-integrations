<?php

namespace BitCode\FI\Triggers\Tripetto;

use BitCode\FI\Flow\Flow;

final class TripettoController
{
    public static $allIndividualFormFields = [];

    public static function info()
    {
        $plugin_path = 'tripetto/tripetto.php';
        return [
            'name' => 'Tripetto',
            'title' => 'Tired of boring and ugly forms in your WordPress site?
            Use the Tripetto form builder to make your forms conversational!',
            'slug' => $plugin_path,
            'pro' => '',
            'type' => 'form',
            'is_active' => self::isTripettoActive(),
            'activation_url' => wp_nonce_url(self_admin_url('plugins.php?action=activate&amp;plugin=' . $plugin_path . '&amp;plugin_status=all&amp;paged=1&amp;s'), 'activate-plugin_' . $plugin_path),
            'install_url' => wp_nonce_url(self_admin_url('update.php?action=install-plugin&plugin=' . $plugin_path), 'install-plugin_' . $plugin_path),
            'list' => [
                'action' => 'tripetto/get',
                'method' => 'get',
            ],
            'fields' => [
                'action' => 'tripetto/get/form',
                'method' => 'post',
                'data' => ['id']
            ],
        ];
    }

    public static function isTripettoActive()
    {
        if (is_plugin_active('tripetto/plugin.php') || is_plugin_active('tripetto-pro/plugin.php')) {
            return true;
        }
        return false;
    }

    public function getAll()
    {
        if (!self::isTripettoActive()) {
            wp_send_json_error(__('Tripetto is not installed or activated', 'bit-integrations'));
        }

        $forms = self::isTripettoForm();

        $all_forms = [];
        if ($forms) {
            foreach ($forms as $form) {
                $all_forms[] = (object)[
                    'id' => $form->id,
                    'title' => $form->name,
                ];
            }
        }
        wp_send_json_success($all_forms);
    }

    public function get_a_form($data)
    {
        if (!self::isTripettoActive()) {
            wp_send_json_error(__('Tripetto is not installed or activated', 'bit-integrations'));
        }
        if (empty($data->id)) {
            wp_send_json_error(__('Form doesn\'t exists', 'bit-integrations'));
        }
        $fields = self::fields($data->id);
        if (empty($fields)) {
            wp_send_json_error(__('Form doesn\'t exists any field', 'bit-integrations'));
        }

        $responseData['fields'] = $fields;
        wp_send_json_success($responseData);
    }

    public static function fields($form_id)
    {
        $fields = [];

        $formFields = self::getAllFormFields($form_id);

        foreach ($formFields as $field) {
            $fields[] = [
                'name' => $field->id,
                'type' => $field->type,
                'label' => $field->name,
            ];
        }

        return $fields;
    }

    public static function isTripettoForm()
    {
        global $wpdb;
        return $wpdb->get_results($wpdb->prepare("SELECT id, name FROM {$wpdb->prefix}tripetto_forms"));
    }

    public static function getAllFormFields($form_id)
    {
        global $wpdb;
        $data = $wpdb->get_results($wpdb->prepare("SELECT definition FROM {$wpdb->prefix}tripetto_forms WHERE id = %d", $form_id));

        $data = json_decode($data[0]->definition);

        if (isset($data->clusters)) {
            $clusterData = $data->clusters;
            foreach ($clusterData as $singleCluster) {
                self::getAllDripperFormFields($singleCluster);
            }
        } else {
            $sectionData = $data->sections;
            foreach ($sectionData as $singleSection) {
                self::getAllSectionFormFields($singleSection);
            }
        }

        return self::$allIndividualFormFields;
    }

    public static function getAllDripperFormFields($clusterData)
    {
        foreach ($clusterData as $key => $cluster) {
            if ($key === 'nodes') {
                foreach ($cluster as $field) {
                    self::$allIndividualFormFields[] = (object)[
                        'id' => $field->id,
                        'name' => $field->name,
                        'type' => $field->slots[0]->type ? $field->slots[0]->type : 'text',
                    ];
                }
            }
            if ($key === 'branches') {
                foreach ($cluster[0]->clusters as $innerClusters) {
                    self::getAllDripperFormFields($innerClusters);
                }
            }
        }
    }
    public static function getAllSectionFormFields($sectionData)
    {
        foreach ($sectionData as $key => $section) {
            if ($key === 'nodes') {
                foreach ($section as $field) {
                    self::$allIndividualFormFields[] = (object)[
                        'id' => $field->id,
                        'name' => $field->name,
                        'type' => $field->slots[0]->type ? $field->slots[0]->type : 'text',
                    ];
                }
            }
            if ($key === 'branches') {
                foreach ($section[0]->sections as $innerSections) {
                    self::getAllSectionFormFields($innerSections);
                }
            }
        }
    }

    public static function uploadFilePath($reference)
    {
        global $wpdb;
        $data = $wpdb->get_results($wpdb->prepare("SELECT path FROM {$wpdb->prefix}tripetto_attachments WHERE reference = %s", $reference));
        return $data[0]->path;
    }

    public static function handleTripettoSubmit($dataset, $form)
    {
        $form_id = $form->id;
        $flows = Flow::exists('Tripetto', $form_id);
        if (empty($flows)) {
            return;
        }

        $finalData = [];
        $fieldsData = $dataset->fields;
        foreach ($fieldsData as $field) {
            if ($field->type === 'tripetto-block-file-upload') {
                $finalData[$field->node->id] = self::uploadFilePath($field->reference) . '/' . "$field->reference";
            } else {
                $finalData[$field->node->id] = $field->value;
            }
        }
        if (!empty($finalData)) {
            Flow::execute('Tripetto', $form_id, $finalData, $flows);
        }
    }
}
