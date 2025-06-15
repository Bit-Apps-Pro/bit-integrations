<?php

namespace BitCode\FI\Triggers\Groundhogg;

use BitCode\FI\Flow\Flow;
use Groundhogg\DB\Tags;

final class GroundhoggController
{
    public static function info()
    {
        $plugin_path = self::pluginActive('get_name');
        return [
            'name' => 'Groundhogg',
            'title' => 'Groundhogg is the platform web creators choose to build professional WordPress websites, grow their skills, and build their business. Start for free today!',
            'slug' => $plugin_path,
            'pro' => $plugin_path,
            'type' => 'form',
            'is_active' => is_plugin_active($plugin_path),
            'activation_url' => wp_nonce_url(self_admin_url('plugins.php?action=activate&amp;plugin=' . $plugin_path . '&amp;plugin_status=all&amp;paged=1&amp;s'), 'activate-plugin_' . $plugin_path),
            'install_url' => wp_nonce_url(self_admin_url('update.php?action=install-plugin&plugin=' . $plugin_path), 'install-plugin_' . $plugin_path),
            'list' => [
                'action' => 'groundhogg/get',
                'method' => 'get',
            ],
            'fields' => [
                'action' => 'groundhogg/get/form',
                'method' => 'post',
                'data' => ['id']
            ],
        ];
    }

    public static function pluginActive($option = null)
    {
        if (is_plugin_active('groundhogg/groundhogg.php')) {
            return $option === 'get_name' ? 'groundhogg/groundhogg.php' : true;
        } elseif (is_plugin_active('groundhogg/groundhogg.php')) {
            return $option === 'get_name' ? 'groundhogg/groundhogg.php' : true;
        } else {
            return false;
        }
    }

    protected static function setTagNames($tag_ids)
    {
        $tags       = new Tags();
        $tag_list   = [];
        foreach ($tag_ids as $tag_id) {
            $tag_list[] = $tags->get_tag($tag_id)->tag_name;
        }
        return implode(',', $tag_list);
    }

    public static function handle_groundhogg_submit($a, $fieldValues)
    {
        global $wp_rest_server;
        $form_id    = 1;
        $request    = $wp_rest_server->get_raw_data();
        $data       = json_decode($request);
        $meta       = $data->meta;

        $fieldValues['primary_phone']   = $meta->primary_phone;
        $fieldValues['mobile_phone']    = $meta->mobile_phone;

        if (isset($data->tags)) {
            $fieldValues['tags'] = self::setTagNames($data->tags);
        }

        $flows = Flow::exists('Groundhogg', $form_id);
        if (!$flows) {
            return;
        }

        $data = $fieldValues;
        Flow::execute('Groundhogg', $form_id, $data, $flows);
    }

    public static function tagApplied($a, $b)
    {
        $data           = $a['data'];
        $form_id        = 2;
        $flows          = Flow::exists('Groundhogg', $form_id);
        $getSelected    = $flows[0]->flow_details;
        $enCode         = json_decode($getSelected);

        if (isset($a['tags'])) {
            $data['tags'] = self::setTagNames($a['tags']);
        }
        if (!$flows) {
            return;
        }

        if ($enCode->selectedTag == $b || $enCode->selectedTag == 'any') {
            Flow::execute('Groundhogg', $form_id, $data, $flows);
        }

        return;
    }

    public static function tagRemove($a, $b)
    {
        $data           = $a['data'];
        $form_id        = 3;
        $flows          = Flow::exists('Groundhogg', $form_id);
        $getSelected    = $flows[0]->flow_details;
        $enCode         = json_decode($getSelected);

        if (isset($a['tags'])) {
            $data['tags'] = self::setTagNames($a['tags']);
        }
        if (!$flows) {
            return;
        }

        if ($enCode->selectedTag == $b || $enCode->selectedTag == 'any') {
            Flow::execute('Groundhogg', $form_id, $data, $flows);
        }

        return;
    }

