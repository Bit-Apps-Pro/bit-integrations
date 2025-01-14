<?php

/**
 * Fluent CRM Integration
 */

namespace BitCode\FI\Actions\FluentCommunity;

use FluentCommunity\App\Models\Company;

use FluentCommunity\App\Models\SpaceGroup;
// use FluentCommunity\App\Models\Lists;
// use FluentCommunity\App\Models\Subscriber;
// use FluentCommunity\App\Models\Tag;
use WP_Error;

/**
 * Provide functionality for ZohoCrm integration
 */
class FluentCommunityController
{
    private $_integrationID;

    public function __construct($integrationID)
    {
        $this->_integrationID = $integrationID;
    }

    /**
     * Fluent crm plugin is exists
     *
     * @return void
     */
    public static function checkedExistsFluentCRM()
    {
        // if (!is_plugin_active('fluent-crm/fluent-crm.php')) {
        //     wp_send_json_error(wp_sprintf(__('%s is not active or not installed', 'bit-integrations'), 'Fluent CRM'), 400);
        // } else {
        //     return true;
        // }
        $lists = SpaceGroup::get();
        $fluentCommunityList = [];
        foreach ($lists as $list) {
            $fluentCommunityList[$list->title] = (object) [
                'id'    => $list->id,
                'title' => $list->title
            ];
        }
        error_log(print_r('rahat yeasin', true));
        error_log(print_r($fluentCommunityList, true));

        return false;
    }

    /**
     * Fetch CRM lists
     *
     * @return Fluent CRM lists
     */
    public static function fluentCommunityLists()
    {
        self::checkedExistsFluentCRM();
        $lists = Lists::get();
        $fluentCommunityList = [];
        foreach ($lists as $list) {
            $fluentCommunityList[$list->title] = (object) [
                'id'    => $list->id,
                'title' => $list->title
            ];
        }
        $tags = Tag::get();
        $fluentCommunityTags = [];
        foreach ($tags as $tag) {
            $fluentCommunityTags[$tag->title] = (object) [
                'id'    => $tag->id,
                'title' => $tag->title
            ];
        }
        $response['fluentCommunityList'] = $fluentCommunityList;
        $response['fluentCommunityTags'] = $fluentCommunityTags;
        wp_send_json_success($response, 200);
    }

    public static function fluentCommunityTags()
    {
        self::checkedExistsFluentCRM();

        $tags = Tag::get();
        $fluentCommunityTags = [];
        foreach ($tags as $tag) {
            $fluentCommunityTags[$tag->title] = (object) [
                'id'    => $tag->id,
                'title' => $tag->title
            ];
        }
        $response['fluentCommunityTags'] = $fluentCommunityTags;
        wp_send_json_success($response, 200);
    }

    public static function getAllCompany()
    {
        self::checkedExistsFluentCRM();

        $settings = get_option('_fluentcrm_experimental_settings', []);

        if (empty($settings['company_module']) || $settings['company_module'] !== 'yes') {
            wp_send_json_success([], 200);
        }

        $companies = Company::paginate(500)->toArray();

        wp_send_json_success(array_map(function ($company) {
            return [
                'id'    => $company['id'],
                'label' => $company['name'],
            ];
        }, $companies['data']), 200);
    }

    public static function fluentCommunityFields()
    {
        self::checkedExistsFluentCRM();
        $fieldOptions = [];
        $primaryField = ['first_name', 'last_name', 'full_name', 'email'];

        foreach (Subscriber::mappables() as $key => $column) {
            if (\in_array($key, $primaryField)) {
                if ($key === 'email') {
                    $fieldOptions[$column] = (object) [
                        'key'      => $key,
                        'label'    => $column,
                        'type'     => 'primary',
                        'required' => true
                    ];
                } else {
                    $fieldOptions[$column] = (object) [
                        'key'   => $key,
                        'label' => $column,
                        'type'  => 'primary'
                    ];
                }
            } else {
                $fieldOptions[$column] = (object) [
                    'key'   => $key,
                    'label' => $column,
                    'type'  => 'custom'
                ];
            }
        }
        foreach ((new CustomContactField())->getGlobalFields()['fields'] as $field) {
            $fieldOptions[$field['label']] = (object) [
                'key'   => $field['slug'],
                'label' => $field['label'],
                'type'  => 'custom'
            ];
        }
        $response['fluentCommunityFlelds'] = $fieldOptions;
        wp_send_json_success($response, 200);
    }

    /**
     * @return true Fluent crm are exists
     */
    public static function fluentCommunityAuthorize()
    {
        if (self::checkedExistsFluentCRM()) {
            wp_send_json_success(true);
        } else {
            wp_send_json_error(
                __(
                    'Please! Install Fluent CRM',
                    'bit-integrations'
                ),
                400
            );
        }
    }

    public function execute($integrationData, $fieldValues)
    {
        $integrationDetails = $integrationData->flow_details;

        $fieldMap = $integrationDetails->field_map;
        $defaultDataConf = $integrationDetails->default;
        $list_id = isset($integrationDetails->list_id) ? $integrationDetails->list_id : null;
        $tags = $integrationDetails->tags;
        $actions = $integrationDetails->actions;
        $actionName = $integrationDetails->actionName;

        if (empty($fieldMap)) {
            return new WP_Error('REQ_FIELD_EMPTY', wp_sprintf(__('module, fields are required for %s api', 'bit-integrations'), 'Fluent CRM'));
        }

        $recordApiHelper = new RecordApiHelper($this->_integrationID);

        $fluentCommunityApiResponse = $recordApiHelper->execute(
            $fieldValues,
            $fieldMap,
            $actions,
            $list_id,
            $tags,
            $actionName
        );

        if (is_wp_error($fluentCommunityApiResponse)) {
            return $fluentCommunityApiResponse;
        }

        return $fluentCommunityApiResponse;
    }
}
