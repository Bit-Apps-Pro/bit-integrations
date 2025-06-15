<?php
namespace BitCode\FI\Triggers\GiveWp;

use BitCode\FI\Flow\Flow;

final class GiveWpController
{
    public static function info()
    {
        $plugin_path = self::pluginActive('get_name');
        return [
            'name' => 'GiveWP',
            'title' => 'Easily create donation pages using the most powerful WordPress donation plugin. GiveWP provides you with an intuitive way to accept donations online through your own WordPress site with a variety of payment methods available in multiple countries.',
            'slug' => $plugin_path,
            'pro' => $plugin_path,
            'type' => 'form',
            'is_active' => is_plugin_active($plugin_path),
            'activation_url' => wp_nonce_url(self_admin_url('plugins.php?action=activate&amp;plugin=' . $plugin_path . '&amp;plugin_status=all&amp;paged=1&amp;s'), 'activate-plugin_' . $plugin_path),
            'install_url' => wp_nonce_url(self_admin_url('update.php?action=install-plugin&plugin=' . $plugin_path), 'install-plugin_' . $plugin_path),
            'list' => [
                'action' => 'givewp/get',
                'method' => 'get',
            ],
            'fields' => [
                'action' => 'givewp/get/form',
                'method' => 'post',
                'data' => ['id']
            ],
        ];
    }

    public static function pluginActive($option = null)
    {
        if (is_plugin_active('give/give.php')) {
            return $option === 'get_name' ? 'give/give.php' : true;
        }
        return false;
    }

    public function getAll()
    {
        if (!self::pluginActive()) {
            wp_send_json_error(__('GiveWp is not installed or activated', 'bit-integrations'));
        }

        $types = ['A user makes donation via form', 'A user cancels a recurring donation via form', 'User continues recurring donation'];

        $give_action = [];
        foreach ($types as $index => $type) {
            $give_action[] = (object)[
                'id' => $index + 1,
                'title' => $type,
            ];
        }
        wp_send_json_success($give_action);
    }

