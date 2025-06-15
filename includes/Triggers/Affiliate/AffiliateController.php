<?php
namespace BitCode\FI\Triggers\Affiliate;

use BitCode\FI\Flow\Flow;

final class AffiliateController
{
    public static function info()
    {
        $plugin_path = self::pluginActive('get_name');
        return [
            'name' => 'Affiliate',
            'title' => 'Affiliate - WordPress membership plugin that allows you to monetize content access.',
            'slug' => $plugin_path,
            'pro' => $plugin_path,
            'type' => 'form',
            'is_active' => is_plugin_active($plugin_path),
            'activation_url' => wp_nonce_url(self_admin_url('plugins.php?action=activate&amp;plugin=' . $plugin_path . '&amp;plugin_status=all&amp;paged=1&amp;s'), 'activate-plugin_' . $plugin_path),
            'install_url' => wp_nonce_url(self_admin_url('update.php?action=install-plugin&plugin=' . $plugin_path), 'install-plugin_' . $plugin_path),
            'list' => [
                'action' => 'affiliate/get',
                'method' => 'get',
            ],
            'fields' => [
                'action' => 'affiliate/get/form',
                'method' => 'post',
                'data' => ['id']
            ],
        ];
    }

    public static function pluginActive($option = null)
    {
        if (is_plugin_active('affiliate-wp/affiliate-wp.php')) {
            return $option === 'get_name' ? 'affiliate-wp/affiliate-wp.php' : true;
        } else {
            return false;
        }
    }

    public function getAll()
    {
        if (!self::pluginActive()) {
            wp_send_json_error(__('AffiliateWP is not installed or activated', 'bit-integrations'));
        }

        $types = ['A new affiliate is approved', 'A user becomes an affiliate','An affiliate makes a referral of a specific type','An affiliates referral of a specific type is rejected Pro','An affiliates referral of a specific type is paid Pro'];
        
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
            wp_send_json_error(__('AffiliateWP is not installed or activated', 'bit-integrations'));
        }
        if (empty($data->id)) {
            wp_send_json_error(__('Trigger type doesn\'t exists', 'bit-integrations'));
        }
        $fields = self::fields($data->id);

        if (empty($fields)) {
            wp_send_json_error(__('Trigger doesn\'t exists any field', 'bit-integrations'));
        }

        
        $organizeType[] = [
            'type_id' => 'any',
            'type_name' => 'Any'
        ];

        $typeId = 1;
        foreach (affiliate_wp()->referrals->types_registry->get_types() as $type_keys => $type) {
            $organizeType[] = [
                'type_id' => $typeId,
                'type_name' => $type['label'],
                'type_key' => $type_keys
            ];
            $typeId++;
        }
        $responseData['allType'] = $organizeType;
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

