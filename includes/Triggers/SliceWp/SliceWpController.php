<?php
namespace BitCode\FI\Triggers\SliceWp;

use BitCode\FI\Flow\Flow;

final class SliceWpController
{
    public static function info()
    {
        $plugin_path = self::pluginActive('get_name');
        return [
            'name' => 'SliceWP',
            'title' => 'SliceWP provides you an intuitive way to connect to your existing eCommerce WordPress plugin, onboard affiliates, learn from real-time reports and easily manage your affiliate program directly from your WordPress dashboard.',
            'slug' => $plugin_path,
            'pro' => $plugin_path,
            'type' => 'form',
            'is_active' => is_plugin_active($plugin_path),
            'activation_url' => wp_nonce_url(self_admin_url('plugins.php?action=activate&amp;plugin=' . $plugin_path . '&amp;plugin_status=all&amp;paged=1&amp;s'), 'activate-plugin_' . $plugin_path),
            'install_url' => wp_nonce_url(self_admin_url('update.php?action=install-plugin&plugin=' . $plugin_path), 'install-plugin_' . $plugin_path),
            'list' => [
                'action' => 'slicewp/get',
                'method' => 'get',
            ],
            'fields' => [
                'action' => 'slicewp/get/form',
                'method' => 'post',
                'data' => ['id']
            ],
        ];
    }

    public static function pluginActive($option = null)
    {
        if (is_plugin_active('slicewp/index.php')) {
            return $option === 'get_name' ? 'slicewp/index.php' : true;
        }
        return false;
    }

    public function getAll()
    {
        if (!self::pluginActive()) {
            wp_send_json_error(__('SliceWp affiliate is not installed or activated', 'bit-integrations'));
        }

        $types = ['User becomes an affiliate', 'User earns a commission'];

        $affiliate_action = [];
        foreach ($types as $index => $type) {
            $affiliate_action[] = (object)[
                'id' => $index + 1,
                'title' => $type,
            ];
        }
        wp_send_json_success($affiliate_action);
    }

    public function get_a_form($data)
    {
        if (!self::pluginActive()) {
            wp_send_json_error(__('SliceWp affiliate is not installed or activated', 'bit-integrations'));
        }
        if (empty($data->id)) {
            wp_send_json_error(__('Trigger type doesn\'t exists', 'bit-integrations'));
        }
        $fields = self::fields($data->id);

        if (empty($fields)) {
            wp_send_json_error(__('Trigger doesn\'t exists any field', 'bit-integrations'));
        }

        if ($data->id === '2') {
            $commissionType = self::commissionType();
            $responseData['AllCommissionType'] = $commissionType;
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

        if ($id === '1') {
            $sliceWpNewAffiliateFields = SliceWpHelper::getSliceWpNewAffiliateField();
            $userFields = SliceWpHelper::getUserField();
            $fields = array_merge($sliceWpNewAffiliateFields, $userFields);
        } if ($id === '2') {
            $fields = SliceWpHelper::getCommissionField();
        }

        foreach ($fields as $field) {
            $fieldsNew[] = [
                'name' => $field->fieldKey,
                'type' => 'text',
                'label' => $field->fieldName,
            ];
        }
        return $fieldsNew;
    }

    public static function commissionType()
    {
        foreach (slicewp_get_commission_types() as $type_id => $type) {
            $commissionTypes[] = [
                'type_id' => $type_id,
                'type_label' => $type['label'],
            ];
        }

        $commissionTypes = array_merge($commissionTypes, [['type_id' => 'any', 'type_label' => 'Any']]);
        return $commissionTypes;
    }

    public static function newAffiliateCreated($affiliate_id, $affiliate_data)
    {
        $userData = self::getUserInfo($affiliate_data['user_id']);
        $finalData = $affiliate_data + $userData + ['affiliate_id' => $affiliate_id];

        $flows = Flow::exists('SliceWp', 1);

        if (!$affiliate_data['user_id'] || !$flows) {
            return;
        }
        Flow::execute('SliceWp', 1, $finalData, $flows);
    }

    public static function userEarnCommission($commission_id, $commission_data)
    {
        $finalData = $commission_data + ['commission_id' => $commission_id];
        $flows = Flow::exists('SliceWp', 2);

        $flowDetails = json_decode($flows[0]->flow_details);
        $selectedCommissionType = !empty($flowDetails->selectedCommissionType) ? $flowDetails->selectedCommissionType : [];

        if ($flows && ($commission_data['type'] == $selectedCommissionType || $selectedCommissionType === 'any')) {
            Flow::execute('SliceWp', 2, $finalData, $flows);
        }
    }

    public static function getUserInfo($user_id)
    {
        $userInfo = get_userdata($user_id);
        $user = [];
        if ($userInfo) {
            $userData = $userInfo->data;
            $user_meta = get_user_meta($user_id);
            $user = [
                'user_id' => $user_id,
                'first_name' => $user_meta['first_name'][0],
                'last_name' => $user_meta['last_name'][0],
                'user_email' => $userData->user_email,
                'nickname' => $userData->user_nicename,
                'avatar_url' => get_avatar_url($user_id),
            ];
        }
        return $user;
    }

    public static function all_commission_type()
    {
        $commissionType = self::commissionType();
        wp_send_json_success($commissionType);
    }
}
