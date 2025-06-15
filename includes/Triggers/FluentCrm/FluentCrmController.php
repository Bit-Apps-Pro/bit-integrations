<?php

namespace BitCode\FI\Triggers\FluentCrm;

use DateTime;
use BitCode\FI\Flow\Flow;
use FluentCrm\App\Models\Tag;
use FluentCrm\App\Models\Lists;
use BitCode\FI\Core\Util\Common;
use BitCode\FI\Flow\FlowController;
use FluentCrm\App\Models\Subscriber;
use FluentCrm\App\Models\CustomContactField;

final class FluentCrmController
{
    public static function info()
    {
        $plugin_path = 'fluent-crm/fluent-crm.php';
        return [
            'name' => 'Fluent CRM',
            'title' => 'Fluent CRM - FluentCRM is a Self Hosted Email Marketing Automation Plugin for WordPress',
            'slug' => $plugin_path,
            'pro'  => 'fluent-crm/fluent-crm.php',
            'type' => 'form',
            'is_active' => is_plugin_active('fluent-crm/fluent-crm.php'),
            'activation_url' => wp_nonce_url(self_admin_url('plugins.php?action=activate&amp;plugin=' . $plugin_path . '&amp;plugin_status=all&amp;paged=1&amp;s'), 'activate-plugin_' . $plugin_path),
            'install_url' => wp_nonce_url(self_admin_url('update.php?action=install-plugin&plugin=' . $plugin_path), 'install-plugin_' . $plugin_path),
            'list' => [
                'action' => 'fluentcrm/get',
                'method' => 'get',
            ],
            'fields' => [
                'action' => 'fluentcrm/get/form',
                'method' => 'post',
                'data' => ['id']
            ],
        ];
    }

    public static function checkedExistsFluentCRM()
    {
        if (!is_plugin_active('fluent-crm/fluent-crm.php')) {
            wp_send_json_error(
                __(
                    'Fluent CRM Plugin is not active or not installed',
                    'bit-integrations'
                ),
                400
            );
        } else {
            return true;
        }
    }

    public function getAll()
    {
        self::checkedExistsFluentCRM();

        $types = ["A tag is added to contact", "A tag is removed from contact", "A contact is added to a list", "A contact is remove from a list", "A contact set to a specific status", "A contact is create"];
        $fluentcrm_action = [];
        foreach ($types as $index => $type) {
            $fluentcrm_action[] = (object)[
                'id' => "fluentcrm-" . ($index + 1),
                'title' => $type,
            ];
        }
        wp_send_json_success($fluentcrm_action);
    }
    public function get_a_form($data)
    {
        self::checkedExistsFluentCRM();
        $fields = self::fields($data->id);

        if (empty($fields)) {
            wp_send_json_error(__('Trigger doesn\'t exists any field', 'bit-integrations'));
        }
        if ($data->id == "fluentcrm-1" || $data->id == 'fluentcrm-2') {
            $tags[] = [
                'tag_id' => "any",
                'tag_title' => "Any Tag",
            ];
            $fluentCrmTags = self::fluentCrmTags();

            $responseData['tags'] = array_merge($tags, $fluentCrmTags);
        } elseif ($data->id == "fluentcrm-3" || $data->id == 'fluentcrm-4') {
            $lists[] = [
                'list_id' => "any",
                'list_title' => "Any List",
            ];
            $fluentCrmLists = self::fluentCrmLists();

            $responseData['lists'] = array_merge($lists, $fluentCrmLists);
        } elseif ($data->id == "fluentcrm-5") {
            $status[] = [
                'status_id' => "any",
                'status_title' => "Any status",
            ];
            $fluentCrmStatus = self::fluentCrmStatus();

            $responseData['status'] = array_merge($status, $fluentCrmStatus);
        }



        $responseData['fields'] = $fields;
        wp_send_json_success($responseData);
    }

    public static function fluentCrmStatus()
    {
        $statuses = [
            "subscribed" => "Subscribed",
            "pending" => "Pending",
            "unsubscribed" => "Unsubscribed",
            "bounced" => "Bounced",
            "complained" => "Complained",
        ];
        $fluentCrmStatus = [];

        foreach ($statuses as $key => $status) {
            $fluentCrmStatus[] = [
                'status_id' => $key,
                'status_title' => $status
            ];
        }
        return $fluentCrmStatus;
    }

    public static function fluentCrmTags()
    {
        self::checkedExistsFluentCRM();
        $tags = Tag::get();

        $fluentCrmTags = [];
        foreach ($tags as $tag) {
            $fluentCrmTags[] = [
                'tag_id' => $tag->id,
                'tag_title' => $tag->title
            ];
        }
        return $fluentCrmTags;
    }