    public function getAll()
    {
        if (!self::pluginActive()) {
            wp_send_json_error(__('Groundhogg is not installed or activated', 'bit-integrations'));
        }
        $types = ['Contact-Create', 'Add-Tag-To-Contact', 'Remove-Tag-From-Contact'];
        $groundhogg_action = [];
        foreach ($types as $index => $type) {
            $groundhogg_action[] = (object)[
                'id' => $index + 1,
                'title' => $type,
            ];
        }

        wp_send_json_success($groundhogg_action);
    }

    public function getFormFields($data)
    {
        if (!self::pluginActive()) {
            wp_send_json_error(__('Groundhogg is not installed or activated', 'bit-integrations'));
        }
        if (empty($data->id)) {
            wp_send_json_error(__(' Doesn\'t exists', 'bit-integrations'));
        }
        $id = $data->id;
        if ($id == 2 || $id == 3) {
            $tags = new Tags();

            $allTag = [];

            $allTag[] = [
                'tag_id' => 'any',
                'tag_name' => 'Any Tag',
            ];

            foreach ($tags->get_tags() as $val) {
                $allTag[] = [
                    'tag_id' => $val->tag_id,
                    'tag_name' => $val->tag_name,
                ];
            }
            $responseData['allTag'] = $allTag;
        }

        $fields = self::fields($data->id);
        if (empty($fields)) {
            wp_send_json_error(__('Doesn\'t exists any field', 'bit-integrations'));
        }

        $responseData['fields'] = $fields;
        wp_send_json_success($responseData);
    }

    public static function fields($id)
    {
        if (empty($id)) {
            wp_send_json_error(
                __(
                    'Requested parameter is empty',
                    'bit-integrations'
                ),
                400
            );
        }

        $fields = [
            'First Name' => (object) [
                'fieldKey' => 'first_name',
                'fieldName' => 'First Name'
            ],
            'Last Name' => (object) [
                'fieldKey' => 'last_name',
                'fieldName' => 'Last Name'
            ],
            'Email' => (object) [
                'fieldKey' => 'email',
                'fieldName' => 'Email',
            ],
            'Primary Phone' => (object) [
                'fieldKey' => 'primary_phone',
                'fieldName' => 'Primary Phone',
            ],
            'Mobile Phone' => (object) [
                'fieldKey' => 'mobile_phone',
                'fieldName' => 'Mobile Phone',
            ],
            'Owner Id' => (object) [
                'fieldKey' => 'owner_id',
                'fieldName' => 'Owner Id',
            ],
            'Optin Status' => (object) [
                'fieldKey' => 'optin_status',
                'fieldName' => 'Optin Status'
            ],
            'Tags' => (object) [
                'fieldKey' => 'tags',
                'fieldName' => 'Tags'
            ],
        ];

        $fieldsNew = [];

        foreach ($fields as $field) {
            $fieldsNew[] = [
                'name' => $field->fieldKey,
                'type' => 'text',
                'label' => $field->fieldName,
            ];
        }
        return $fieldsNew;
    }

    public static function getAllFormsFromPostMeta($postMeta)
    {
        $forms = [];
        foreach ($postMeta as $widget) {
            foreach ($widget->elements as $elements) {
                foreach ($elements->elements as $element) {
                    if (isset($element->widgetType) && $element->widgetType == 'form') {
                        $forms[] = $element;
                    }
                }
            }
        }
        return $forms;
    }

    public static function getAllTags()
    {
        $tags = new Tags();
        $allTag = [];
        $allTag[] = [
            'tag_id' => 'any',
            'tag_name' => 'Any Tag',
        ];

        foreach ($tags->get_tags() as $val) {
            $allTag[] = [
                'tag_id' => $val->tag_id,
                'tag_name' => $val->tag_name,
            ];
        }
        wp_send_json_success($allTag);
    }
}
