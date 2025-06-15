<?php
namespace BitCode\FI\Triggers\SolidAffiliate;

final class SolidAffiliateHelper
{
    public static function getAffiliateField()
    {
        return [
            'user_id' => (object)[
                'fieldKey' => 'user_id',
                'fieldName' => 'User ID',
            ],
            'first_name' => (object)[
                'fieldKey' => 'first_name',
                'fieldName' => 'First Name',
            ],

            'last_name' => (object)[
                'fieldKey' => 'last_name',
                'fieldName' => 'Last Name',
            ],
            'commission_type' => (object)[
                'fieldKey' => 'commission_type',
                'fieldName' => 'Commission Type',
            ],
            'commission_rate' => (object)[
                'fieldKey' => 'commission_rate',
                'fieldName' => 'Commission Rate',
            ],
            'payment_email' => (object)[
                'fieldKey' => 'payment_email',
                'fieldName' => 'Payment Email',
            ],
            'mailchimp_user_id' => (object) [
                'fieldKey' => 'mailchimp_user_id',
                'fieldName' => 'Mailchimp User ID',
            ],
            'affiliate_group_id' => (object) [
                'fieldKey' => 'affiliate_group_id',
                'fieldName' => 'Affiliate Group ID',
            ],
            'registration_notes' => (object) [
                'fieldKey' => 'registration_notes',
                'fieldName' => 'Registration Notes',
            ],
            'status' => (object)[
                'fieldKey' => 'status',
                'fieldName' => 'Status',
            ],
            'created_at' => (object) [
                'fieldKey' => 'created_at',
                'fieldName' => 'Created At',
            ],
            'updated_at' => (object) [
                'fieldKey' => 'updated_at',
                'fieldName' => 'Updated At',
            ],

        ];
    }

    public static function getReferralAffiliateField()
    {
        return [
            'affiliate_id' => (object)[
                'fieldKey' => 'affiliate_id',
                'fieldName' => 'Affiliate ID',
            ],
            'order_amount' => (object)[
                'fieldKey' => 'order_amount',
                'fieldName' => 'Order Amount',
            ],
            'commission_amount' => (object)[
                'fieldKey' => 'commission_amount',
                'fieldName' => 'Commission Amount',
            ],
            'referral_source' => (object)[
                'fieldKey' => 'referral_source',
                'fieldName' => 'Referral Source',
            ],
            'visit_id' => (object)[
                'fieldKey' => 'visit_id',
                'fieldName' => 'Visit ID',
            ],
            'coupon_id' => (object)[
                'fieldKey' => 'coupon_id',
                'fieldName' => 'Coupon ID',
            ],
            'customer_id' => (object)[
                'fieldKey' => 'customer_id',
                'fieldName' => 'Customer ID',
            ],
            'referral_type' => (object)[
                'fieldKey' => 'referral_type',
                'fieldName' => 'Referral Type',
            ],
            'description' => (object)[
                'fieldKey' => 'description',
                'fieldName' => 'Description',
            ],
            'order_source' => (object)[
                'fieldKey' => 'order_source',
                'fieldName' => 'Order Source',
            ],
            'order_id' => (object)[
                'fieldKey' => 'order_id',
                'fieldName' => 'Order ID',
            ],
            'payout_id' => (object)[
                'fieldKey' => 'payout_id',
                'fieldName' => 'Payout ID',
            ],
            'status' => (object)[
                'fieldKey' => 'status',
                'fieldName' => 'Status',
            ],
            'created_at' => (object) [
                'fieldKey' => 'created_at',
                'fieldName' => 'Created At',
            ],
            'updated_at' => (object) [
                'fieldKey' => 'updated_at',
                'fieldName' => 'Updated At',
            ]
        ];
    }
}
