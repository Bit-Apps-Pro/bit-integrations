<?php
namespace BitCode\FI\Triggers\Memberpress;

final class MemberpressHelper
{
    public static function getOneTimeField()
    {
        return [
            'ID' => (object)[
                'fieldKey' => 'ID',
                'fieldName' => 'Membership ID',
            ],
            'post_title' => (object)[
                'fieldKey' => 'post_title',
                'fieldName' => 'Membership Name',
            ],
            'post_content' => (object)[
                'fieldKey' => 'post_content',
                'fieldName' => 'Membership Description',
            ],
        ];
    }

    public static function getMembershipCancelField()
    {
        return [
            'id' => (object)[
                'fieldKey' => 'id',
                'fieldName' => 'Subscription ID',
            ],
            'subscr_id' => (object)[
                'fieldKey' => 'subscr_id',
                'fieldName' => 'Subscription ID',
            ],
            'gateway' => (object)[
                'fieldKey' => 'gateway',
                'fieldName' => 'Subscription Gateway',
            ],
            'user_id' => (object)[
                'fieldKey' => 'user_id',
                'fieldName' => 'User ID',
            ],
            'product_id' => (object)[
                'fieldKey' => 'product_id',
                'fieldName' => 'Product ID',
            ],
            'price' => (object)[
                'fieldKey' => 'price',
                'fieldName' => 'Price',
            ],
            'period_type' => (object)[
                'fieldKey' => 'period_type',
                'fieldName' => 'Period Type',
            ],
            'trial_amount' => (object)[
                'fieldKey' => 'trial_amount',
                'fieldName' => 'Trial Amount',
            ],
        ];
    }

    public static function getRecurringField()
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

    public static function getUserField()
    {
        return [
            'User ID' => (object) [
                'fieldKey' => 'user_id',
                'fieldName' => 'User ID'
            ],
            'First Name' => (object) [
                'fieldKey' => 'first_name',
                'fieldName' => 'First Name'
            ],
            'Last Name' => (object) [
                'fieldKey' => 'last_name',
                'fieldName' => 'Last Name'
            ],
            'Nick Name' => (object) [
                'fieldKey' => 'nickname',
                'fieldName' => 'Nick Name'
            ],
            'Avatar URL' => (object) [
                'fieldKey' => 'avatar_url',
                'fieldName' => 'Avatar URL'
            ],
            'Email' => (object) [
                'fieldKey' => 'user_email',
                'fieldName' => 'Email',
            ],
        ];
    }
}
