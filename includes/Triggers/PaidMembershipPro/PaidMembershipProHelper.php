<?php
namespace BitCode\FI\Triggers\PaidMembershipPro;

final class PaidMembershipProHelper
{
    public static function getPaidMembershipProField()
    {
        return [
            'id' => (object)[
                'fieldKey' => 'id',
                'fieldName' => 'Membership ID',
            ],
            'name' => (object)[
                'fieldKey' => 'name',
                'fieldName' => 'Name',
            ],
            'description' => (object)[
                'fieldKey' => 'description',
                'fieldName' => 'Description',
            ],
            'confirmation' => (object)[
                'fieldKey' => 'confirmation',
                'fieldName' => 'Confirmation',
            ],
            'initial_payment' => (object)[
                'fieldKey' => 'initial_payment',
                'fieldName' => 'Initial Payment',
            ],
            'billing_amount' => (object)[
                'fieldKey' => 'billing_amount',
                'fieldName' => 'Billing Amount',
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
