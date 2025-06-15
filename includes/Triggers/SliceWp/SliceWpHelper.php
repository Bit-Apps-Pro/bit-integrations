<?php
namespace BitCode\FI\Triggers\SliceWp;

final class SliceWpHelper
{
    public static function getSliceWpNewAffiliateField()
    {
        return [
            'affiliate_id' => (object)[
                'fieldKey' => 'affiliate_id',
                'fieldName' => 'Affiliate ID',
            ],
            'user_id' => (object)[
                'fieldKey' => 'user_id',
                'fieldName' => 'User ID',
            ],
            'payment_email' => (object)[
                'fieldKey' => 'payment_email',
                'fieldName' => 'Payment Email',
            ],
            'website' => (object)[
                'fieldKey' => 'website',
                'fieldName' => 'Website URL',
            ],
            'date_created' => (object)[
                'fieldKey' => 'date_created',
                'fieldName' => 'Date Created',
            ],
            'status' => (object)[
                'fieldKey' => 'status',
                'fieldName' => 'Status',
            ],
        ];
    }

    public static function getCommissionField()
    {
        return [
            'commission_id' => (object)[
                'fieldKey' => 'commission_id',
                'fieldName' => 'Commission ID',
            ],
            'affiliate_id' => (object)[
                'fieldKey' => 'affiliate_id',
                'fieldName' => 'Affiliate ID',
            ],
            'date_created' => (object)[
                'fieldKey' => 'date_created',
                'fieldName' => 'Date Created',
            ],
            'amount' => (object)[
                'fieldKey' => 'amount',
                'fieldName' => 'Amount',
            ],
            'reference' => (object)[
                'fieldKey' => 'reference',
                'fieldName' => 'Reference',
            ],
            'origin' => (object)[
                'fieldKey' => 'origin',
                'fieldName' => 'Origin',
            ],
            'type' => (object)[
                'fieldKey' => 'type',
                'fieldName' => 'Type',
            ],
            'status' => (object)[
                'fieldKey' => 'status',
                'fieldName' => 'Status',
            ],
            'currency' => (object)[
                'fieldKey' => 'currency',
                'fieldName' => 'Currency',
            ],
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
