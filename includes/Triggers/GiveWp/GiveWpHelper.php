<?php

namespace BitCode\FI\Triggers\GiveWp;

final class GiveWpHelper
{
    public static function getGiveWpField($id)
    {
        if ($id == 1) {
            return [
                'Title' => (object) [
                    'fieldKey' => 'title',
                    'fieldName' => 'Title'
                ],
                'First Name' => (object) [
                    'fieldKey' => 'first_name',
                    'fieldName' => 'First Name'
                ],
                'Last Name' => (object) [
                    'fieldKey' => 'last_name',
                    'fieldName' => 'Last Name'
                ],
                'Email' => (object) [
                    'fieldKey' => 'email',
                    'fieldName' => 'Email',
                ],
                'Donar ID' => (object) [
                    'fieldKey' => 'donar_id',
                    'fieldName' => 'Donar ID',
                ],
                'Donation Amount' => (object) [
                    'fieldKey' => 'donation_amount',
                    'fieldName' => 'Donation Amount',
                ],
                'Currency' => (object) [
                    'fieldKey' => 'currency',
                    'fieldName' => 'Currency',
                ],
                'Comment' => (object) [
                    'fieldKey' => 'comment',
                    'fieldName' => 'Comment',
                ],
                'address1' => (object) [
                    'fieldKey' => 'address1',
                    'fieldName' => 'Address 1',
                ],
                'address2' => (object) [
                    'fieldKey' => 'address2',
                    'fieldName' => 'Address 2',
                ],
                'city' => (object) [
                    'fieldKey' => 'city',
                    'fieldName' => 'City',
                ],
                'state' => (object) [
                    'fieldKey' => 'state',
                    'fieldName' => 'State',
                ],
                'zip' => (object) [
                    'fieldKey' => 'zip',
                    'fieldName' => 'Zip',
                ],
                'country' => (object) [
                    'fieldKey' => 'country',
                    'fieldName' => 'Country',
                ],
                'Give Form ID' => (object) [
                    'fieldKey' => 'give_form_id',
                    'fieldName' => 'Give Form ID',
                ],
                'Give Form Title' => (object) [
                    'fieldKey' => 'give_form_title',
                    'fieldName' => 'Give Form Title',
                ],
                'Currency' => (object) [
                    'fieldKey' => 'currency',
                    'fieldName' => 'Currency',
                ],
                'Give Price ID' => (object) [
                    'fieldKey' => 'give_price_id',
                    'fieldName' => 'Give Price ID',
                ],
                'Price' => (object) [
                    'fieldKey' => 'price',
                    'fieldName' => 'Price',
                ],

            ];
        } elseif ($id == 2) {
            $fields = [
                'Subscription ID' => (object) [
                    'fieldKey' => 'subscription_id',
                    'fieldName' => 'Subscription ID',
                ],
                'Give Form ID' => (object) [
                    'fieldKey' => 'give_form_id',
                    'fieldName' => 'Give Form ID',
                ],
                'Amount' => (object) [
                    'fieldKey' => 'amount',
                    'fieldName' => 'Amount',
                ],
                'Donor' => (object) [
                    'fieldKey' => 'donor',
                    'fieldName' => 'Donor',
                ],
                'User ID' => (object) [
                    'fieldKey' => 'user_id',
                    'fieldName' => 'User ID',
                ],
            ];
            return  array_merge($fields, self::userInfoField());
        } elseif ($id == 3) {
            $fields = [
                'give_form_id' => (object) [
                    'fieldKey' => 'give_form_id',
                    'fieldName' => 'Give Form ID',
                ],
                'recurring_amount' => (object) [
                    'fieldKey' => 'recurring_amount',
                    'fieldName' => 'Recurring Amount',
                ],
                'total_payment' => (object) [
                    'fieldKey' => 'total_payment',
                    'fieldName' => 'Total payment',
                ],
                'donor' => (object) [
                    'fieldKey' => 'donor',
                    'fieldName' => 'Donor',
                ],
                'User ID' => (object) [
                    'fieldKey' => 'user_id',
                    'fieldName' => 'User ID',
                ],

            ];
            return  array_merge($fields, self::userInfoField());
        }
        return [];
    }
    public static function userInfoField()
    {
        return [
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
    public static function getAllRecurringData()
    {
        global $wpdb;

        return $recurringForms = $wpdb->get_results(
            $wpdb->prepare(
                "SELECT ID, post_title FROM $wpdb->posts
        LEFT JOIN {$wpdb->prefix}give_formmeta ON ($wpdb->posts.ID = {$wpdb->prefix}give_formmeta.form_id)
        WHERE $wpdb->posts.post_status = 'publish' AND $wpdb->posts.post_type = 'give_forms' AND {$wpdb->prefix}give_formmeta.meta_key = '_give_recurring'"
            )
        );
    }

    public static function getUserInfo($user_id)
    {
        $userInfo = get_userdata($user_id);
        $user = [];
        if ($userInfo) {
            $userData = $userInfo->data;
            $user_meta = get_user_meta($user_id);
            $user = [
                'first_name' => $user_meta['first_name'][0],
                'last_name' => $user_meta['last_name'][0],
                'user_email' => $userData->user_email,
                'nickname' => $userData->user_nicename,
                'avatar_url' => get_avatar_url($user_id),
            ];
        }
        return $user;
    }
}