    public static function fluentCrmLists()
    {
        self::checkedExistsFluentCRM();
        $lists = Lists::get();

        $fluentCrmLists = [];
        foreach ($lists as $list) {
            $fluentCrmLists[] = [
                'list_id' => $list->id,
                'list_title' => $list->title
            ];
        }
        return $fluentCrmLists;
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

        $fieldsCommon = [
            'Tags' => (object) array(
                'fieldKey' => 'tags',
                'fieldName' => 'Tags',
                'required' => false,
            ),
            'Lists' => (object) array(
                'fieldKey' => 'lists',
                'fieldName' => 'Lists',
                'required' => false,
            ),
        ];

        if ($id === "fluentcrm-1") {
            $fields = [
                'Tag IDs' => (object) array(
                    'fieldKey' => 'tag_ids',
                    'fieldName' => 'Tag IDs',
                    'required' => false,
                ),
            ];
        } elseif ($id === "fluentcrm-2") {
            $fields = [
                'Removed Tag IDs' => (object) array(
                    'fieldKey' => 'removed_tag_ids',
                    'fieldName' => 'Removed Tag IDs',
                    'required' => false,
                ),
            ];
        } elseif ($id === "fluentcrm-3") {
            $fields = [
                'List IDs' => (object) array(
                    'fieldKey' => 'list_ids',
                    'fieldName' => 'List IDs',
                    'required' => false,
                ),
            ];
        } elseif ($id === "fluentcrm-4") {
            $fields = [
                'Remove List IDs' => (object) array(
                    'fieldKey' => 'remove_list_ids',
                    'fieldName' => 'Remove List IDs',
                    'required' => false,
                ),
            ];
        } elseif ($id === "fluentcrm-5") {
            $fields = [
                'Old Status' => (object) array(
                    'fieldKey' => 'old_status',
                    'fieldName' => 'Old Status',
                    'required' => false,
                ),
                'New Status' => (object) array(
                    'fieldKey' => 'new_status',
                    'fieldName' => 'New Status',
                    'required' => false,
                ),
            ];
        } elseif ($id === "fluentcrm-6") {
            $fields = [
                'Tags' => (object) array(
                    'fieldKey' => 'tags',
                    'fieldName' => 'Tags',
                    'required' => false,
                ),
                'Lists' => (object) array(
                    'fieldKey' => 'lists',
                    'fieldName' => 'Lists',
                    'required' => false,
                ),
            ];
            foreach ($fields as $field) {
                $fieldsNew[] = [
                    'name' => $field->fieldKey,
                    'type' => 'text',
                    'label' => $field->fieldName,
                ];
            }

            // $fields = $fieldsNew + self::fluentCrmFields();
            $fields = array_merge($fieldsNew, self::fluentCrmFields());
            return $fields;
        }

        $fields = $fields + $fieldsCommon;
        foreach ($fields as $field) {
            $fieldsNew[] = [
                'name' => $field->fieldKey,
                'type' => 'text',
                'label' => $field->fieldName,
            ];
        }


        $contactFields = self::fluentCrmFields();
        $fieldsNew = array_merge($fieldsNew, $contactFields);

        return $fieldsNew;
    }

    public static function fluentCrmFields()
    {
        self::checkedExistsFluentCRM();
        $fieldOptions = [];
        $primaryField = ['first_name', 'last_name', 'full_name', 'email'];

        foreach (Subscriber::mappables() as $key => $column) {
            if (in_array($key, $primaryField)) {
                if ($key === 'email') {
                    $fieldOptions[] = [
                        'name'     => $key,
                        'label'   => $column,
                        'type'    => 'primary',
                        'required' => true
                    ];
                } else {
                    $fieldOptions[] = [
                        'name'     => $key,
                        'label'   => $column,
                        'type'    => 'primary'
                    ];
                }
            } else {
                $fieldOptions[] = [
                    'name'       => $key,
                    'label'     => $column,
                    'type'      => 'custom'
                ];
            }
        }

        foreach ((new CustomContactField)->getGlobalFields()['fields'] as $field) {
            $fieldOptions[] = [
                'name'         => $field['slug'],
                'label'       => $field['label'],
                'type'        => 'custom'
            ];
        }
        return $fieldOptions;
    }

    public static function handle_add_tag($tag_ids, $subscriber)
    {
        $flows = Flow::exists('FluentCrm', 'fluentcrm-1');
        $flows = self::flowFilter($flows, 'selectedTag', $tag_ids);

        if (!$flows) {
            return;
        }

        $email = $subscriber->email;

        $data = [
            'tag_ids' => $tag_ids,
        ];

        $dataContact = self::getContactData($email);

        $data = $data + $dataContact;
        Flow::execute('FluentCrm', 'fluentcrm-1', $data, $flows);
    }

    // tag_ids = remove tag ids
    public static function handle_remove_tag($tag_ids, $subscriber)
    {
        $flows = Flow::exists('FluentCrm', 'fluentcrm-2');
        $flows = self::flowFilter($flows, 'selectedTag', $tag_ids);

        if (!$flows) {
            return;
        }

        $email = $subscriber->email;

        $data = [
            'removed_tag_ids' => $tag_ids,
        ];

        $dataContact = self::getContactData($email);

        $data = $data + $dataContact;

        Flow::execute('FluentCrm', 'fluentcrm-2', $data, $flows);
    }