        if ($id == '1' || $id == '2') {
            $fields = [
                'status' => (object) [
                    'fieldKey' => 'status',
                    'fieldName' => 'Status',
                ],
                'flat_rate_basis' => (object)[
                    'fieldKey' => 'flat_rate_basis',
                    'fieldName' => 'Flat Rate Basis',
                ],
                'payment_email' => (object)[
                    'fieldKey' => 'payment_email',
                    'fieldName' => 'Payment Email',
                ],
                'rate_type' => (object)[
                    'fieldKey' => 'rate_type',
                    'fieldName' => 'Rate Type',
                ],
                'affiliate_note' => (object)[
                    'fieldKey' => 'affiliate_note',
                    'fieldName' => 'Affiliate Note',
                ],
                'oldStatus' => (object) [
                    'fieldKey' => 'old_status',
                    'fieldName' => 'Old Status',
                ],
            ];
        } elseif ($id == '4' || $id == '5') {
            $fields = [
                'affiliate_id' => (object)[
                    'fieldKey' => 'affiliate_id',
                    'fieldName' => 'Affiliate ID',
                ],
                'affiliate_url' => (object)[
                    'fieldKey' => 'affiliate_url',
                    'fieldName' => 'Affiliate URL',
                ],
                'referral_description' => (object)[
                    'fieldKey' => 'referral_description',
                    'fieldName' => 'Referral Description',
                ],
                'amount' => (object)[
                    'fieldKey' => 'amount',
                    'fieldName' => 'Amount',
                ],
                'context' => (object)[
                    'fieldKey' => 'context',
                    'fieldName' => 'Context',
                ],
                'campaign' => (object)[
                    'fieldKey' => 'campaign',
                    'fieldName' => 'Campaign',
                ],
                'reference' => (object)[
                    'fieldKey' => 'reference',
                    'fieldName' => 'Reference',
                ],
                'status' => (object) [
                    'fieldKey' => 'status',
                    'fieldName' => 'Status',
                ],
                'flat_rate_basis' => (object)[
                    'fieldKey' => 'flat_rate_basis',
                    'fieldName' => 'Flat Rate Basis',
                ],
                'account_email' => (object)[
                    'fieldKey' => 'account_email',
                    'fieldName' => 'Account Email',
                ],
                'payment_email' => (object)[
                    'fieldKey' => 'payment_email',
                    'fieldName' => 'Payment Email',
                ],
                'rate_type' => (object)[
                    'fieldKey' => 'rate_type',
                    'fieldName' => 'Rate Type',
                ],
                'affiliate_note' => (object)[
                    'fieldKey' => 'affiliate_note',
                    'fieldName' => 'Affiliate Note',
                ],
                'oldStatus' => (object) [
                    'fieldKey' => 'old_status',
                    'fieldName' => 'Old Status',
                ],
            ];
        } elseif ($id = '3') {
            $fields = [
                'affiliate_id' => (object)[
                    'fieldKey' => 'affiliate_id',
                    'fieldName' => 'Affiliate ID',
                ],
                'affiliate_url' => (object)[
                    'fieldKey' => 'affiliate_url',
                    'fieldName' => 'Affiliate URL',
                ],
                'referral_description' => (object)[
                    'fieldKey' => 'referral_description',
                    'fieldName' => 'Referral Description',
                ],
                'amount' => (object)[
                    'fieldKey' => 'amount',
                    'fieldName' => 'Amount',
                ],
                'context' => (object)[
                    'fieldKey' => 'context',
                    'fieldName' => 'Context',
                ],
                'campaign' => (object)[
                    'fieldKey' => 'campaign',
                    'fieldName' => 'Campaign',
                ],
                'reference' => (object)[
                    'fieldKey' => 'reference',
                    'fieldName' => 'Reference',
                ],
                'flat_rate_basis' => (object)[
                    'fieldKey' => 'flat_rate_basis',
                    'fieldName' => 'Flat Rate Basis',
                ],
                'account_email' => (object)[
                    'fieldKey' => 'account_email',
                    'fieldName' => 'Account Email',
                ],
                'payment_email' => (object)[
                    'fieldKey' => 'payment_email',
                    'fieldName' => 'Payment Email',
                ],
                'rate_type' => (object)[
                    'fieldKey' => 'rate_type',
                    'fieldName' => 'Rate Type',
                ],
                'affiliate_note' => (object)[
                    'fieldKey' => 'affiliate_note',
                    'fieldName' => 'Affiliate Note',
                ],
            ];
        }
        

