<?php
namespace BitCode\FI\Triggers\Rafflepress;

final class RafflepressHelper
{
    public static function getRafflepressField()
    {
        return [
            'giveaway_id' => (object)[
                'fieldKey' => 'giveaway_id',
                'fieldName' => 'Giveaway ID',
            ],
            'giveaway_name' => (object)[
                'fieldKey' => 'giveaway_name',
                'fieldName' => 'Giveaway Name',
            ],

            'starts' => (object)[
                'fieldKey' => 'starts',
                'fieldName' => 'Starts',
            ],
            'ends' => (object)[
                'fieldKey' => 'ends',
                'fieldName' => 'Ends',
            ],
            'active' => (object)[
                'fieldKey' => 'active',
                'fieldName' => 'Active',
            ],
            'name' => (object)[
                'fieldKey' => 'name',
                'fieldName' => 'Name',
            ],
            'first_name' => (object) [
                'fieldKey' => 'first_name',
                'fieldName' => 'First Name',
            ],
            'last_name' => (object) [
                'fieldKey' => 'last_name',
                'fieldName' => 'Last Name',
            ],
            'email' => (object) [
                'fieldKey' => 'email',
                'fieldName' => 'Email',
            ],
            'prize_name' => (object)[
                'fieldKey' => 'prize_name',
                'fieldName' => 'Prize Name',
            ],
            'prize_description' => (object) [
                'fieldKey' => 'prize_description',
                'fieldName' => 'Prize Description',
            ],
            'prize_image' => (object) [
                'fieldKey' => 'prize_image',
                'fieldName' => 'Prize Image',
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
