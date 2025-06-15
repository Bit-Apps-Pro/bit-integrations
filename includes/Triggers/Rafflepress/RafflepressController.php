<?php
namespace BitCode\FI\Triggers\Rafflepress;

use BitCode\FI\Flow\Flow;

final class RafflepressController
{
    public static function info()
    {
        $plugin_path = self::pluginActive('get_name');
        return [
            'name' => 'Rafflepress',
            'title' => 'RafflePress is the best WordPress giveaway and contest plugin. It comes with proven giveaway templates, viral sharing, marketing integrations, and more.',
            'slug' => $plugin_path,
            'pro' => $plugin_path,
            'type' => 'form',
            'is_active' => is_plugin_active($plugin_path),
            'activation_url' => wp_nonce_url(self_admin_url('plugins.php?action=activate&amp;plugin=' . $plugin_path . '&amp;plugin_status=all&amp;paged=1&amp;s'), 'activate-plugin_' . $plugin_path),
            'install_url' => wp_nonce_url(self_admin_url('update.php?action=install-plugin&plugin=' . $plugin_path), 'install-plugin_' . $plugin_path),
            'list' => [
                'action' => 'rafflepress/get',
                'method' => 'get',
            ],
            'fields' => [
                'action' => 'rafflepress/get/form',
                'method' => 'post',
                'data' => ['id']
            ],
        ];
    }

    public static function pluginActive($option = null)
    {
        if (is_plugin_active('rafflepress/rafflepress.php')) {
            return $option === 'get_name' ? 'rafflepress/rafflepress.php' : true;
        } elseif (is_plugin_active('rafflepress-pro/rafflepress-pro.php')) {
            return $option === 'get_name' ? 'rafflepress-pro/rafflepress-pro.php' : true;
        }
        return false;
    }

    public function getAll()
    {
        if (!self::pluginActive()) {
            wp_send_json_error(__('Rafflepress is not installed or activated', 'bit-integrations'));
        }

        $types = ['User login giveaway'];

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
            wp_send_json_error(__('Rafflepress is not installed or activated', 'bit-integrations'));
        }
        if (empty($data->id)) {
            wp_send_json_error(__('Trigger type doesn\'t exists', 'bit-integrations'));
        }
        $fields = self::fields($data->id);

        if (empty($fields)) {
            wp_send_json_error(__('Trigger doesn\'t exists any field', 'bit-integrations'));
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
            $fields = RafflepressHelper::getRafflepressField();
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

    public static function newPersonEntry($giveaway_details)
    {
        if (!self::pluginActive()) {
            return;
        }

        $giveaway_id = $giveaway_details['giveaway_id'];
        $giveaway_name = $giveaway_details['giveaway']->name;
        $starts = $giveaway_details['giveaway']->starts;
        $ends = $giveaway_details['giveaway']->ends;
        $active = $giveaway_details['giveaway']->active;
        $name = $giveaway_details['name'];
        $first_name = $giveaway_details['first_name'];
        $last_name = $giveaway_details['last_name'];
        $email = $giveaway_details['email'];
        $prize_name = $giveaway_details['settings']->prizes[0]->name;
        $prize_description = $giveaway_details['settings']->prizes[0]->description;
        $prize_image = $giveaway_details['settings']->prizes[0]->image;

        $finalData = [
            'giveaway_id' => $giveaway_id,
            'giveaway_name' => $giveaway_name,
            'starts' => $starts,
            'ends' => $ends,
            'active' => $active,
            'name' => $name,
            'first_name' => $first_name,
            'last_name' => $last_name,
            'email' => $email,
            'prize_name' => $prize_name,
            'prize_description' => $prize_description,
            'prize_image' => $prize_image,
        ];
        $flows = Flow::exists('Rafflepress', 1);
        if (!$flows) {
            return;
        }

        flow::execute('Rafflepress', 1, $finalData, $flows);
    }
}