        foreach ($fields as $field) {
            if ($field->fieldKey === 'payment_email') {
                $fieldsNew[] = [
                    'name' => $field->fieldKey,
                    'type' => 'email',
                    'label' => $field->fieldName,
                ];
            } else {
                $fieldsNew[] = [
                    'name' => $field->fieldKey,
                    'type' => 'text',
                    'label' => $field->fieldName,
                ];
            }
        }
        return $fieldsNew;
    }

    public static function affiliateGetAllType()
    {
        $organizeType[] = [
            'type_id' => 'any',
            'type_name' => 'Any'
        ];
        $typeId = 1;
        foreach (affiliate_wp()->referrals->types_registry->get_types() as $type_keys => $type) {
            $organizeType[] = [
                'type_id' => $typeId,
                'type_name' => $type['label']
            ];
            $typeId++;
        }

        return $organizeType;
    }


    public static function newAffiliateApproved($affiliate_id, $status, $old_status)
    {
        $flows = Flow::exists('Affiliate', 1);
        if (!$flows) {
            return;
        }
        $user_id =  affwp_get_affiliate_user_id($affiliate_id);

        if (!$user_id) {
            return;
        }
        if ('pending' === $status) {
            return;
        }

        $affiliate = affwp_get_affiliate($affiliate_id);

        $user = get_user_by('id', $user_id);
        

        $data = [
            'status' => $status,
            'flat_rate_basis' => $affiliate->flat_rate_basis,
            'payment_email' => $affiliate->payment_email,
            'rate_type' => $affiliate->rate_type,
            'old_status' => $old_status,


        ];

        Flow::execute('Affiliate', 1, $data, $flows);
    }


    public static function userBecomesAffiliate($affiliate_id, $status, $old_status)
    {
        if ('active' !== $status) {
            return $status;
        }

        $flows = Flow::exists('Affiliate', 2);
        if (!$flows) {
            return;
        }
        $user_id =  affwp_get_affiliate_user_id($affiliate_id);

        if (!$user_id) {
            return;
        }

        $affiliate = affwp_get_affiliate($affiliate_id);

        $user = get_user_by('id', $user_id);
        

        $data = [
            'status' => $status,
            'flat_rate_basis' => $affiliate->flat_rate_basis,
            'payment_email' => $affiliate->payment_email,
            'rate_type' => $affiliate->rate_type,
            'old_status' => $old_status,


        ];

        Flow::execute('Affiliate', 2, $data, $flows);
    }


    public static function affiliateMakesReferral($referral_id)
    {
        $flows = Flow::exists('Affiliate', 3);
        if (!$flows) {
            return;
        }
        $referral = affwp_get_referral($referral_id);
        $affiliate = affwp_get_affiliate($referral->affiliate_id);
        $user_id = affwp_get_affiliate_user_id($referral->affiliate_id);
        $affiliateNote = maybe_serialize(affwp_get_affiliate_meta($affiliate->affiliate_id, 'notes', true));
        $user               = get_user_by('id', $user_id);
        $data = [
            'affiliate_id' => $referral->affiliate_id,
            'affiliate_url' => maybe_serialize(affwp_get_affiliate_referral_url(array( 'affiliate_id' => $referral->affiliate_id ))),
            'referral_description' => $referral->description,
            'amount' => $referral->amount,
            'context' => $referral->context,
            'campaign' => $referral->campaign,
            'reference' => $referral->reference,
            'flat_rate_basis' => $affiliate->flat_rate_basis,
            'account_email' => $user->user_email,
            'payment_email' => $affiliate->payment_email,
            'rate_type' => $affiliate->rate_type,
            'affiliate_note' => $affiliateNote,

        ];

        foreach ($flows as $flow) {
            if (is_string($flow->flow_details)) {
                $flow->flow_details = json_decode($flow->flow_details);
                $flowDetails = $flow->flow_details;
            }
        }

        $allTypes = $flowDetails->allType;

        $selectedTypeID = $flowDetails->selectedType;


        foreach ($allTypes as $type) {
            if ($referral->type == $type->type_key && $type->type_id == $selectedTypeID) {
                Flow::execute('Affiliate', 3, $data, $flows);
                break;
            }
        }

        if ($selectedTypeID == 'any') {
            Flow::execute('Affiliate', 3, $data, $flows);
        }
    }


    public static function affiliatesReferralSpecificTypeRejected($referral_id, $new_status, $old_status)
    {
        $flows = Flow::exists('Affiliate', 4);
        if (!$flows) {
            return;
        }
        
        
        if ((string) $new_status === (string) $old_status || 'rejected' !== (string) $new_status) {
            return $new_status;
        }
       
        $referral      = affwp_get_referral($referral_id);
        $type          = $referral->type;
        $user_id       = affwp_get_affiliate_user_id($referral->affiliate_id);
        $user               = get_user_by('id', $user_id);
        $affiliate          = affwp_get_affiliate($referral->affiliate_id);
        $affiliateNote = maybe_serialize(affwp_get_affiliate_meta($affiliate->affiliate_id, 'notes', true));
        

        foreach ($flows as $flow) {
            if (is_string($flow->flow_details)) {
                $flow->flow_details = json_decode($flow->flow_details);
                $flowDetails = $flow->flow_details;
            }
        }

        $allTypes = $flowDetails->allType;

        $selectedTypeID = $flowDetails->selectedType;

        $data = [
            'affiliate_id' => $referral->affiliate_id,
            'affiliate_url' => maybe_serialize(affwp_get_affiliate_referral_url(array( 'affiliate_id' => $referral->affiliate_id ))),
            'referral_description' => $referral->description,
            'amount' => $referral->amount,
            'context' => $referral->context,
            'campaign' => $referral->campaign,
            'reference' => $referral->reference,
            'status' => $new_status,
            'flat_rate_basis' => $affiliate->flat_rate_basis,
            'account_email' => $user->user_email,
            'payment_email' => $affiliate->payment_email,
            'rate_type' => $affiliate->rate_type,
            'affiliate_note' => $affiliateNote,
            'old_status' => $old_status,

        ];

        foreach ($allTypes as $type) {
            if ($referral->type == $type->type_key && $type->type_id == $selectedTypeID) {
                Flow::execute('Affiliate', 4, $data, $flows);
            }
        }

        if ($selectedTypeID == 'any') {
            Flow::execute('Affiliate', 4, $data, $flows);
        }
    }
    
    public static function affiliatesReferralSpecificTypePaid($referral_id, $new_status, $old_status)
    {
        $flows = Flow::exists('Affiliate', 5);
        if (!$flows) {
            return;
        }
        
        
        if ((string) $new_status === (string) $old_status || 'paid' !== (string) $new_status) {
            return $new_status;
        }
       
        $referral      = affwp_get_referral($referral_id);
        $type          = $referral->type;
        $user_id       = affwp_get_affiliate_user_id($referral->affiliate_id);
        $user               = get_user_by('id', $user_id);
        $affiliate          = affwp_get_affiliate($referral->affiliate_id);
        $affiliateNote = maybe_serialize(affwp_get_affiliate_meta($affiliate->affiliate_id, 'notes', true));
      

        foreach ($flows as $flow) {
            if (is_string($flow->flow_details)) {
                $flow->flow_details = json_decode($flow->flow_details);
                $flowDetails = $flow->flow_details;
            }
        }

        $allTypes = $flowDetails->allType;

        $selectedTypeID = $flowDetails->selectedType;

        $data = [
            'affiliate_id' => $referral->affiliate_id,
            'affiliate_url' => maybe_serialize(affwp_get_affiliate_referral_url(array( 'affiliate_id' => $referral->affiliate_id ))),
            'referral_description' => $referral->description,
            'amount' => $referral->amount,
            'context' => $referral->context,
            'campaign' => $referral->campaign,
            'reference' => $referral->reference,
            'status' => $new_status,
            'flat_rate_basis' => $affiliate->flat_rate_basis,
            'account_email' => $user->user_email,
            'payment_email' => $affiliate->payment_email,
            'rate_type' => $affiliate->rate_type,
            'affiliate_note' => $affiliateNote,
            'old_status' => $old_status,

        ];

        foreach ($allTypes as $type) {
            if ($referral->type == $type->type_key && $type->type_id == $selectedTypeID) {
                Flow::execute('Affiliate', 5, $data, $flows);
            }
        }

        if ($selectedTypeID == 'any') {
            Flow::execute('Affiliate', 5, $data, $flows);
        }
    }
}