    public function get_a_form($data)
    {
        if (!self::pluginActive()) {
            wp_send_json_error(__('GiveWp is not installed or activated', 'bit-integrations'));
        }
        if (empty($data->id)) {
            wp_send_json_error(__('Trigger type doesn\'t exists', 'bit-integrations'));
        }
        $fields = self::fields($data->id);

        if (empty($fields)) {
            wp_send_json_error(__('Trigger doesn\'t exists any field', 'bit-integrations'));
        }

        if ($data->id === '1') {
            $donationFrom = self::donationForm();
            $responseData['allDonationForms'] = array_merge([['ID' => 'any', 'post_title' => 'Any Donation Form']], $donationFrom);
        } elseif ($data->id === '2') {
            $responseData['allRecurringForms'] = GiveWpHelper::getAllRecurringData();
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

        $fields = GiveWpHelper::getGiveWpField($id);

        foreach ($fields as $field) {
            $fieldsNew[] = [
                'name' => $field->fieldKey,
                'type' => 'text',
                'label' => $field->fieldName,
            ];
        }
        return $fieldsNew;
    }

    public static function donationForm()
    {
        global $wpdb;
        $table_name = $wpdb->prefix . 'posts';
        $donationForm = $wpdb->get_results("SELECT ID, post_title FROM $table_name WHERE post_type = 'give_forms' AND post_status = 'publish'");
        return $donationForm;
    }

    public static function handleUserDonation($payment_id, $status, $old_status)
    {
        $flows = Flow::exists('GiveWp', 1);
        if (!$flows) {
            return;
        }

        if ('publish' !== $status) {
            return;
        }

        $payment = new \Give_Payment($payment_id);

        if (empty($payment)) {
            return;
        }
        $payment_exists = $payment->ID;
        if (empty($payment_exists)) {
            return;
        }

        $give_form_id = $payment->form_id;
        $user_id = $payment->user_id;

        if (0 === $user_id) {
            return;
        }

        $finalData = json_decode(wp_json_encode($payment), true);

        $donarUserInfo = give_get_payment_meta_user_info($payment_id);
        if ($donarUserInfo) {
            $finalData['title'] = $donarUserInfo['title'];
            $finalData['first_name'] = $donarUserInfo['first_name'];
            $finalData['last_name'] = $donarUserInfo['last_name'];
            $finalData['email'] = $donarUserInfo['email'];
            $finalData['address1'] = $donarUserInfo['address']['line1'];
            $finalData['address2'] = $donarUserInfo['address']['line2'];
            $finalData['city'] = $donarUserInfo['address']['city'];
            $finalData['state'] = $donarUserInfo['address']['state'];
            $finalData['zip'] = $donarUserInfo['address']['zip'];
            $finalData['country'] = $donarUserInfo['address']['country'];
            $finalData['donar_id'] = $donarUserInfo['donor_id'];
        }

        $finalData['give_form_id'] = $give_form_id;
        $finalData['give_form_title'] = $payment->form_title;
        $finalData['currency'] = $payment->currency;
        $finalData['give_price_id'] = $payment->price_id;
        $finalData['price'] = $payment->total;

        $flowDetails = json_decode($flows[0]->flow_details);
        $selectedDonationForm = !empty($flowDetails->selectedDonationForm) ? $flowDetails->selectedDonationForm : [];
        if ($flows && $give_form_id === $selectedDonationForm || $selectedDonationForm === 'any') {
            Flow::execute('GiveWp', 1, $finalData, $flows);
        }
    }

    public static function handleSubscriptionDonationCancel($subscription_id, $subscription)
    {
        $flows = Flow::exists('GiveWp', 2);
        if (!$flows) {
            return;
        }

        $give_form_id = $subscription->form_id;
        $amount = $subscription->recurring_amount;
        $donor = $subscription->donor;
        $user_id = $donor->user_id;
        $getUserData = GiveWpHelper::getUserInfo($user_id);
        $finalData = [
            'subscription_id' => $subscription_id,
            'give_form_id' => $give_form_id,
            'amount' => $amount,
            'donor' => $donor,
            'user_id' => $user_id,
            'first_name' => $getUserData['first_name'],
            'last_name' => $getUserData['last_name'],
            'user_email' => $getUserData['email'],
            'nickname' => $getUserData['nickname'],
            'avatar_url' => $getUserData['avatar_url'],
        ];

        if (0 === $user_id) {
            return;
        }

        $flowDetails = json_decode($flows[0]->flow_details);
        $selectedRecurringDonationForm = !empty($flowDetails->selectedRecurringDonationForm) ? $flowDetails->selectedRecurringDonationForm : '';
        if ($flows && !empty($selectedRecurringDonationForm) && $give_form_id === $selectedRecurringDonationForm) {
            Flow::execute('GiveWp', 2, $finalData, $flows);
        }
    }

    public static function handleRecurringDonation($status, $row_id, $data, $where)
    {
        $flows = Flow::exists('GiveWp', 3);
        if (!$flows) {
            return;
        }

        $subscription = new \Give_Subscription($row_id);
        $recurring_amount = $subscription->recurring_amount;
        $give_form_id = $subscription->form_id;

        $total_payment = $subscription->get_total_payments();
        $donor = $subscription->donor;
        $user_id = $donor->user_id;

        if (0 === absint($user_id)) {
            return;
        }

        if ($total_payment > 1 && 'active' === (string) $data['status']) {
            $user = GiveWpHelper::getUserInfo($user_id);
            $finalData = [
                'give_form_id' => $give_form_id,
                'recurring_amount' => $recurring_amount,
                'total_payment' => $total_payment,
                'donor' => $donor,
                'user_id' => $user_id,
                'first_name' => $user['first_name'],
                'last_name' => $user['last_name'],
                'user_email' => $user['user_email'],
                'nickname' => $user['nickname'],
                'avatar_url' => $user['avatar_url'],
            ];
        }

        Flow::execute('GiveWp', 3, $finalData, $flows);
    }

    public static function all_donation_form()
    {
        $allDonationForm = self::donationForm();
        wp_send_json_success($allDonationForm);
    }
}