    public static function handle_add_list($list_ids, $subscriber)
    {
        $flows = Flow::exists('FluentCrm', 'fluentcrm-3');
        $flows = self::flowFilter($flows, 'selectedList', $list_ids);

        if (!$flows) {
            return;
        }

        $email = $subscriber->email;

        $data = [
            'list_ids' => $list_ids,
        ];

        $dataContact = self::getContactData($email);

        $data = $data + $dataContact;

        Flow::execute('FluentCrm', 'fluentcrm-3', $data, $flows);
    }

    public static function handle_remove_list($list_ids, $subscriber)
    {
        $flows = Flow::exists('FluentCrm', 'fluentcrm-4');
        $flows = self::flowFilter($flows, 'selectedList', $list_ids);

        if (!$flows) {
            return;
        }

        $email = $subscriber->email;

        $data = [
            'remove_list_ids' => $list_ids,
        ];

        $dataContact = self::getContactData($email);

        $data = $data + $dataContact;
        Flow::execute('FluentCrm', 'fluentcrm-4', $data, $flows);
    }

    public static function handle_change_status($subscriber, $old_status)
    {
        $newStatus = [$subscriber->status];

        $flows = Flow::exists('FluentCrm', 'fluentcrm-5');
        $flows = self::flowFilter($flows, 'selectedStatus', $newStatus);

        $email = $subscriber->email;

        $data = [
            'old_status' => $old_status,
            'new_status' => $newStatus,
        ];

        $dataContact = self::getContactData($email);

        $data = $data + $dataContact;

        Flow::execute('FluentCrm', 'fluentcrm-5', $data, $flows);
    }

    public static function handle_contact_create($subscriber)
    {
        $flows = Flow::exists('FluentCrm', 'fluentcrm-6');
        if (!$flows) {
            return;
        }

        $email  = $subscriber->email;
        $data   = self::getContactData($email);

        Flow::execute('FluentCrm', 'fluentcrm-6', $data, $flows);
    }

    public static function getContactData($email)
    {
        $contactApi     = \FluentCrmApi('contacts');
        $contact        = $contactApi->getContact($email);
        $customFields   = $contact->custom_fields();

        $data = [
            "prefix" => $contact->prefix,
            "first_name" => $contact->first_name,
            "last_name" => $contact->last_name,
            "full_name" => $contact->full_name,
            "email" => $contact->email,
            "timezone" => $contact->timezone,
            "address_line_1" => $contact->address_line_1,
            "address_line_2" => $contact->address_line_2,
            "city" => $contact->city,
            "state" => $contact->state,
            "postal_code" => $contact->postal_code,
            "country" => $contact->country,
            "ip" => $contact->ip,
            "phone" => $contact->phone,
            "source" => $contact->source,
            "date_of_birth" => $contact->date_of_birth,
        ];

        if (!empty($customFields)) {
            foreach ($customFields as $key => $value) {
                $data[$key] = $value;
            }
        }
        $tags = $contact->tags;
        $fluentCrmTags = [];
        foreach ($tags as $tag) {
            $fluentCrmTags[] = (object) [
                'tag_id' => $tag->id,
                'tag_title' => $tag->title
            ];
        }

        $lists = $contact->lists;
        $fluentCrmLists = [];
        foreach ($lists as $list) {
            $fluentCrmLists[] = (object) [
                'list_id' => $list->id,
                'list_title' => $list->title
            ];
        }

        $data['tags'] = $fluentCrmTags;
        $data['lists'] = $fluentCrmLists;
        return $data;
    }

    protected static function flowFilter($flows, $key, $value)
    {
        $filteredFlows = [];
        if (is_array($flows) || is_object($flows)) {
            foreach ($flows as $flow) {
                if (is_string($flow->flow_details)) {
                    $flow->flow_details = json_decode($flow->flow_details);
                }
                if (!isset($flow->flow_details->$key) || $flow->flow_details->$key === 'any' || in_array($flow->flow_details->$key, $value) || $flow->flow_details->$key === '') {
                    $filteredFlows[] = $flow;
                }
            }
        }
        return $filteredFlows;
    }

    public static function getFluentCrmTags()
    {
        $tags[] = [
            'tag_id' => "any",
            'tag_title' => "Any Tag",
        ];
        $fluentCrmTags = self::fluentCrmTags();

        $tags = array_merge($tags, $fluentCrmTags);
        wp_send_json_success($tags);
    }

    public static function getFluentCrmList()
    {
        $lists[] = [
            'list_id' => "any",
            'list_title' => "Any List",
        ];
        $fluentCrmLists = self::fluentCrmLists();

        $lists = array_merge($lists, $fluentCrmLists);
        wp_send_json_success($lists);
    }

    public static function getFluentCrmStatus()
    {
        $status[] = [
            'status_id' => "any",
            'status_title' => "Any status",
        ];
        $fluentCrmStatus = self::fluentCrmStatus();

        $status = array_merge($status, $fluentCrmStatus);
        wp_send_json_success($status);
    }
}
